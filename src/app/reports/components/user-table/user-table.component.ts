import { Component, OnInit } from '@angular/core';
import { usersData } from '../../interfaces/users.interface';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'user-table',
  templateUrl: './user-table.component.html',
  styles: ``
})
export class UserTableComponent implements OnInit{

  dataUsuarios:any = [];

  constructor(private reportsService: ReportsService) { }

  ngOnInit(){
    this.listarDataUsuaerios()
  }

  listarDataUsuaerios(){
    this.reportsService.getDataUsuarios().subscribe((res) => {
      this.dataUsuarios = res.data;
    });
  }

}
