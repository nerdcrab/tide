# Tide

First draft of Tide. Static HTML, CSS, JavaScript, and local image files; no build step or paid service is needed to host the interface.

## Files

- `index.html` — page shell
- `style.css` — layout, themes, responsive styles, hover/press effects
- `app.js` — navigation, search, favorites, settings, game player
- `data.js` — 240-game starter catalog
- `logo.png` — original Tide wave mark
- `covers-*.webp` — locally hosted cover atlases

Publish the `main` branch root with GitHub Pages. All site asset paths are relative so the site works under `/tide/`.

Games load from their original online sources. URL entry and app shortcuts open websites directly in a new tab. This draft does not include a proxy client or Wisp integration. Favorites, recently played games, and appearance settings are saved in the browser.

Game sources: [Ultimate Game Stash](https://github.com/UGS-Assets) and [GN Math](https://github.com/gn-math/html). Games and artwork belong to their respective owners. The repository does not grant rights to third-party assets.
