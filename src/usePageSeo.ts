import { useEffect } from "react";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

function getOrCreateMeta(selector: string, attribute: "name" | "property", value: string) {
  const existing = document.querySelector<HTMLMetaElement>(selector);
  if (existing) return { element: existing, created: false };
  const element = document.createElement("meta");
  element.setAttribute(attribute, value);
  document.head.appendChild(element);
  return { element, created: true };
}

export function usePageSeo({ title, description, path, image }: PageSeo) {
  useEffect(() => {
    const url = `https://www.nacionalcon.com${path}`;
    const previousTitle = document.title;
    const descriptionMeta = getOrCreateMeta('meta[name="description"]', "name", "description");
    const ogTitle = getOrCreateMeta('meta[property="og:title"]', "property", "og:title");
    const ogDescription = getOrCreateMeta('meta[property="og:description"]', "property", "og:description");
    const ogUrl = getOrCreateMeta('meta[property="og:url"]', "property", "og:url");
    const ogImage = image
      ? getOrCreateMeta('meta[property="og:image"]', "property", "og:image")
      : undefined;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement("link");
    const canonicalCreated = !canonical.parentNode;
    const previousCanonical = canonical.href;
    const metaItems = [descriptionMeta, ogTitle, ogDescription, ogUrl, ...(ogImage ? [ogImage] : [])];
    const previousValues = metaItems.map(({ element }) => element.content);

    document.title = title;
    descriptionMeta.element.content = description;
    ogTitle.element.content = title;
    ogDescription.element.content = description;
    ogUrl.element.content = url;
    if (ogImage) ogImage.element.content = `https://www.nacionalcon.com${image}`;
    canonical.rel = "canonical";
    canonical.href = url;
    if (canonicalCreated) document.head.appendChild(canonical);

    return () => {
      document.title = previousTitle;
      metaItems.forEach((item, index) => {
        if (item.created) item.element.remove();
        else item.element.content = previousValues[index];
      });
      if (canonicalCreated) canonical.remove();
      else canonical.href = previousCanonical;
    };
  }, [description, image, path, title]);
}
