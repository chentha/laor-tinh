import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AllApiService } from '../core/all-api.service';
import { GeneralFunctionService } from '../core/function/general-function.service';
import { SearchFormComponent } from '../search-form/search-form.component';

@Component({
  selector: 'app-filter-product',
  templateUrl: './filter-product.component.html',
  styleUrls: ['./filter-product.component.scss']
})
export class FilterProductComponent {

  loadingGet = false;
  isRefreshTable = false;
  resultData: any;
  filterStartPrice: number = 0;
  filterEndPrice: number = 1000;
  selectedSizeId: number | null = null;
  selectedColorId: number | null = null;

  constructor(
    private allFunction: GeneralFunctionService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataDetail: any,
    public dialogRef: MatDialogRef<SearchFormComponent>,
    private allApi: AllApiService,
    private router: Router,
  ) {
    this.getAllData();
    this.listSize();
    this.listColor();
  }


  selectSize(size: any): void {
    console.log('sizer', size)
    this.selectSize = size;
  }


  selectColor(color: any): void {
    this.selectColor = color;
  }


  sortOptions = [
    { label: 'New Arrivals', value: 'new-arrivals' },
    { label: 'Popular', value: 'popular' },
    { label: 'Price (Low First)', value: 'lowest-price' },
    { label: 'Price (High First)', value: 'highest-price ' },
    { label: 'Discount (Low First)', value: 'lowest-discount' },
    { label: 'Discount (High First)', value: 'highest-discount' }
  ];

  selectedSort = 'Product Recommend';
  priceRange: [number, number] = [0 , 1000];
  dataSize: any;
  dataColor: any;
  selectedSizes: any;


  listSize() {
    this.allApi.getAllData(this.allApi.sizeListUrl).subscribe(
      (data: any) => {
        console.log('size', data);
        this.dataSize = data.data
      }
    )
  }


  listColor() {
    this.allApi.getAllData(this.allApi.colorListUrl).subscribe(
      (data: any) => {
        console.log('size', data);
        this.dataColor = data.data
      }
    )
  }

  toggleSize(size: string | number): void {
    const index = this.selectedSizes.indexOf(size);
    if (index === -1) {
      this.selectedSizes.push(size);
    } else {
      this.selectedSizes.splice(index, 1);
    }
  }


  clearFilters(): void {
    this.selectedSort = 'Product Recommend';
    this.filterStartPrice = 0;
    this.filterEndPrice = 1000;
    this.priceRange = [0, 1000];
    this.selectedSizes = [];
  }


  applyFilters(): void {
    // Logic to apply the filter
    this.priceRange = [this.filterStartPrice, this.filterEndPrice];
    this.closeForm()
  }



  getAllData() {
    this.loadingGet = true;
    let filter = {
      // keyword: this.search_key
    }

    this.allApi.getDataWithFilter(this.allApi.favoriteUrl, filter).subscribe(
      (data: any) => {
        this.loadingGet = false;
        this.resultData = data?.data;
        console.log('favorite data', data)
      },
      (err: any) => {
        this.loadingGet = false;
        console.log('Error', err)
      }
    )
  }

  gotoPage(product: any) {
    console.log(product);
    this.router.navigate(
      ['detail-product'],
      {
        queryParams: { product_id: product },
      },
    );
    this.closeForm();
  }


  closeForm() {
    // const [startPrice, endPrice] = this.priceRange || [];

    // const adjustedPriceRange = endPrice >= 500 ? 'highest-price' : [startPrice, endPrice];
  
    const selectedFilterData = {
      sort: this.selectedSort,
      priceRange: this.priceRange,
      sizes: this.selectSize,
      colors: this.selectColor
    };
    this.allFunction.closeDialog(this.dataDetail.form_name)
    setTimeout(() => {
      this.dialogRef.close(
        { is_refresh: this.isRefreshTable, filters: selectedFilterData }
      );
    }, this.allFunction.closeDelaySmall);
  }


}
