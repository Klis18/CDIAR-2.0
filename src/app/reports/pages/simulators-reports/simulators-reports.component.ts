import { Component } from '@angular/core';

@Component({
  selector: 'app-simulators-reports',
  templateUrl: './simulators-reports.component.html',
  styles: ``,
})
export class SimulatorsReportsComponent {
  searchInfo: any;
  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }

  reloadTable: boolean = false;

  loadTable() {
    this.reloadTable = true;
  }

  loadedTale() {
    this.reloadTable = false;
  }
}
