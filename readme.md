# open-data-scraper

Scraper that re-publishes several open datasets which are either hard to locate (no stable URL) or hard to use (complicated format), or both. For public-transport data, see [public-transport-data-scraper](https://github.com/juliuste/public-transport-data-scraper) instead.

## Datasets

Dataset | License | Attribution | Customizations | Stable URL
------- | ------- | ----------- | -------------- | ----------
[VG250-EW](https://gdz.bkg.bund.de/index.php/default/verwaltungsgebiete-1-250-000-mit-einwohnerzahlen-stand-31-12-vg250-ew-31-12.html) - Administrative areas and population counts in Germany, scale 1:250.000 | [DL-DE->BY 2.0](https://www.govdata.de/dl-de/by-2-0) with [exception for usage on OpenStreetMap](https://sg.geodatenzentrum.de/web_public/gdz/lizenz/deu/Datenlizenz_Deutschland_Erg%C3%A4nzungstext_Namensnennung.pdf) | © GeoBasis-DE, `CURRENT YEAR` (daten verändert) | Data is originally provided as [ESRI shapefiles](https://en.wikipedia.org/wiki/Shapefile). The scraper transforms these to (Geo)JSON, renames/maps most attributes and merges everything into one JSON document. [See docs](./scrapers/vg250-ew/readme.md) | `https://scraped.data.juliustens.eu/vg250-ew/data.json.gz`

## Contributing

If you found a bug or want to propose/add a new dataset, feel free to visit [the issues page](https://github.com/juliuste/open-data-scraper/issues), or open a pull request.
