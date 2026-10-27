# Attributions

InvaderGIS — Historical Data Visualizer.

This file is the canonical record of upstream data sources incorporated into the
dataset and the attribution / share-alike obligations that travel with them. When
you reuse the data you must respect **both** the project licences (see
[`LICENSE`](LICENSE)) **and** every upstream licence below. This mirrors the
README "Data sources" section and the in-app **Settings → Guides → Attribution**
page.

> **Note:** A previously-listed source, **WALS (World Atlas of Language
> Structures, CC BY 4.0)**, has been **fully removed** from the project. The
> synchronic 20th-century language layer (records, map layer, and `language`
> record kind) was deleted as out of scope for a 500–1500 CE atlas. Languages are
> now recorded only as an attribute of each polity. WALS therefore carries **no
> remaining attribution obligation** here. See [`docs/SOURCING.md`](docs/SOURCING.md).

---

## Primary corpora

| Corpus | Role | Status / terms |
|---|---|---|
| **Internet Medieval Sourcebook** (IMS) — Fordham University, ed. Paul Halsall | Primary corpus; the bulk of merged records cite it | Public-domain / copy-permitted, 500–1500 CE. Each `ims_fordham*` source record links back to its Fordham page. |
| **Medieval Digital Resources** (MDR) — Medieval Academy of America | Verification layer (confirms a modern peer-reviewed edition exists) | Curation aid, **not** a redistributed data source. |

See [`docs/SOURCING.md`](docs/SOURCING.md) for the full sourcing policy, the
`ims_fordham*` id conventions, and the human-in-the-loop verification workflow.

---

## Upstream structured-data & geometry sources

| Source | Contribution | Licence | SPDX | Share-alike |
|---|---|---|---|:---:|
| [Wikidata](https://www.wikidata.org/) | QID backbone; dates, capitals, rulers | CC0 1.0 | `CC0-1.0` | — |
| [PLEIADES](https://pleiades.stoa.org/) (ISAW, NYU) | Settlement gazetteer; capital coordinates | CC BY 3.0 | `CC-BY-3.0` | — |
| [Cliopatria / Historical Basemaps](https://github.com/aourednik/historical-basemaps) | Historical polity polygon shapes | CC BY-SA 4.0 | `CC-BY-SA-4.0` | **yes** |
| [Natural Earth](https://www.naturalearthdata.com/) | Coastlines, rivers, lakes, graticule | Public domain | `publicdomain` | — |
| [OpenHistoricalMap](https://www.openhistoricalmap.org/) | Historical settlements, routes | ODbL 1.0 | `ODbL-1.0` | **yes** |

### Obligations on redistribution

- **PLEIADES (CC BY 3.0)** — requires **attribution** when its gazetteer data is
  redistributed.
- **Cliopatria / Historical Basemaps (CC BY-SA 4.0)** — requires **attribution**
  **and is share-alike**: derivative datasets that incorporate these polygon
  shapes must be released under CC BY-SA 4.0 (or a compatible licence).
- **OpenHistoricalMap (ODbL 1.0)** — requires **attribution** and is
  **share-alike** for derivative databases (the ODbL "share-alike" clause).
- **Wikidata (CC0)** and **Natural Earth (public domain)** — no attribution
  obligation, included here for transparency.

> **Share-alike caution:** because Cliopatria (CC BY-SA 4.0) and OpenHistoricalMap
> (ODbL 1.0) are share-alike, building a *derivative dataset* on top of the InvaderGIS
> corpus may obligate you to release that derivative under the corresponding
> share-alike terms. Assess this before publishing a derivative. The project's own
> CC BY-NC 4.0 data licence (see `LICENSE`) covers the curation/schema/aggregation
> only and does **not** override these upstream licences.

---

## Software dependencies

The application bundles these open-source libraries (see `package.json` for exact
versions): React & React-DOM (MIT), MapLibre GL JS (BSD-3-Clause), PMTiles
(BSD-3-Clause), Zustand (MIT), and the bundled web fonts (Inter, Fraunces,
Spectral, IBM Plex Mono — all SIL Open Font License 1.1). Their licence texts ship
with the respective packages under `node_modules/`.

---

*Questions about attribution or reuse: open an issue on the
[project repository](https://github.com/g-lanza/InvaderGIS).*
