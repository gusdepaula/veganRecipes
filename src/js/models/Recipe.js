import { fb } from "../views/config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    return new Promise((resolve, reject) => {
      const id = this.id;
      // Initialize Firebase
      function initialize() {
        if (!firebase.apps.length) {
          fb;
        }

        //Create a node at firebase location to add locations as child keys
        firebase
          .database()
          .ref("data")
          .on("value", (snapshot) => {
            const data = snapshot.val();
            const filteredId = data.filter((item) => item.id === id);

            return resolve(filteredId[0]);
          });
      }
      initialize();
    });
  }
}
