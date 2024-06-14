import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LearnService } from '../../services/learn.service';

@Component({
  selector: 'app-details-mazo',
  templateUrl: './details-mazo.component.html',
  styles: ``
})
export class DetailsMazoComponent implements OnInit{

  datosMazo!: any;
  constructor(
    private learnService: LearnService,
    public dialogRef: MatDialogRef<DetailsMazoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getDetailsMazo(this.data.id);
    console.log(this.getDetailsMazo(this.data.id))
  }

  
  getDetailsMazo(idMazo: number) {
    this.learnService.getDatosMazo(idMazo).subscribe((res: any) => {
      this.datosMazo = res.data;
      console.log(this.datosMazo)
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
  
}
