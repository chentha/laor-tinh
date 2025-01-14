import { Component, OnInit } from '@angular/core';
import { AllApiService } from '../core/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from '../core/function/toast.service';
import { HttpHeaders } from '@angular/common/http';
import { CartService } from '../core/cart.service';

@Component({
  selector: 'app-detial-product',
  templateUrl: './detial-product.component.html',
  styleUrls: ['./detial-product.component.scss']
})
export class DetialProductComponent implements OnInit {
  productId: string | null = null;
  dataDetail: any;
  images: any[] = [];
  activeIndex: number = 0;
  quantity: number = 1;
  userId: any;
  token:any
  CountCart:any;

  // inputGroup = new FormGroup({
  //   userId: new FormControl('', Validators.required),
  //   clothesProductId: new FormControl('', Validators.required),
  //   quantity: new FormControl('', Validators.required)
  // })

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor(
    private allApi: AllApiService,
    private route: ActivatedRoute,
    private router: Router,
    private ToastrService: NGXToastrService,
    private cartService: CartService
  ) {
    this.route.queryParams.subscribe(params => {
      this.productId = params['product_id'];
      if (this.productId) {
        this.getDetail();
      }
      console.log('Product ID:', this.productId);
    });

    const userString = localStorage.getItem('user'); 
    const user = userString ? JSON.parse(userString) : null; 
    this.userId = user.data.user.id;

    this.token = localStorage.getItem('token')?.replace(/"/g, '') || null;
    console.log('Sanitized token:', this.token);
    
  }

  ngOnInit() { }

  // get f() {
  //   return this.inputGroup.controls
  // }

  getDetail() {
    this.allApi.getDataDetailById(this.allApi.productUrl, this.productId).subscribe(
      (data: any) => {
        this.dataDetail = data.data;
        this.images = this.dataDetail.images.map((imageUrl: string) => ({
          itemImageSrc: imageUrl,
          thumbnailImageSrc: imageUrl,
          alt: 'Product Image'
        }));
        console.log('Product details:', this.dataDetail);
      }
    );
  }

  // Increase quantity
  increaseQuantity() {
    this.quantity++;
  }

  // Decrease quantity
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Handle direct input change
  onQuantityChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.quantity = Math.max(1, parseInt(inputValue, 10));
  }

  addCart() {
    const inputData = {
      'userId': this.userId,
      'clothesProductId': Number(this.productId),
      'quantity': this.quantity,
    }

    this.allApi.createData(this.allApi.cartUrl, inputData).subscribe(
      (data: any) => {
        console.log('add cart data sucess', data);
        const newCartCount = data.data?.quantity || 1;
        this.cartService.updateCartCount(newCartCount);
        this.ToastrService.typeSuccessAddCart();
        this.router.navigate(
          ['detial-product'],
          {
            queryParams: { product_id: data.id },
          },
        );
      },
      (err) => {
        console.log('err add cart', err)
      }
    )
  }

}

