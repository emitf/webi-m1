const ingredients = [
  { id: "moonberry", name: "Moonberry", symbol: "🫐", note: "Picked after dusk", color: "berry" },
  { id: "sunflower", name: "Sunflower", symbol: "🌻", note: "A pocket of sunshine", color: "sunflower" },
  { id: "moss", name: "Soft moss", symbol: "🌿", note: "From a quiet forest", color: "moss" },
  { id: "stardust", name: "Stardust", symbol: "✨", note: "A pinch from above", color: "stardust" },
  { id: "honey", name: "Wild honey", symbol: "🍯", note: "Golden and slow", color: "honey" },
  { id: "seashell", name: "Sea glass", symbol: "🐚", note: "Tumbled by the tide", color: "seashell" },
];

const ingredientList = document.querySelector("#ingredient-list");
const selectionStatus = document.querySelector("#selection-status");
const brewHint = document.querySelector("#brew-hint");
const brewButton = document.querySelector("#brew-button");

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
  } else if (selectedIngredients.length < 2) {
    selectedIngredients.push(ingredientId);
  } else {
    selectionNotice = "Two ingredients is plenty · remove one to swap.";
  }

  renderSelection();
});

renderIngredients();
renderSelection();
