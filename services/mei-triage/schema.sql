CREATE TABLE IF NOT EXISTS mei_cases (
 sid text PRIMARY KEY, cnpj varchar(14) NOT NULL, client_hash text NOT NULL,
 state text NOT NULL DEFAULT 'queued' CHECK(state IN ('queued','working','ready','cancelled')),
 source jsonb NOT NULL DEFAULT '{}', answers jsonb NOT NULL DEFAULT '{}', revision integer NOT NULL DEFAULT 0,
 attempts integer NOT NULL DEFAULT 0, lease_token uuid, lease_until timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT now()+interval '24 hours'
);
CREATE INDEX IF NOT EXISTS mei_queue_idx ON mei_cases(state,created_at);
CREATE INDEX IF NOT EXISTS mei_client_idx ON mei_cases(client_hash,created_at);
CREATE TABLE IF NOT EXISTS mei_events (
 id bigserial PRIMARY KEY, sid text NOT NULL REFERENCES mei_cases(sid) ON DELETE CASCADE,
 kind text NOT NULL, data jsonb NOT NULL DEFAULT '{}', at timestamptz NOT NULL DEFAULT now()
);
