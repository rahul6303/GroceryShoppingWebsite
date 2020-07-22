import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppUser } from './../mode/app-user';
import { ShoppingCartService } from './../shopping-cart.service';
import { Observable } from 'rxjs/Observable';
import { ShoppingCart } from '../mode/shopping-cart';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit {
  appUser: AppUser;
  cart$: Observable<ShoppingCart>;

  constructor(private auth: AuthService, private shoppingCartService: ShoppingCartService) {

   }
  async ngOnInit() {
    this.auth.appUser$.subscribe(appUser => this.appUser = appUser);

    this.cart$ = await this.shoppingCartService.getCart();

  }

    logout()
    // tslint:disable-next-line: one-line
    {

     this.auth.logout();

    }

}
