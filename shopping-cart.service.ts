import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { Product } from './mode/product';
import { ShoppingCart } from './mode/shopping-cart';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>> {
    // tslint:disable-next-line: prefer-const
    let cartId = await this.getOrCreateCartId();
   return this.db.object('/shopping-carts/' + cartId)
   .map(({items}) => new ShoppingCart(items));
}

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  async addToCart(product: Product) {
    this.updateItem(product, 1);
}

async removeFromCart(product: Product) {
  this.updateItem(product, -1);

}

async clearCart() {
  // tslint:disable-next-line: prefer-const
  let cartId = await this.getOrCreateCartId();
  this.db.object('/shopping-carts/' + cartId + '/items').remove();

}

  private getItem(cartId: string, productId: String) {
      return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    // tslint:disable-next-line: prefer-const
    let cartId = localStorage.getItem('cartId');
    // tslint:disable-next-line: curly
    if (cartId) return cartId;

    // tslint:disable-next-line: prefer-const
    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

   private async updateItem(product: Product, change: number) {
    // tslint:disable-next-line: prefer-const
    let cartId = await this.getOrCreateCartId();
    // tslint:disable-next-line: prefer-const
    let item$ = this.getItem(cartId, product.$key);
    item$.take(1).subscribe((item: any) => {
      // tslint:disable-next-line: prefer-const
      let quantity = (item.quantity || 0) + change;
      // tslint:disable-next-line: curly
      if (quantity === 0) item$.remove();

      else { item$.update({

         title: product.title,
         imageUrl: product.imageUrl,
         price: product.price,
         quantity: quantity

          });
        }

    });
   }
}
