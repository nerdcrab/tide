# Tide

A static games and browser site. HTML, CSS, JavaScript and local artwork; no build step is needed for GitHub Pages.

## Hosting

Publish the `main` branch root with GitHub Pages. Relative asset paths and a scope-relative service worker support the `/tide/` project path. Open the HTTPS site, rather than a downloaded file, to use the browser.

## Files

- `index.html`, `style.css`, `app.js` — interface and interactions
- `themes.js` — nine complete palettes
- `logos.js`, `logo.png`, `covers-*.webp` — locally hosted app logos, Tide logo and game cover atlases
- `data.js` — 1,926 HTML game entries with local thumbnails
- `proxy.js`, `sw.js` — browser setup and service worker
- `scramjet.*`, `baremux*`, `libcurl.mjs` — proxy client dependencies

The browser uses Scramjet, BareMux and libcurl with the existing browser connection. App shortcuts open through the browser.

Games are loaded from their original HTML sources online. Some HTML games fetch additional assets or emulator runtimes. HTML format alone does not guarantee compatibility or availability on any particular network. The repository includes the catalog and covers, not offline game bundles.

Favorites, recently played IDs and preferences stay in browser local storage. Christmas adds a green, red, and gold palette with locally drawn snowfall. The background respects reduced-motion and pauses in background tabs and during gameplay. The home game row switches between Featured and Recent.

## Sources

Game catalogs: Ultimate Game Stash and [GN Math](https://github.com/gn-math/html). Interface icons: [Lucide](https://lucide.dev/), bundled SVG paths under the included ISC license. App marks: [Simple Icons](https://simpleicons.org/). Games, cover artwork and brand marks belong to their respective owners; this repository does not grant rights to third-party assets. Proxy dependencies are copied from the existing Blizzard deployment with their distributed license notices intact.


## AI chat

Chat uses a server-side Cloudflare Pages Function and OpenRouter's free-model router. The API key belongs in the encrypted `OPENROUTER_API_KEY` production secret, never in these files. The Cloudflare deployment package includes `_worker.js` and `_routes.json`; the static mirrors use `https://tides.pages.dev/api/chat`.

The backend fixes the model to `openrouter/free`, limits input and reply sizes, and applies a basic per-IP throttle in each Worker instance. This throttle is not a durable global quota. Provider free-model quotas still apply. Conversations and attached images are saved locally in IndexedDB in this browser. Saved chats can be reopened or deleted; storage is separate for each site address and does not sync between devices. Messages are sent to OpenRouter and its provider only when Send is used.

## Donations and online presence

Settings includes public LTC, ETH (Ethereum mainnet), and BTC receiving addresses, locally generated SVG QR codes, and copy controls. The Support Tide footer link opens the panel. There is no payment processor or client-side wallet connection.

The online counter uses the Cloudflare endpoint `/api/presence` and a production D1 binding named `PRESENCE_DB`. Initialize its table with `presence.sql`. It stores only a random browser identifier and last-seen timestamp; the endpoint returns an aggregate count. Visible pages heartbeat once per minute, and sessions expire from the count after two minutes. Multiple tabs on the same origin share an ID; different browsers, devices, and mirror origins can count separately. This is an approximate browser-session count, not authenticated people or bot detection. Data storage uses the existing free-plan allowance; unavailable storage shows an unavailable count.
