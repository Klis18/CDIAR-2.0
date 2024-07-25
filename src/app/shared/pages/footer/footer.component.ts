import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shared-footer',
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent implements OnInit{
  
  public dateTime:string = '';
  public customDate: Date = new Date();

  ngOnInit(): void {
    setInterval(() => {
      const ahora = new Date();
      this.dateTime = ahora.toLocaleDateString() + " " + ahora.toLocaleTimeString();
    }, 1000);
  }

}
