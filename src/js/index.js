import Search from './models/Search';
import recipe from './models/recipe';
import list from './models/list';
import likes from './models/likes';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

const state = {};
window.state = state;
const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput();

    if (query) {
        try {
            // 2) new search object and added to state
            state.search = new Search(query);
            // 3) prepare UI for results
            searchView.clearInput();
            searchView.clearResults();
            renderLoader(elements.searchRes);
            
        
            // 4) search for recipes
            await state.search.getResults();
        
            // 5) render results on UI
            clearLoader();
            searchView.renderResult(state.search.recipes);
        }
        catch (error) {
            console.log(error);
        }
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResult(state.search.recipes, goToPage);


    }
})



// recipe controller
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    if (id) {
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        // create new recipe object
        state.recipe = new recipe(id);
        try {
            // get recipe data
            await state.recipe.getRecipe();
    
            state.recipe.parseIngredients();
    
            // highlight selected
            if (state.search) searchView.highLightSelected(id);

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render
            clearLoader(); 
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id));
        }
        catch (error) {
            console.log(error);
        }
        
    }
};

// shopping list controller
const controlList = () => {
    //making state.list if there is not
    if (!state.list) state.list = new list();
    // add each ingredient to the list and render it
    state.recipe.ingredients.forEach(el => {
        const list = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderList(list);

    });
}

state.likes = new likes();

// likes controller
const controlLike = () => {
    if (!state.likes) state.likes = new likes();
    const currentId = state.recipe.id;

    // user has NOT yet liked current recipe
    if (!state.likes.isLiked(currentId)) {
        // add like to state
        const like = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        // toggle the like button
        likesView.taggleLikeBtn(true);

        // add like to the UI
        likesView.renderLikesMenu(like);
    }
    // user has  liked current recipe
     else {
        // remeve like from state
        state.likes.deleteLike(currentId);

        // toggle like button
        likesView.taggleLikeBtn(false);

        // remove from UI
        likesView.deleteLike(currentId);
    }
}

window.addEventListener('hashchange', controlRecipe);

// recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    // increase button    
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    // add to shopping list button
    } else if (e.target.matches('.btn_shopping, .btn_shopping *')) {
        controlList();
    }
    // add likes button
    else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
    likesView.toggleLikeMenu(state.likes.numOfLikes());
})

// handle delete and update list items
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // handle delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);
        // delete from UI
        listView.deleteItem(id);
    }
})

// restore liked recipe on page load
window.addEventListener('load', () => {
    state.likes = new likes ();

    // restore likes
    state.likes.readStorage();

    // toggle likes menu
    likesView.toggleLikeMenu(state.likes.numOfLikes());

    // render the existing likes
    state.likes.likes.forEach( like => likesView.renderLikesMenu(like));
})