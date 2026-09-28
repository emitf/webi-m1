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
    id: "moonbeam-marmalade",
    ingredients: ["moonberry", "honey"],
    name: "Moonbeam Marmalade",
    symbol: "🍯",
    description: "A warm little glow for long evenings.",
  },
  {
    id: "pocket-meadow",
    ingredients: ["sunflower", "moss"],
    name: "Pocket-Sized Meadow",
    symbol: "🌼",
    description: "Smells like a sunny walk through the woods.",
  },
  {
    id: "tidepool-galaxy",
    ingredients: ["stardust", "seashell"],
    name: "Tidepool Galaxy",
    symbol: "🌌",
    description: "A tiny night sky, still rippling from the sea.",
  },
  {
    id: "fernlight-fizz",
    ingredients: ["moonberry", "moss"],
    name: "Fernlight Fizz",
    symbol: "🫧",
    description: "Cool, bright bubbles from a moonlit clearing.",
  },
  {
    id: "golden-hour-syrup",
    ingredients: ["sunflower", "honey"],
    name: "Golden Hour Syrup",
    symbol: "☀️",
    description: "Sweet sunshine you can almost spread on toast.",
  },
  {
    id: "wishkeepers-tea",
    ingredients: ["stardust", "moonberry"],
    name: "Wishkeeper's Tea",
    symbol: "🫖",
    description: "Best enjoyed while making a very small wish.",
  },
  {
    id: "seaglass-garden",
    ingredients: ["seashell", "moss"],
    name: "Seaglass Garden",
    symbol: "🪴",
    description: "A quiet green place with the sound of distant waves.",
  },
  {
    id: "daydream-conch",
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
const brewPanel = document.querySelector(".brew-panel");
const discoveryCount = document.querySelector("#discovery-count");
const discoveryList = document.querySelector("#discovery-list");
const customRecipeArea = document.querySelector("#custom-recipe-area");

const selectedIngredients = [];
const discoveredRecipes = [];
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
  customRecipeArea.replaceChildren();
  brewResult.replaceChildren();
  brewResult.classList.remove("result-card--success", "result-card--unknown");
  brewPanel.classList.remove("brew-panel--success", "brew-panel--unknown");

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
    brewPanel.classList.add("brew-panel--success");
    symbol.textContent = recipe.symbol;
    title.textContent = recipe.name;
    description.textContent = recipe.description;
  } else {
    brewResult.classList.add("result-card--unknown");
    brewPanel.classList.add("brew-panel--unknown");
    symbol.textContent = "☁";
    title.textContent = "An unfamiliar mixture";
    description.textContent = "No recipe yet, but something curious is stirring.";
  }

  message.append(title, description);
  brewResult.append(symbol, message);

  if (!recipe) {
    renderCustomRecipeForm([...selectedIngredients]);
  }
}

function createDiscoveryCard(recipe) {
  const card = document.createElement("article");
  card.className = "discovery-card";

  const symbol = document.createElement("span");
  symbol.className = "discovery-symbol";
  symbol.setAttribute("aria-hidden", "true");
  symbol.textContent = recipe.symbol;

  const title = document.createElement("h3");
  title.className = "discovery-name";
  title.textContent = recipe.name;

  const description = document.createElement("p");
  description.className = "discovery-description";
  description.textContent = recipe.description;

  card.append(symbol, title);

  if (recipe.isCustom) {
    const badge = document.createElement("span");
    badge.className = "discovery-badge";
    badge.textContent = "YOUR RECIPE";
    card.append(badge);
  }

  card.append(description);
  return card;
}

function renderDiscoveries() {
  discoveryCount.textContent = `${discoveredRecipes.length} / ${recipes.length}`;

  if (discoveredRecipes.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-note";
    emptyMessage.textContent = "Your discoveries will find a home here.";
    discoveryList.replaceChildren(emptyMessage);
    return;
  }

  const cards = discoveredRecipes.map((recipeId) => {
    return createDiscoveryCard(recipes.find((recipe) => recipe.id === recipeId));
  });
  discoveryList.replaceChildren(...cards);
}

function recordDiscovery(recipe) {
  if (!recipe || discoveredRecipes.includes(recipe.id)) {
    return;
  }

  discoveredRecipes.push(recipe.id);
  renderDiscoveries();
}

function renderCustomRecipeForm(ingredientIds) {
  const form = document.createElement("form");
  form.className = "custom-recipe-form";

  const heading = document.createElement("p");
  heading.className = "custom-recipe-heading";
  heading.textContent = "Give this mixture a recipe of its own";

  const nameLabel = document.createElement("label");
  nameLabel.className = "custom-recipe-label";
  nameLabel.htmlFor = "custom-recipe-name";
  nameLabel.textContent = "Potion name";

  const nameInput = document.createElement("input");
  nameInput.className = "custom-recipe-input";
  nameInput.id = "custom-recipe-name";
  nameInput.name = "name";
  nameInput.type = "text";
  nameInput.maxLength = 35;
  nameInput.required = true;
  nameInput.placeholder = "e.g. Cloudberry cordial";

  const descriptionLabel = document.createElement("label");
  descriptionLabel.className = "custom-recipe-label";
  descriptionLabel.htmlFor = "custom-recipe-description";
  descriptionLabel.textContent = "What does it do?";

  const descriptionInput = document.createElement("textarea");
  descriptionInput.className = "custom-recipe-input custom-recipe-input--description";
  descriptionInput.id = "custom-recipe-description";
  descriptionInput.name = "description";
  descriptionInput.maxLength = 110;
  descriptionInput.required = true;
  descriptionInput.rows = 2;
  descriptionInput.placeholder = "A little note for your recipe book...";

  const saveButton = document.createElement("button");
  saveButton.className = "custom-recipe-save";
  saveButton.type = "submit";
  saveButton.textContent = "Add to my recipe book";

  form.append(heading, nameLabel, nameInput, descriptionLabel, descriptionInput, saveButton);
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!name || !description) {
      return;
    }

    const pair = [...ingredientIds].sort();
    const customRecipe = {
      id: `custom-${pair.join("-")}`,
      ingredients: pair,
      name,
      symbol: "🧪",
      description,
      isCustom: true,
    };

    recipes.push(customRecipe);
    showBrewResult(customRecipe);
    recordDiscovery(customRecipe);
  });

  customRecipeArea.replaceChildren(form);
  nameInput.focus();
}

function resetBrewResult() {
  customRecipeArea.replaceChildren();
  brewResult.classList.remove("result-card--success", "result-card--unknown");
  brewPanel.classList.remove("brew-panel--success", "brew-panel--unknown");

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

  const recipe = findRecipe(selectedIngredients);
  showBrewResult(recipe);
  recordDiscovery(recipe);
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

document.addEventListener("keydown", (event) => {
  const targetIsEditable = event.target.closest("input, textarea, select, [contenteditable='true']");

  if (targetIsEditable) {
    return;
  }

  if (event.key.toLowerCase() === "n" && !event.repeat) {
    document.body.classList.toggle("night-mode");
  }
});

renderIngredients();
renderSelection();
renderDiscoveries();
