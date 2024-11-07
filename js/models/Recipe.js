import { db } from "../views/config";
import { ref, onValue } from "firebase/database";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    return new Promise((resolve, reject) => {
      const id = this.id;

      // Crie um nó na localização do Firebase para adicionar locais como chaves filhas
      const recipeRef = ref(db, "data");
      onValue(recipeRef, (snapshot) => {
        const data = snapshot.val();
        const filteredId = data.filter((item) => item.id === id);

        return resolve(filteredId[0]);
      });
    });
  }
}