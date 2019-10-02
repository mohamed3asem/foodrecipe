import { elements } from './base';
import { showTitle } from './searchView'

export const taggleLikeBtn = isLiked => {
    const icontString = isLiked ? 'icon-heart' : 'icon-heart-outlined'

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${icontString}`);
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLikesMenu = like => {
    const markeUp = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${showTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markeUp);
}

export const deleteLike = (id) => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}