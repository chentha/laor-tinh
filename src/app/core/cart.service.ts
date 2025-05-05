import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartCount = new BehaviorSubject<number>(this.getStoredCartCount());
  cartCount$ = this.cartCount.asObservable();

  constructor() {}

  private getStoredCartCount(): number {
    const stored = localStorage.getItem('cartCount');
    return stored ? parseInt(stored, 10) : 0;
  }

  updateCartCount(count: number) {
    localStorage.setItem('cartCount', count.toString());
    this.cartCount.next(count);
  }

  getCartCount(): number {
    return this.cartCount.getValue();
  }
}
