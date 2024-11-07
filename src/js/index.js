import Search from "./models/Search";
import Recipe from "./models/Recipe";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();
  // TESTING
  //   const query = `beringela`;

  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResList);
    searchView.showResultsMobile();

    try {
      // 4) Search for recipes
      const filteredQuery = await state.search.getResults();

      // 5) Render results on UI
      clearLoader();
      searchView.renderResults(filteredQuery);

      // 6) Add pagination on UI
      elements.searchResPages.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-inline");
        if (btn) {
          const goToPage = Number(btn.dataset.goto, 10);
          searchView.clearResults();
          searchView.renderResults(filteredQuery, goToPage);
        }
      });
    } catch (err) {
      console.log(`Deu alguma coisa errada com a pesquisa...😟`);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

// TESTING
// window.addEventListener("load", (e) => {
//   e.preventDefault();
//   controlSearch();
// });

elements.likesMenu.addEventListener("click", () => {
  elements.likesPanel.classList.add("likes__panel-active");
  setTimeout(() => {
    elements.likesPanel.classList.remove("likes__panel-active");
  }, 7000);
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  // Get ID from url
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Prepate UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    recipeView.hideResultsMobile();

    // Highlight selected search item
    if (state.search) {
      searchView.highlightSelected(id);
    }

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data
      const recipe = await state.recipe.getRecipe();
      // console.log(recipe);
      // await state.recipe.getRecipe();
      // state.recipe.parseIngredients();

      // // Calcultate servings and time
      // state.recipe.calcTime();
      // state.recipe.calcServings();

      // Render recipe
      recipeView.hideResultsAndShowRecipe();
      clearLoader();
      recipeView.renderRecipe(recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
      console.log(`Erro no processamento da receita...😟`);
    }
  }
};

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
  if (!state.likes) {
    state.likes = new Likes();
  }
  const currentID = state.recipe.id;
  const title = document.querySelector(".recipe__title span").innerHTML;
  const author = document.querySelector(".recipe__by").innerHTML;
  const img = document.querySelector(".recipe__fig img").src;
  // User has not yet liked current recipe
  // console.log(state.likes.isLiked(currentID));
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(currentID, title, author, img);

    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);

    //User HAS liked current recipe
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener("load", () => {
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // Decrase button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});
