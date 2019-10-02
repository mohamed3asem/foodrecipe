export default class likes {
    constructor () {
        this.likes = [];
    }

    addLike (id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);
        // presist data
        this.persistDate();
        return like;
    }

    deleteLike (id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        // presist data
        this.persistDate();
    }

    isLiked (id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    numOfLikes () {
        return this.likes.length;
    }

    persistDate () {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage () {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
    }
}