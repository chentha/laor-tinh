import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllApiService {
  baseApi = environment.baseAPI;
  finalBaseApi = this.baseApi + "api";

  productUrl = '/public/products';
  categoryUrl = '/public/categories';
  loginUrl = '/auth/login';
  registerUrl = '/auth/register';
  cartUrl = '/carts';
  orderUrl = '/orders';
  paymentUrl = '/orders/payment'
  userUrl = '/users';
  bannersUrl = '/public/banners';

  paymentBankUrl = 'api/orders/management/{{orderId}}/payment?payment-method=CASH'

  constructor(
    private http: HttpClient,
  ) { }


  getDataWithFilter(url: any, filter?: any) {
    // const params = {}
    // params['page'] =page
    // params['page_size'] = page_size
    let myParams = new HttpParams()
    if (filter) {
      Object.keys(filter).forEach(function (key) {
        if (filter[key] != null) {
          myParams = myParams.append(key, filter[key])
        }
      });
    }
    return this.http.get(this.finalBaseApi + url, { params: myParams })
  }


  //khqr payment
  createPayment(id?: number) {
    return this.http.post(this.finalBaseApi + 'api/orders/management/' + id + '/payment?payment-method=', 'CASH');
  }


  // all-api.service.ts (or your API service file)
  getAllDataHeader(url: string, headers?: HttpHeaders) {
    const options = headers ? { headers } : {};
    return this.http.get(url, options);
  }


  getAllData(url: any) {
    return this.http.get(this.finalBaseApi + url)
  }

  getNextUrl(url: any) {
    return this.http.get(url)
  }

  getDataDetailById(url: any, id: any, filter?: any) {
    let myParams = new HttpParams()
    if (filter) {
      Object.keys(filter).forEach(function (key) {
        if (filter[key] != null) {
          myParams = myParams.append(key, filter[key])
        }
      });
    }
    return this.http.get(this.finalBaseApi + url + '/' + id, { params: myParams })
  }

  getDataDetailByIdNoPagination(url: any, id: any) {
    console.log(this.finalBaseApi + url + id + '/')
    return this.http.get(this.finalBaseApi + url + id + '/?pagination=false')
  }

  getDataWithoutPagination(url: any) {
    return this.http.get(this.finalBaseApi + url)
  }


  createData(url: any, data: any) {
    return this.http.post(this.finalBaseApi + url, data);
  }

  createDataHeader(url: any, data: any, headers: HttpHeaders) {
    return this.http.post(this.finalBaseApi + url, data, { headers });
  }  

  loginData(url: any, data: any, options?: any) {

    return this.http.post(this.finalBaseApi + url, data, options);
  }

  signupData(url: any, data: any, options?: any) {

    return this.http.post(this.finalBaseApi + url, data, options);
  }

  editData(url: any, data: any, id: any) {
    return this.http.put(this.finalBaseApi + url + id, data);
  }

  deleteData(url: any, id: any) {
    return this.http.delete(this.finalBaseApi + url + id)
  }


}
