import { Component, ElementRef, ViewChild } from '@angular/core';
import { AllApiService } from '../core/all-api.service';
import { Router } from '@angular/router';
import { GeneralFunctionService } from '../core/function/general-function.service';
import { MatDialog } from '@angular/material/dialog';
import { SearchFormComponent } from '../search-form/search-form.component';
import { HttpHeaders } from '@angular/common/http';

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

  constructor(
    private allApi: AllApiService,
    private router: Router,
    private allFunction: GeneralFunctionService,
    public dialog: MatDialog,
  ) {

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
    const headers = new HttpHeaders({
      'Authorization': 'Bearer, eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjaGVudGhhIiwiZ2VuZGVyIjoiTUFMRSIsInJvbGVJZCI6MiwiaXNzIjoiSVRFIiwiYXZhdGFyIjoiaHR0cHM6Ly9maWxlLWxvYXItdGluaHMuczMuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbS9hdmF0YXIvMTc0NTQ5OTgxOTI1MV9hdmF0YXItY2hhcmFjdGVyLWlsbHVzdHJhdGlvbnMtcG5nLndlYnAiLCJzY29wZSI6InVwZGF0ZV9vcmRlciB2aWV3X29yZGVyIHVwZGF0ZV91c2VyIGNyZWF0ZV9vcmRlciBjcmVhdGVfdXNlciB2aWV3X3VzZXIgZGVsZXRlX29yZGVyIGRlbGV0ZV91c2VyIiwibmFtZSI6ImNoZW50aGEiLCJyb2xlTmFtZSI6IlVTRVIiLCJpZCI6MywiZXhwIjoxNzQ2MTA3Mjk5LCJpYXQiOjE3NDU1MDI0OTksImp0aSI6IjMiLCJlbWFpbCI6ImNoZW50aGFAZ21haWwuY29tIn0.Qix_GdS733gIYh0A_a0sAu2n0TkArXYmkYhNGeGFqNKakA1nBPTb8pB7PgLv78vg1q0PovgryoIB1uTl8e8v6uJLiK28WDxiniujmf4-sFFJWS3osojnZA3PdlvtbdFJNQYV1j41gPwQtb0o9AEXN6kvOK7XLHvxL9sc1I0oSInyYXHhHIIDccl5bqs-WOdHo3bjJ9J7nVmgTnhrQQvuZuSqZGlvNetaV5ixidFO_7uvcymGIjkCYM-P4CS3fStvAil4ld1D_lLMvFBZKsXcFbMnW-FvoYurUTvQ2LoYSmA9KpDz8ZwL_qGsxkXta_A3kY0DLfwrtpJFEf_Jy7yalg',  // Replace with your actual token or header
      'Content-Type': 'application/json'
    });
  
    this.allApi.getAllDataHeader(this.allApi.bannersUrl, headers).subscribe(
      (data: any) => {
        this.bannersData = data.data;
        console.log('banner data', data);
      },
      (error) => {
        console.error('Error fetching banner data:', error);
      }
    );
  }

  // getBanner(){
  //   this.allApi.getAllData(this.allApi.bannersUrl).subscribe(
  //     (data:any) =>{
  //       this.bannersData = data.data;
  //       console.log('banner data', data)
  //     }
  //   )
  // }

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
    this.allApi.getAllData(this.allApi.productUrl).subscribe(
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
}
