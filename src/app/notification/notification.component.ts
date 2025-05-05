import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AllApiService } from '../core/all-api.service';
import { GeneralFunctionService } from '../core/function/general-function.service';
import { SearchFormComponent } from '../search-form/search-form.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  loadingGet = false;
  isRefreshTable = false;
  resultData:any;

  constructor(
    private allFunction: GeneralFunctionService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataDetail: any,
    public dialogRef: MatDialogRef<SearchFormComponent>,
    private allApi: AllApiService,
    private router: Router,
  )
  {
    this.getAllData()
  }


  getAllData(){
    this.loadingGet = true;
    let filter = {
      // keyword: this.search_key
    }

    this.allApi.getDataWithFilter(this.allApi.favoriteUrl, filter).subscribe(
      (data: any) =>{
        this.loadingGet = false;
        this.resultData = data?.data;
        console.log('favorite data', data)
      },
      (err:any) =>{
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
    this.allFunction.closeDialog(this.dataDetail.form_name)
    setTimeout(() => {
      this.dialogRef.close(
        { is_refresh: this.isRefreshTable }
      );
    }, this.allFunction.closeDelaySmall);
  }

}
