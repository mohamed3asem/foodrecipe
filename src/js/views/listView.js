import { elements } from './base';

export const renderList = (recipe) => {
    const markUp = `
    <li class="shopping__item" data-itemid=${recipe.id}>
        <div class="shopping__count">
            <input type="number" value="${recipe.count}" step="${recipe.count}">
            <p>${recipe.unit}</p>
        </div>
        <p class="shopping__description">${recipe.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                 <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>`
    elements.shopping.insertAdjacentHTML('beforeend', markUp);
};

export const deleteItem = (id) => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    item.parentElement.removeChild(item);
};