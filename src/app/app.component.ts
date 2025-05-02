import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenuComponent } from "./top-menu/top-menu.component";
import { CoreContentComponent } from './core-content/core-content.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [TopMenuComponent,FooterComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FlowerShop.2';
  menuItem = '';

  menuItemClickedEventReceiver(menuItem:string) {
    console.log(menuItem)
    this.menuItem = menuItem;
  }
}
