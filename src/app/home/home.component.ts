import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { AllApiService } from '../core/all-api.service';
import { Router } from '@angular/router';
import { GeneralFunctionService } from '../core/function/general-function.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SearchFormComponent } from '../search-form/search-form.component';
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
    // @Inject(MAT_DIALOG_DATA) public dataDetail: any,
    private allApi: AllApiService,
    private router: Router,
    private allFunction: GeneralFunctionService,
    public dialog: MatDialog,
    // public dialogRef: MatDialogRef<HomeComponent>,
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

  getAllProduct(filterValue?:any) {
    this.loading = true;
    const filter: any = {};


    if (filterValue?.sort) {
      if (filterValue.sort.includes('discount')) {
        filter.sortDiscount = filterValue.sort; // use this when sort includes 'discount'
      } else if (filterValue.sort.includes('price')) {
        filter.sortPrice = filterValue.sort;
      }
      else if (filterValue.sort.includes('new') || filterValue.sort.includes('popular')) {
        filter.filter = filterValue.sort;
      }
    }

    if (filterValue?.priceSort) {
      filter.sortPrice = filterValue.priceSort;
    }

    if (filterValue?.priceRange) {
      // filter.filterStartPrice = filterValue.priceRange[0];
      // filter.filterEndPrice = filterValue.priceRange[1];
      const [start, end] = filterValue.priceRange;
      if (start !== 0 || end !== 1000) {
        filter.filterStartPrice = start;
        filter.filterEndPrice = end;
      }

      // if (filter.filterEndPrice > 500) {
      //   filter.sortPrice = "highest-price";
      // }
    }

    if (filterValue?.sizes) {
      filter.filterSize = filterValue.sizes.value;
    }
  
    if (filterValue?.colors) {
      filter.filterColor = filterValue.colors.value;
    }
  
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
            const rawFilters = result.filters;
            console.log('Selected Filters:', result.filters);    
            this.getAllProduct(rawFilters)
          }
        }
        console.log('close', result)
      }
    )
  }


  // filter(){
  //   filter: {
  //     sortDiscount: '',
  //     sortPrice: '',
  //     filterStartPrice: '',
  //     filterEndPrice: '',
  //     filterColor
  //     filterSize
  //   }
  // }


}
