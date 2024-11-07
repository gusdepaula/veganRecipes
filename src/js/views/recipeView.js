import { elements } from "./base";
import { Fraction } from "fractional";

export const clearRecipe = () => {
  elements.recipe.innerHTML = "";
};

const formatCount = (count) => {
  if (count !== 0.33) {
    // count = 2.5 --> 5/2 --> 2 1/2
    // count = 0.5 --> 1/2
    const newCount = Math.round(count * 10000) / 10000;
    const [int, dec] = newCount
      .toString()
      .split(".")
      .map((el) => parseInt(el, 10));

    if (!dec) return newCount;

    if (int === 0) {
      const fr = new Fraction(newCount);
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      const fr = new Fraction(newCount - int);
      return `${int} ${fr.numerator}/${fr.denominator}`;
    }
  } else if (count === 0.33) {
    return "1/3";
  } else {
    return "?";
  }
};

export const hideResultsMobile = () => {
  elements.searchRes.classList.contains("hidden-xs")
    ? elements.searchRes.classList.remove("hidden-xs")
    : elements.searchRes.classList.add("hidden-xs");
};

export const hideResultsAndShowRecipe = () => {
  if (elements.recipe.classList.contains("hidden-xs")) {
    elements.searchRes.classList.add("hidden-xs");
    elements.recipe.classList.remove("hidden-xs");
  }
};

const createIngredient = (ingredient) => {
  if (ingredient) {
    return `
    
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        ${ingredient}
    </li>
`;
  }
};

export const renderRecipe = (recipe, isLiked) => {
  const markup = `
  <figure class="recipe__fig">
    <a href="/" class="btn visible-xs recipe__back">&laquo; voltar</a>
    <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe__img">
    <h1 class="recipe__title">
        <span>${recipe.title}</span>
    </h1>
    </figure>

    <div class="recipe__details">
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          recipe.time
        }</span>
        <span class="recipe__info-text"> minutos</span>
    </div>
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          recipe.servings
        }</span>
        <span class="recipe__info-text"> porções</span>

        <div class="recipe__info-buttons">
            <button class="btn-tiny btn-decrease">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-minus"></use>
                </svg>
            </button>
            <button class="btn-tiny btn-increase">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-plus"></use>
                </svg>
            </button>
        </div>

    </div>
    </div>

    <div class="recipe__ingredients">
    <button class="recipe__love">
        <svg class="header__likes">
        <use href="img/icons.svg#icon-heart${isLiked ? "" : "-outlined"}"></use>
        </svg>
    </button>
    <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map((el) => createIngredient(el)).join("")}
    </ul>
    </div>

    <div class="recipe__directions">
    <h2 class="heading-2">Modo de preparo</h2>
    <p class="recipe__directions-text preWrap">${recipe.directions}</p>
    <p class="recipe__directions-text">
        Esta receita foi cuidadosamente desenvolvida e testada por
        <span class="recipe__by">${recipe.publisher}</span>. 
    </p>
    </div>
  `;
  elements.recipe.insertAdjacentHTML("afterbegin", markup);
};

export const updateServingsIngredients = (recipe) => {
  // Upadate servings
  document.querySelector(".recipe__info-data--people").textContent =
    recipe.servings;

  // Update ingredients
  const countElements = Array.from(document.querySelectorAll(".recipe__count"));
  countElements.forEach((el, i) => {
    el.textContent = formatCount(recipe.ingredients[i].count);
  });
};
