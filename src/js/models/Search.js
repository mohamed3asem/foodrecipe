import axios from 'axios';
import * as config from '../config';

export default class Search {
    constructor (query) {
        this.query = query;
    }
    async getResults() {
        const key = config.key;
        const peroxy = config.peroxy;
        try {
            const result = await axios(`${peroxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.recipes = result.data.recipes;
        } catch (error) {
        alert(error)
        }
    }
}