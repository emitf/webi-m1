const ingredients = [
  { id: "moonberry", name: "Moonberry", symbol: "🫐", note: "Picked after dusk", color: "berry" },
  { id: "sunflower", name: "Sunflower", symbol: "🌻", note: "A pocket of sunshine", color: "sunflower" },
  { id: "moss", name: "Soft moss", symbol: "🌿", note: "From a quiet forest", color: "moss" },
  { id: "stardust", name: "Stardust", symbol: "✨", note: "A pinch from above", color: "stardust" },
  { id: "honey", name: "Wild honey", symbol: "🍯", note: "Golden and slow", color: "honey" },
  { id: "seashell", name: "Sea glass", symbol: "🐚", note: "Tumbled by the tide", color: "seashell" },
];

const recipes = [
  {
    ingredients: ["moonberry", "honey"],
    name: "Moonbeam Marmalade",
    symbol: "🍯",
    description: "A warm little glow for long evenings.",
  },
  {
    ingredients: ["sunflower", "moss"],
    name: "Pocket-Sized Meadow",
    symbol: "🌼",
    description: "Smells like a sunny walk through the woods.",
  },
  {
    ingredients: ["stardust", "seashell"],
    name: "Tidepool Galaxy",
    symbol: "🌌",
    description: "A tiny night sky, still rippling from the sea.",
  },
  {
    ingredients: ["moonberry", "moss"],
    name: "Fernlight Fizz",
    symbol: "🫧",
    description: "Cool, bright bubbles from a moonlit clearing.",
  },
  {
    ingredients: ["sunflower", "honey"],
    name: "Golden Hour Syrup",
    symbol: "☀️",
    description: "Sweet sunshine you can almost spread on toast.",
  },
  {
    ingredients: ["stardust", "moonberry"],
    name: "Wishkeeper's Tea",
    symbol: "🫖",
    description: "Best enjoyed while making a very small wish.",
  },
  {
    ingredients: ["seashell", "moss"],
    name: "Seaglass Garden",
    symbol: "🪴",
    description: "A quiet green place with the sound of distant waves.",
  },
  {
    ingredients: ["sunflower", "seashell"],
    name: "Daydream Conch",
    symbol: "🐚",
    description: "Hold it close and hear a beach full of birdsong.",
  },
];

const ingredientList = document.querySelector("#ingredient-list");
const selectionStatus = document.querySelector("#selection-status");
const brewHint = document.querySelector("#brew-hint");
const brewButton = document.querySelector("#brew-button");
const brewResult = document.querySelector("#brew-result");

const selectedIngredients = [];
let selectionNotice = "";

function createIngredientButton(ingredient) {
  const button = document.createElement("button");
  button.className = `ingredient-card ingredient-card--${ingredient.color}`;
  button.type = "button";
  button.dataset.ingredientId = ingredient.id;
  button.setAttribute("aria-pressed", "false");

  const symbol = document.createElement("span");
  symbol.className = "ingredient-symbol";
  symbol.setAttribute("aria-hidden", "true");
  symbol.textContent = ingredient.symbol;

  const details = document.createElement("span");
  details.className = "ingredient-details";

  const name = document.createElement("span");
  name.className = "ingredient-name";
  name.textContent = ingredient.name;

  const note = document.createElement("span");
  note.className = "ingredient-note";
  note.textContent = ingredient.note;

  const check = document.createElement("span");
  check.className = "ingredient-check";
  check.setAttribute("aria-hidden", "true");
  check.textContent = "✓";

  details.append(name, note);
  button.append(symbol, details, check);

  return button;
}

function renderIngredients() {
  const ingredientButtons = ingredients.map(createIngredientButton);
  ingredientList.replaceChildren(...ingredientButtons);
}

function renderSelection() {
  const ingredientButtons = ingredientList.querySelectorAll("[data-ingredient-id]");

  ingredientButtons.forEach((button) => {
    const isSelected = selectedIngredients.includes(button.dataset.ingredientId);
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  brewButton.disabled = selectedIngredients.length !== 2;

  if (selectionNotice) {
    selectionStatus.textContent = selectionNotice;
  } else if (selectedIngredients.length === 0) {
    selectionStatus.textContent = "Nothing in your basket yet";
  } else if (selectedIngredients.length === 1) {
    const chosen = ingredients.find((ingredient) => ingredient.id === selectedIngredients[0]);
    selectionStatus.textContent = `${chosen.name} picked · choose one more`;
  } else {
    const chosenNames = selectedIngredients.map((id) => {
      return ingredients.find((ingredient) => ingredient.id === id).name;
    });
    selectionStatus.textContent = `${chosenNames.join(" + ")} · ready to brew`;
  }

  brewHint.textContent = selectedIngredients.length === 2
    ? "A good pair. See what they become."
    : "Choose two ingredients to get started.";
}

function findRecipe(selectedIds) {
  return recipes.find((recipe) => {
    return recipe.ingredients.length === selectedIds.length
      && recipe.ingredients.every((ingredientId) => selectedIds.includes(ingredientId));
  });
}

function showBrewResult(recipe) {
  brewResult.replaceChildren();
  brewResult.classList.remove("result-card--success", "result-card--unknown");

  const symbol = document.createElement("span");
  symbol.className = "result-icon";
  symbol.setAttribute("aria-hidden", "true");

  const message = document.createElement("div");
  message.className = "result-copy";

  const title = document.createElement("p");
  title.className = "result-title";

  const description = document.createElement("p");
  description.className = "result-description";

  if (recipe) {
    brewResult.classList.add("result-card--success");
    symbol.textContent = recipe.symbol;
    title.textContent = recipe.name;
    description.textContent = recipe.description;
  } else {
    brewResult.classList.add("result-card--unknown");
    symbol.textContent = "☁";
    title.textContent = "An unfamiliar mixture";
    description.textContent = "No recipe yet, but something curious is stirring.";
  }

  message.append(title, description);
  brewResult.append(symbol, message);
}

function resetBrewResult() {
  brewResult.classList.remove("result-card--success", "result-card--unknown");

  const symbol = document.createElement("span");
  symbol.className = "result-icon";
  symbol.setAttribute("aria-hidden", "true");
  symbol.textContent = "✧";

  const message = document.createElement("p");
  message.textContent = "Your first discovery is waiting.";

  brewResult.replaceChildren(symbol, message);
}

brewButton.addEventListener("click", () => {
  if (selectedIngredients.length !== 2) {
    return;
  }

  showBrewResult(findRecipe(selectedIngredients));
});

ingredientList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-ingredient-id]");

  if (!button || !ingredientList.contains(button)) {
    return;
  }

  const ingredientId = button.dataset.ingredientId;
  const selectedIndex = selectedIngredients.indexOf(ingredientId);
  selectionNotice = "";

  if (selectedIndex !== -1) {
    selectedIngredients.splice(selectedIndex, 1);
    resetBrewResult();
  } else if (selectedIngredients.length < 2) {
    selectedIngredients.push(ingredientId);
    resetBrewResult();
  } else {
    selectionNotice = "Two ingredients is plenty · remove one to swap.";
  }

  renderSelection();
});

renderIngredients();
renderSelection();
