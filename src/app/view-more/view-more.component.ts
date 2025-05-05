import { Component, OnInit } from '@angular/core';
import { AllApiService } from '../core/all-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.scss']
})
export class ViewMoreComponent implements OnInit {
  dataProduct: any;
  Cate: any;
  loading: boolean = false;

  constructor(
    private allApi: AllApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to queryParams to react to any changes
    this.route.queryParams.subscribe(params => {
      this.Cate = params['category'];

      if (this.Cate) {
        this.getAllProduct(this.Cate);
      }

      console.log('Category:', this.Cate);
    });
  }

  gotoPage(product: any): void {
    console.log(product);
    this.router.navigate(
      ['detail-product'],
      {
        queryParams: { product_id: product },
      }
    );
  }

  getAllProduct(Cate?: any): void {
    this.loading = true;

    const filter = {
      filterCategory: this.Cate
    };

    this.allApi.getDataWithFilter(this.allApi.productUrl, filter).subscribe(
      (data: any) => {
        this.loading = false;
        this.dataProduct = data.data;
        console.log('data response', this.dataProduct);
      },
      error => {
        this.loading = false;
        console.error('Error loading products', error);
      }
    );
  }
}
