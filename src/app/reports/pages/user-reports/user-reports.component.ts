import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styles: ``,
})
export class UserReportsComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  searchInfo: any;

  emitSearch(res: any) {
    if (res) {
      this.searchInfo = res;
    }
  }
}
