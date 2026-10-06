begin;

create schema if not exists portal_private;
revoke all on schema portal_private from public, anon, authenticated;
grant usage on schema portal_private to authenticated, service_role;

create table public.portal_companies (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null check (length(legal_name) between 1 and 200),
  trade_name text,
  cnpj text not null unique check (cnpj ~ '^[0-9]{14}$'),
  tax_regime text,
  contact_email text,
  contact_phone text,
  address text,
  created_at timestamptz not null default now()
);
create table public.portal_memberships (
  company_id uuid not null references public.portal_companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (company_id, user_id)
);
create index portal_memberships_user_idx on public.portal_memberships(user_id, company_id) where active;
create table public.portal_documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.portal_companies(id) on delete cascade,
  title text not null check (length(title) between 1 and 200),
  period text,
  storage_path text not null unique,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  check (storage_path like company_id::text || '/%')
);
create index portal_documents_company_idx on public.portal_documents(company_id, created_at desc);
create table public.portal_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.portal_companies(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  subject text not null check (length(trim(subject)) between 1 and 160),
  message text not null check (length(trim(message)) between 1 and 4000),
  status text not null default 'open' check (status in ('open', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);
create index portal_requests_company_idx on public.portal_requests(company_id, created_at desc);

-- Deliberately reads membership as owner to avoid recursive policies. Identity always comes from auth.uid().
create function portal_private.has_company_access(p_company uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.portal_memberships m
    where m.company_id = p_company and m.user_id = (select auth.uid()) and m.active
  );
$$;
revoke all on function portal_private.has_company_access(uuid) from public, anon;
grant execute on function portal_private.has_company_access(uuid) to authenticated;

alter table public.portal_companies enable row level security;
alter table public.portal_memberships enable row level security;
alter table public.portal_documents enable row level security;
alter table public.portal_requests enable row level security;
revoke all on public.portal_companies, public.portal_memberships, public.portal_documents, public.portal_requests
  from public, anon, authenticated;
grant select on public.portal_companies, public.portal_memberships, public.portal_documents, public.portal_requests to authenticated;
grant insert (company_id, created_by, subject, message, status) on public.portal_requests to authenticated;
grant all on public.portal_companies, public.portal_memberships, public.portal_documents, public.portal_requests to service_role;

create policy portal_company_read on public.portal_companies for select to authenticated
  using (portal_private.has_company_access(id));
create policy portal_membership_read on public.portal_memberships for select to authenticated
  using (user_id = (select auth.uid()) and active);
create policy portal_document_read on public.portal_documents for select to authenticated
  using (published and portal_private.has_company_access(company_id));
-- Client messages only. Internal team notes must be stored separately.
create policy portal_request_read on public.portal_requests for select to authenticated
  using (portal_private.has_company_access(company_id));
create policy portal_request_create on public.portal_requests for insert to authenticated
  with check (created_by = (select auth.uid()) and status = 'open' and portal_private.has_company_access(company_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portal-documents', 'portal-documents', false, 20971520, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
-- No customer upload, update or delete policy. A path alone is not sufficient: there must be a published row.
create policy portal_storage_read on storage.objects for select to authenticated
using (
  bucket_id = 'portal-documents' and exists (
    select 1 from public.portal_documents d
    where d.storage_path = name and d.published and portal_private.has_company_access(d.company_id)
  )
);

create table portal_private.rate_limits (
  key text primary key check (key ~ '^[a-f0-9]{64}$'),
  window_start timestamptz not null default now(),
  attempts integer not null default 1
);
create index portal_rate_limits_window_idx on portal_private.rate_limits(window_start);
revoke all on portal_private.rate_limits from public, anon, authenticated;
create function public.portal_consume_rate_limit(p_key text, p_limit integer)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare hits integer;
begin
  if p_limit < 1 or p_limit > 100 or p_key !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid rate limit';
  end if;
  insert into portal_private.rate_limits as r (key) values (p_key)
  on conflict (key) do update set
    attempts = case when r.window_start < now() - interval '15 minutes' then 1 else least(r.attempts + 1, 101) end,
    window_start = case when r.window_start < now() - interval '15 minutes' then now() else r.window_start end
  returning attempts into hits;
  delete from portal_private.rate_limits where window_start < now() - interval '1 day';
  return jsonb_build_object('allowed', hits <= p_limit);
end;
$$;
revoke all on function public.portal_consume_rate_limit(text, integer) from public, anon, authenticated;
grant execute on function public.portal_consume_rate_limit(text, integer) to service_role;

create table portal_private.membership_events (
  id bigint generated always as identity primary key,
  happened_at timestamptz not null default now(),
  actor_user_id uuid,
  database_actor text not null,
  operation text not null,
  company_id uuid not null,
  user_id uuid not null,
  active boolean
);
revoke all on portal_private.membership_events from public, anon, authenticated;
grant select on portal_private.membership_events to service_role;
create function portal_private.audit_membership()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if TG_OP = 'DELETE' then
    insert into portal_private.membership_events(actor_user_id, database_actor, operation, company_id, user_id, active)
    values (auth.uid(), current_setting('role'), TG_OP, OLD.company_id, OLD.user_id, OLD.active);
    return OLD;
  end if;
  insert into portal_private.membership_events(actor_user_id, database_actor, operation, company_id, user_id, active)
  values (auth.uid(), current_setting('role'), TG_OP, NEW.company_id, NEW.user_id, NEW.active);
  return NEW;
end;
$$;
revoke all on function portal_private.audit_membership() from public, anon, authenticated;
create trigger portal_membership_audit after insert or update or delete on public.portal_memberships
for each row execute function portal_private.audit_membership();
commit;
