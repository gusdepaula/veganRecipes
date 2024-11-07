import { elements } from "../views/base";
import { fb } from "../views/config";

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
    return new Promise((resolve, reject) => {
      const query = this.query;
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

            const filteredQuery = data.filter((item) => {
              const arrTitle = [item.title.toLowerCase()];
              // console.log(arrTitle);
              const queryLowerCase = query.toLowerCase();

              const filter = arrTitle.find((ing) =>
                ing.includes(queryLowerCase)
              );
              return filter;
            });
            if (filteredQuery.length === 0) {
              const markup = `
              <li>
                <a class="results__link" href="#">
                    <div class="results__data">
                      <h4 class="results__empty">Não existe nenhuma receita para o termo <u>${query}</u>! 🤔</h4>
                  </div>
                </a>
              </li>`;
              elements.searchResList.insertAdjacentHTML("beforeend", markup);
            }

            return resolve(filteredQuery);
          });
      }
      initialize();
    });
  }
}
