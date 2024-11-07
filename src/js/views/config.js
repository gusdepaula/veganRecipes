import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';
import { SearchService } from './search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SearchService]
})
export class AppComponent {
  title = 'forkify-angular';

  constructor(private searchService: SearchService) {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
  }

  async search(query: string) {
    const results = await this.searchService.getResults(query);
    console.log(results);
  }
}
