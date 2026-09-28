# The Little Potion Lab

Mission M1 — The Awakening of the DOM, Web Development I.

A small potion-making game built with plain HTML, CSS, and JavaScript. Choose two ingredients, brew a known potion, or turn an unfamiliar mixture into a recipe of your own.

## How to try it

Open `index.html` in a browser, or run the folder with a local server such as VS Code Live Server.

1. Choose two ingredients from the shelf.
2. Select **Brew something** to see the result.
3. For an unfamiliar mixture, give it a name and description and add it to the recipe book. It can be brewed again during the same visit.
4. Press **N** to toggle night mode.

The ingredient selection, discoveries, and custom recipes are kept in JavaScript memory. They reset when the page is refreshed.

## Project files

- `index.html` contains the page structure and loads `app.js` with `defer`.
- `styles.css` contains the layout, responsive styles, animations, and light and night themes.
- `app.js` contains the ingredient and recipe data, game state, DOM rendering, and event listeners.

The project uses no frameworks or JavaScript libraries. The display fonts are loaded from Google Fonts, with local fallback fonts specified in the CSS.

## Use of AI

I used OpenAI Codex as a programming partner in stages. I chose the Potion Laboratory idea and directed the features. Codex generated most of the initial page structure and styling, then helped implement ingredient selection, fixed recipe brewing, discovery tracking, night mode, and custom recipes. I reviewed the code with explanations of the key decisions and used those explanations to understand how the parts work. I still need to complete the browser checks below before submission; I have not used an automated test suite.

Representative prompts from my conversation with Codex (wording lightly edited for readability):

> “Implement phase 3. I may want users to save unfamiliar mixtures as recipes with their own names and descriptions, but please answer whether that is possible without adding it yet.”

> “Add custom recipes for unfamiliar mixtures.”

I supplied the project direction, chose the additional feature, and reviewed the implementation in stages. I will only claim manual verification after I have tried the listed cases in the browser.

## Autopsy

1. **Selection is stored as ingredient IDs in JavaScript.** The selected ingredient IDs are kept in an array, and the button appearance and status text are rendered from that array. This keeps the game state explicit and avoids using CSS classes as the source of truth. An alternative would be to search the DOM for selected buttons each time. That couples the game logic to the page markup and styling.

2. **Custom recipes and discoveries last for the current page session.** They are stored in JavaScript arrays, so a saved custom recipe can be brewed again until the page is refreshed. This keeps the project’s state and recipe matching easy to follow. The alternative is `localStorage`, which would preserve recipes between visits but would require loading, validating, and saving browser-stored data.

## Manual checks before submission

- Select one ingredient, then a second; confirm the Brew button enables. Deselect one and confirm it disables again. Try selecting a third ingredient.
- Brew a known recipe in both ingredient orders. Brew the same recipe again and check that the book has no duplicate.
- Brew an unfamiliar pair, save a recipe with a name and description, then brew that pair again. Check the custom label and discovery count.
- Try submitting the custom recipe form with a blank field.
- Press **N** twice. Check that the theme changes and returns while selections and discoveries remain in place.
- Use the page at a narrow browser width and navigate ingredient buttons and form controls with the keyboard.
