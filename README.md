# M3VGT project page

Static academic website for **Giving Motion a Body: Synthesizing Robot Mechanisms from Mesh and Motion**.

Website: https://m3vgt.github.io/

The repository also hosts the **GeoTrussRover** project page at
https://m3vgt.github.io/geotrussrover/. Its self-contained source and media live
under `geotrussrover/`; the root project page links to it from the main navigation.

## Deployment

GitHub Pages serves the root of the `main` branch. `.nojekyll` keeps the site static. No install step, build service, API keys, analytics, or external runtime assets are required.

Open `index.html` directly for a local preview. Page sections live in `index.html`, appearance in `style.css`, interactions in `app.js`, and measured result values in `data.js`.

Paper and data download links, and the citation section, are intentionally not published yet. Original research outputs are not included in this website repository.

Execution clips are presentation copies with the top title strip cropped. Frame count, frame rate, duration, and numerical measurements are unchanged. `public-asset-manifest.json` records hashes of the published assets.

## Design references

Page organization references [Nerfies](https://nerfies.github.io/) and the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template). Page implementation and research media are specific to this project. The Lucide license is retained in `assets/vendor/LUCIDE-LICENSE`.
