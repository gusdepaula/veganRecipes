import { elements } from "../views/base";
import { db } from "../views/config";
import { ref, onValue } from "firebase/database";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    return new Promise((resolve, reject) => {
      const query = this.query.toLowerCase();

      // Crie um nó na localização do Firebase para adicionar locais como chaves filhas
      const dataRef = ref(db, "data");
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();

        const filteredQuery = data.filter((item) => {
          const arrTitle = [item.title.toLowerCase()];
          const filter = arrTitle.find((ing) => ing.includes(query));
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

        resolve(filteredQuery);
      }, (error) => {
        reject(error);
      });
    });
  }
}