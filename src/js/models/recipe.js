import axios from 'axios';
import {key, peroxy} from '../config';

export default class recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        try {
            const res = await axios(`${peroxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch(error) {
            console.log(error);
        }
    }

    calcTime () {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    calcServings () {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g', 'inch'];

        const newIngredients = this.ingredients.map(el => {
            // 1- unirom units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            // 2- remove parenthesis 
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3- parse ingredients into count, unit , ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
            // there is a unit
            // ex. 4 1/2 cups, arrCount is [4. 1/2] --> eval ('4+1/2') --> 4.5
            // ex. 4 cups, arrCount is [4]
            // ex. cup
            const arrCount = arrIng.slice(0, unitIndex);
            let count;
            if (arrCount[0] === '') {
                count = 1;
            } else {
                if (arrCount.length === 1) {
                count = eval(arrIng[0].replace('-', '+')); 
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
            }
            objIng = {
                count,
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex + 1).join(' ')
            };

            } else if (parseInt(arrIng[0], 10)) {
                // there is no unit, but there is anumber
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                 }
            } else if (unitIndex === -1) {
                // there is no unit and no number in 1st postition
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }
    updateServings (type) {
        const newServings = type === 'dec' ? (this.servings - 1) : (this.servings + 1);
        // old servings ----------->  old ing.count
        // new servings ----------> new ing.count
        this.ingredients.forEach( ing => {
            ing.count = (newServings * ing.count) / this.servings;
        });

        this.servings = newServings;
    }
}
