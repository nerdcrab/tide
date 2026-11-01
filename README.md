# Tide

A static games and browser site. HTML, CSS, JavaScript and local artwork; no build step is needed for GitHub Pages.

## Hosting

Publish the `main` branch root with GitHub Pages. Relative asset paths and a scope-relative service worker support the `/tide/` project path. Open the HTTPS site, rather than a downloaded file, to use the browser.

## Files

- `index.html`, `style.css`, `app.js` — interface and interactions
- `themes.js` — eight complete palettes
- `logos.js`, `logo.png`, `covers-*.webp` — locally hosted app logos, Tide logo and game cover atlases
- `data.js` — 240 deduplicated HTML game entries
- `proxy.js`, `sw.js` — browser setup and service worker
- `scramjet.*`, `baremux*`, `libcurl.mjs` — proxy client dependencies

The browser uses Scramjet, BareMux and libcurl with the existing browser connection. App shortcuts open through the browser.

Games are loaded from their original HTML sources online. Some HTML games fetch additional assets or emulator runtimes. HTML format alone does not guarantee compatibility or availability on any particular network. The repository includes the catalog and covers, not 240 offline game bundles.

Favorites, recently played IDs and preferences stay in browser local storage. The flowing background respects reduced-motion and pauses in background tabs.

## Sources

Game catalogs: Ultimate Game Stash and [GN Math](https://github.com/gn-math/html). App marks: [Simple Icons](https://simpleicons.org/). Games, cover artwork and brand marks belong to their respective owners; this repository does not grant rights to third-party assets. Proxy dependencies are copied from the existing Blizzard deployment with their distributed license notices intact.

