import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';

const URL = 'https://ng-recipe-book-354f7-default-rtdb.firebaseio.com/';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(URL + 'recipes.json', recipes).subscribe((response) => {
      console.log(response);
    });
  }
}
