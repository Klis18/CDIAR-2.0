import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styles: ``,
})
export class UserReportsComponent implements OnInit {
  searchInfo: any;
  reloadTable: boolean = false;
  
  
  ngOnInit(){
  }

  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }

  loadTable() {
    this.reloadTable = true;
  }

  loadedTale() {
    this.reloadTable = false;
  }
  
  
}
