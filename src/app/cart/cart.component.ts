import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AllApiService } from '../core/all-api.service';
import { GeneralFunctionService } from '../core/function/general-function.service';
import { SearchFormComponent } from '../search-form/search-form.component';
import { CartService } from '../core/cart.service';
import { OrderService } from '../core/order.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  search_key: any;
  searchTimeout: any;
  loadingGet = false;
  loadingRequest = false;
  isRefreshTable = false;
  resultData: any;
  totalPrice: any;
  page = 1;
  dataObject: any[] = [];
  productId: any;
  quantity: number = 1;
  userId: any;
  CountCart: any;
  remark = new FormControl()

  constructor(
    private allFunction: GeneralFunctionService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataDetail: any,
    public dialogRef: MatDialogRef<CartComponent>,
    private allApi: AllApiService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private orderService: OrderService,
  ) {
    this.getAllData()

    // this.route.queryParams.subscribe(params => {
    //   this.productId = params['product_id'];
    // });

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.userId = user.data.user.id;


  }


  refresh() {
    this.page = 1;
    this.search_key = null
    this.getAllData()
  }


  getAllData() {
    this.loadingGet = true;
    let filter = {
      keyword: this.search_key
    }

    this.allApi.getDataWithFilter(this.allApi.cartUrl, filter).subscribe(
      (data: any) => {
        this.loadingGet = false;
        this.resultData = data.data;
        this.dataObject = data.data
        this.calculateTotalPrice();
        console.log('data cart', data)
      },
      (err: any) => {
        this.loadingGet = false;
        console.log('Error', err)
      }
    )
  }

  orderProduct() {
    const items = this.dataObject.map((data: any) => {
      const sizeIds = data.product.optionProducts[0]?.sizes.map((size: any) => size.id) || [];
      const colorIds = data.product.optionProducts[0]?.colors.map((color: any) => color.id) || [];
      
      const optionValues = [...sizeIds, ...colorIds];
  
      return {
        productId: data.product.id,
        quantity: data.quantity,
        optionValues: optionValues,  
      };
    });
  
    const inputData = {
      remark: null,
      items: items,
    };
  
    console.log('data json', this.dataObject);
  
    this.allApi.createData(this.allApi.orderUrl, inputData).subscribe(
      (data: any) => {
        console.log('data order success', data);
        this.orderService.setOrderData(data);
        this.router.navigate(['checkouts'], {
          queryParams: { order_id: data.data.id },
        });
        this.closeForm();
      },
      (err: any) => {
        console.log('Error creating order:', err);
      }
    );
  }
  
  gotoPage(order: any) {
    console.log(order);
    this.router.navigate(
      ['detail-product'],
      {
        queryParams: { order_id: order },
      },
    );
  }


  calculateTotalPrice() {
    let total = 0;
    this.resultData.forEach((item: any) => {
      total += item.product.unitPrice * item.quantity;
    });
    this.totalPrice = total;
  }

  removeFromCart(id: any) {
    this.allApi.deleteData(this.allApi.cartUrl + '/', id).subscribe(
      (data: any) => {
        console.log('Item removed from cart:', data);
        this.updateCartCountAfterRemoval();
        this.refresh();
      },
      (err: any) => {
        console.log('Error removing item from cart:', err);
      }
    );
  }

  updateCartCountAfterRemoval() {
    const currentCount = parseInt(localStorage.getItem('cartCount') || '0', 10);
    const newCount = currentCount > 0 ? currentCount - 1 : 0;

    localStorage.setItem('cartCount', newCount.toString());

    this.cartService.updateCartCount(newCount);
  }



  closeForm() {
    console.log('close form')
    this.allFunction.closeDialog(this.dataDetail?.form_name );
    setTimeout(() => {
      this.dialogRef.close({ is_refresh: true });
    }, this.allFunction.closeDelaySmall);
  }



}
