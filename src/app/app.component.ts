import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FusionEdge';

  showPopup = false;

  openPopup(){
    this.showPopup = true;
  }

  closePopup(){
    this.showPopup = false;
  }
}
