import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { AllApiService } from '../core/all-api.service';
import { Router } from '@angular/router';
import { GeneralFunctionService } from '../core/function/general-function.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SearchFormComponent } from '../search-form/search-form.component';
import { HttpHeaders } from '@angular/common/http';
import { FilterProductComponent } from '../filter-product/filter-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  dataProduct: any[] = [];
  groupedProducts: any[] = [];
  loading: boolean = false;
  images: string[] = [
    'assets/images/slider1.webp',
    'assets/images/slider2.webp',
    'assets/images/slider3.webp',
  ];
  responsiveOptions: any[] | undefined;
  bannersData: any[] = [];
  favorited:boolean = false;
  type:any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDetail: any,
    private allApi: AllApiService,
    private router: Router,
    private allFunction: GeneralFunctionService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<HomeComponent>,
  ) {
    console.log('tmp data', this.dataDetail)
    this.type = this.dataDetail.type
    if (this.type == 'add') {
      this.getAllProduct()
      
    }
  }

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.getAllProduct();
    this.getCategoryProduct();
    this.getBanner()
  }

  getBanner() {
    this.allApi.getAllData(this.allApi.bannersUrl).subscribe(
      (data: any) => {
        this.bannersData = data.data;
        console.log('banner data', data);
      },
      (error) => {
        console.error('Error fetching banner data:', error);
      }
    );
  }

  
  gotoPageViewMore(cate: any) {
    console.log(cate);
    this.router.navigate(
      ['shop-more'],
      {
        queryParams: { category: cate },
      },
    );
  }

  gotoPage(product: any) {
    console.log(product);
    this.router.navigate(
      ['detail-product'],
      {
        queryParams: { product_id: product },
      },
    );
  }

  getAllProduct() {
    this.loading = true;
    const filter = {
    };

    this.allApi.getDataWithFilter(this.allApi.productUrl, filter).subscribe(
      (data: any) => {
        this.loading = false;
        this.dataProduct = data.data;
        this.groupProducts();
        console.log('data response', this.dataProduct);
      },
      (err: any) => {
        console.log('Error', err);
      }
    );
  }

  getCategoryProduct() {
    this.loading = true;
    this.allApi.getAllData(this.allApi.categoryUrl).subscribe(
      (data: any) => {
        this.loading = false;
        console.log('category data response', data);
      },
      (err: any) => {
        console.log('Error', err);
      }
    );
  }

  // Group products by categoryName
  groupProducts() {
    const grouped = this.dataProduct.reduce((acc, product) => {
      const category = product.categoryName;
      if (!acc[category]) {
        acc[category] = {
          name: category,
          products: []
        };
      }
      acc[category].products.push(product);
      return acc;
    }, {});

    this.groupedProducts = Object.values(grouped);
  }


  //add favorite
  addFavorite(data?:any){
    console.log('data fav', data)
    this.allApi.addFavorite(this.allApi.favoriteUrl + '/' + data.id, '').subscribe(
      (data:any) =>{
        console.log('added favorite', data);
        this.favorited = true;
        this.getAllProduct()
      }
    )
  }


  openForm(type: 'add' | 'edit', data?: any) {
    let tmp_DialogData: any = {
      size: "medium",
      type: type,
      form_name: 'slide-show'
    }
    const dialogRef = this.dialog.open(SearchFormComponent,
      this.allFunction.dialogData(
        tmp_DialogData.size,
        tmp_DialogData.type,
        tmp_DialogData.form_name,
        data
      )
    )
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (result.is_refresh) {
            
          }
        }
        console.log('close', result)
      }
    )
  }


  openFormFilter(type: 'add' | 'edit', data?: any) {
    let tmp_DialogData: any = {
      size: "medium",
      type: type,
      form_name: 'filter'
    }
    const dialogRef = this.dialog.open(FilterProductComponent,
      this.allFunction.dialogData(
        tmp_DialogData.size,
        tmp_DialogData.type,
        tmp_DialogData.form_name,
        data
      )
    )
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (result.filters) {
            console.log('Selected Filters:', result.filters);          }
        }
        console.log('close', result)
      }
    )
  }

}
