import { Component, Inject } from '@angular/core';
import { HomeService } from '../../../home/services/home.service';

@Component({
  selector: 'app-videolearns-reports',
  templateUrl: './videolearns-reports.component.html',
  styles: ``
})
export class VideolearnsReportsComponent {
  searchInfo: any;
  usuario: string = '';

  constructor(){ }

 
  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }

  reloadTable: boolean = false;

  loadedTale() {
    this.reloadTable = false;
  }
}
