export const SERVICE_REQUEST_PATH = "/solicitar-atendimento";

type ServiceRequestOptions = {
  interesse?: string;
  origem?: string;
};

export function buildServiceRequestUrl(options: ServiceRequestOptions = {}) {
  const search = new URLSearchParams();

  if (options.interesse) search.set("interesse", options.interesse);
  if (options.origem) search.set("origem", options.origem);

  const query = search.toString();
  return query ? `${SERVICE_REQUEST_PATH}?${query}` : SERVICE_REQUEST_PATH;
}
