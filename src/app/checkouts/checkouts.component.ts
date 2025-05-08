import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AllApiService } from '../core/all-api.service';
import { CartService } from '../core/cart.service';
import { NGXToastrService } from '../core/function/toast.service';
import { FormControl } from '@angular/forms';
import { OrderService } from '../core/order.service';
import { LocationService } from '../core/location.service';
import { KhqrComponent } from '../popup-khqr/khqr/khqr.component';
import { GeneralFunctionService } from '../core/function/general-function.service';
import { MatDialog } from '@angular/material/dialog';

declare var QRCode: any;
declare var KHQR: any;

@Component({
  selector: 'app-checkouts',
  templateUrl: './checkouts.component.html',
  styleUrls: ['./checkouts.component.scss']
})
export class CheckoutsComponent {
  message: string = 'Congratulations! Your order has been successfully placed!';
  orderId: any;
  quantity: number = 1;
  userId: any;
  CountCart: any;
  cartCount: any;
  nameUser: any;
  orderData: any;
  visible: boolean = false;
  balloons: any[] = [1, 2, 3, 4, 5];
  resultData: any[] = [];
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    locationName?: string;
  } | null = null;

  bank = new FormControl();
  remark = new FormControl();

  errorMessage: string | null = null;
  dataPayment:any;
  dataProduct:any;
  totalPrice:any;

  // inputGroup = new FormGroup({
  //   paymentMethod: new FormControl(''),
  //   userId: new FormControl(''),
  //   name: new FormControl(''),
  //   longitude: new FormControl(''),
  //   latitude: new FormControl('')
  // })

  paymentOptions = [
    { value: 'KHQR', label: 'KHQR', image: '../../assets/images/khqr.png' },
    // { value: 'Credit Card', label: 'Credit Card', image: '../../assets/images/credit-debit-card.png' },
    // { value: 'AC', label: 'Xpay', image: '../../assets/images/xpay.png' },
    // { value: 'Wing', label: 'Wing', image: '../../assets/images/Wing.png' },
    // { value: 'Cash On Delivery', label: 'Cash On Delivery', image: '../../assets/images/cod-kh-en.png' },
  ];


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
    private ToastrService: NGXToastrService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private allFunction:GeneralFunctionService,
    private locationService: LocationService,
    public dialog: MatDialog,
    private renderer: Renderer2, 
    private el: ElementRef,
  ) {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['order_id'];
      console.log(this.orderId)
    });

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.userId = user.data.user.id;

    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });


    this.orderData = this.orderService.getOrderData();
    console.log('Order Data:', this.orderData);

    this.getAllData()
  }

  ngOnInit() {
    const data = localStorage.getItem('user');
    if (data) {
      const parsedData = JSON.parse(data);
      this.nameUser = parsedData.data.user.name;
    } else {
      this.nameUser = null;
    }

    this.fetchLocation()

  }


  // looadData(){
  //   const user = localStorage.getItem('user')
  //   if(user){
  //     const dataUser = JSON.parse(user);

  //   }
  // }

  // get f() {
  //   return this.inputGroup.controls
  // }

  getAllData() {
    this.allApi.getDataWithFilter(this.allApi.cartUrl).subscribe(
      (data: any) => {
        this.resultData = data.data;
        this.dataProduct = data;
  
        this.totalPrice = this.resultData.reduce((sum: number, item: any) => {
          const price = item.product.unitPrice || 0;
          const discount = item.product.discount || 0;
          const quantity = item.quantity || 1;
  
          const finalPrice = price - (price * discount / 100);
          return sum + (finalPrice * quantity);
        }, 0);
  
        console.log('resultData', this.resultData);
        console.log('total price', this.totalPrice);
      },
      (err: any) => {
        console.log('Error', err);
      }
    );
  }



  closeDialog() {
    this.visible = false;
    this.router.navigate(['/']);
  }


  fetchLocation(): void {
    this.locationService
      .getCurrentLocation()
      .then((location) => {
        this.location = location;
        console.log('User location:', location);
      })
      .catch((error) => {
        this.errorMessage = error;
        console.error(error);
      });
  }


  Payment() {
    const option = this.dataProduct?.data[0]?.product?.optionProducts[0];

    const sizes = option?.sizes?.map((s: { id: number; value: string; status: boolean }) => s.id) || [];
    const colors = option?.colors?.map((c: { id: number; value: string; status: boolean }) => c.id) || [];    
    
    const inputData = {
      items: [
        {
          productId: this.dataProduct?.data[0]?.product?.id,
          quantity: this.dataProduct?.data[0]?.quantity,
          optionValues: [...sizes, ...colors]
        }
      ],
      remark: this.remark.value
    };
    
    
    console.log('json data order', inputData)

    this.allApi.createData(this.allApi.paymentUrl, inputData).subscribe(
      (data: any) => {
        console.log('data order success', data)
        // this.visible = true;
        // this.deleteCart(this.userId);
        this.createPayment(data.data.id);
      }
    )
  }


  deleteCart(id: any) {
    this.allApi.deleteData(this.allApi.cartUrl + '/', id).subscribe(
      (data: any) => {
        console.log('data delete all cart', data)
      }
    )
  }


  createPayment(id?:number){
    this.allApi.createPayment(id).subscribe(
      (data:any) => {
        console.log('data sucess payment', data)
        this.dataPayment = data;
        // this.openFormKhqr('edit', data)
        // this.generateKHQR()
        this.verifyPayment(data.data.paymentId)
      }
    )
  }

  verifyPayment(id:number){
    this.allApi.verifyPayment(this.allApi.verifyPaymentUrl , id).subscribe(
      (data:any) =>{
          console.log('payment success');
          this.visible = true;
      }
    )
  }


  generateKHQR() {
    // console.log('khqr', KHQRString)
    const KHQRString = {
      Status: { Code: 0, ErrorCode: null, Message: null },
      Data: {
        PayloadFormatIndicator: "01",
        PointOfInitiationMethod: "12",
        MerchantType: "30",
        BakongAccountID: "chentha_hour@aclb",
        // MerchantID: "123456",
        // AccountInformation: null,
        // UpiAccountInformation: "1234567812345678ABCDEFGHIJKLMNO",
        // AcquiringBank: "Dev Bank",
        // MerchantCategoryCode: "5999",
        // CountryCode: "KH",
        MerchantName: "Chentha Hour",
        MerchantCity: "PHNOM PENH",
        TransactionCurrency: "840",
        TransactionAmount: "100",
        BillNumber: "#12345",
        MobileNumber: "85512233455",
        StoreLabel: "Coffee Shop",
        TerminalLabel: "Cashier_1",
        // PurposeOfTransaction: "Buy coffee",
        // MerchantAlternateLanguagePreference: "km",
        // MerchantNameAlternateLanguage: "ចន ស្មីន",
        // MerchantCityAlternateLanguage: "ភ្នំពញ",
        // Timestamp: "1688022515354",
        // CRC: "A367"
      }
    }

    const qrcode = new QRCode(document.getElementById("qrcode"), {
      text: KHQRString,
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
      svg: true
    });

    console.log('khqr1', qrcode)
    const khqrData = {
      TransactionAmount: "1",
      MerchantName: "Laor Tinh",
      MerchantCity: "PHNOM PENH"
    };
    
    const khqr = this.encodeKHQR(khqrData);
    console.log('khqr1', khqr)
    const decodeResult = KHQR.BakongKHQR.decode(khqr);
    console.log('decodeResult', decodeResult)
    const { merchantName, transactionAmount, transactionCurrency } = decodeResult.data as { merchantName: any, transactionAmount: number, transactionCurrency: string };

    const currencyCodes: { [key: string]: string } = {
      "840": 'USD',
      "116": 'KHR'
    };


    const currencyCode = currencyCodes[transactionCurrency];

    this.renderer.setProperty(this.el.nativeElement.querySelector("#merc-name"), 'innerHTML', merchantName);
    this.renderer.setProperty(this.el.nativeElement.querySelector("#total-amount-khqr"), 'innerHTML', this.formatAmount(transactionAmount, currencyCode));
    this.renderer.setProperty(this.el.nativeElement.querySelector("#currency"), 'innerHTML', "USD");
    this.renderer.setProperty(this.el.nativeElement.querySelector("#currency-sign"), 'innerHTML', this.getCurrencySign(currencyCode));
  }

   //# format currency amount
   formatAmount(amount = 0, currencyCode: string) {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: "code",
      minimumFractionDigits: currencyCode === "KHR" ? 0 : 2,
    })
      .format(amount)
      .replace(currencyCode, "")
      .trim();
  }

  //# cusrrency sign
  getCurrencySign(currencyCode: string) {
    const currencySigns: { [key: string]: string } = {
      "USD": `<svg
      width="36"
      height="36"
      class="ks_wth36 ks_hgt36 ks_pos_abs"
      viewBox="0 0 30 30"
    >
      <path
        d="M14.5714 27.6429C21.7906 27.6429 27.6429 21.7906 27.6429 14.5714C27.6429 7.35228 21.7906 1.5 14.5714 1.5C7.35228 1.5 1.5 7.35228 1.5 14.5714C1.5 21.7906 7.35228 27.6429 14.5714 27.6429Z"
        fill="black"
        stroke="white"
        stroke-width="3"
      ></path>
      <path
        d="M13.6688 22.8373V20.8248C12.3464 20.693 11.3606 20.3038 10.7114 19.6569C10.0622 19.0101 9.69548 18.2135 9.61133 17.2672H11.7753C11.8715 17.7583 12.118 18.1656 12.5147 18.489C12.9114 18.8124 13.5967 18.9741 14.5705 18.9741C15.5804 18.9741 16.2957 18.8124 16.7165 18.489C17.1493 18.1536 17.3657 17.7463 17.3657 17.2672C17.3657 16.8719 17.2455 16.5484 17.005 16.2969C16.7646 16.0453 16.3919 15.8297 15.8869 15.6501C15.394 15.4584 14.7629 15.2847 13.9934 15.129C13.1278 14.9373 12.3945 14.6977 11.7934 14.4103C11.1923 14.1108 10.7354 13.7155 10.4228 13.2244C10.1223 12.7332 9.972 12.1044 9.972 11.3377C9.972 10.4992 10.2846 9.76253 10.9097 9.12766C11.5349 8.49279 12.4546 8.10348 13.6688 7.95974V6.30664H15.4722V7.95974C16.6383 8.09151 17.522 8.46883 18.1231 9.09172C18.7362 9.70264 19.0849 10.4513 19.169 11.3377H17.005C16.9088 10.8825 16.6624 10.5172 16.2657 10.2417C15.8809 9.95419 15.3159 9.81045 14.5705 9.81045C13.7049 9.81045 13.0798 9.96018 12.695 10.2596C12.3223 10.5591 12.136 10.9185 12.136 11.3377C12.136 11.9127 12.3764 12.3439 12.8573 12.6314C13.3382 12.9189 14.0776 13.1645 15.0754 13.3681C15.8208 13.5238 16.47 13.7095 17.0231 13.9251C17.5761 14.1288 18.0389 14.3803 18.4116 14.6798C18.7843 14.9673 19.0608 15.3266 19.2412 15.7579C19.4335 16.1771 19.5297 16.6802 19.5297 17.2672C19.5297 18.2015 19.1931 18.9981 18.5198 19.6569C17.8466 20.3157 16.8307 20.705 15.4722 20.8248V22.8373H13.6688Z"
        fill="white"
      ></path>
    </svg>`,
      "KHR": `<svg width="36" height="36"  class="ks_wth36 ks_hgt36 ks_pos_abs" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22.5" cy="22.5" r="22.5" fill="white"/>
      <circle cx="22.501" cy="22.4996" r="18.9705" fill="black"/>
      <path d="M21.7204 31.6058C20.6315 31.6058 19.7018 31.4634 18.9312 31.1786C18.1607 30.8771 17.566 30.4415 17.1472 29.872C16.7284 29.2857 16.519 28.5821 16.519 27.7613C16.519 26.9405 16.7284 26.2453 17.1472 25.6758C17.5828 25.0895 18.2026 24.6456 19.0066 24.344C19.8274 24.0425 20.8325 23.8917 22.0219 23.8917V26.3291C21.3016 26.3291 20.7488 26.4463 20.3635 26.6808C19.9782 26.8986 19.7856 27.242 19.7856 27.7111C19.7856 28.1801 19.9615 28.5403 20.3132 28.7915C20.6818 29.026 21.1341 29.1433 21.6701 29.1433H22.7003L21.8209 30.0981L21.8962 22.2082H25.012V31.6058H21.7204ZM18.3785 22.9118V20.4996H27.7509V22.9118H18.3785ZM21.8962 21.2283V20.3991C21.8962 20.2316 21.8627 20.0975 21.7957 19.997C21.7287 19.8798 21.6115 19.7709 21.444 19.6704C21.1424 19.4694 20.7655 19.2516 20.3132 19.0171C19.8777 18.7826 19.5259 18.5899 19.2579 18.4392C18.5543 18.0204 18.1188 17.4676 17.9513 16.7808C17.7838 16.0772 17.8508 15.3401 18.1523 14.5696C18.4706 13.799 18.9145 13.2881 19.484 13.0368C20.0536 12.7855 20.866 12.6599 21.9214 12.6599C22.6082 12.6599 23.2866 12.6934 23.9567 12.7604C24.6435 12.8107 25.3219 12.8861 25.992 12.9866V15.7757C25.3219 15.6752 24.6602 15.5914 24.0069 15.5244C23.3536 15.4574 22.6082 15.4239 21.7706 15.4239C21.5193 15.4239 21.3435 15.449 21.2429 15.4993C21.1424 15.5495 21.0754 15.6333 21.0419 15.7505C20.9917 15.8678 20.9749 15.9767 20.9917 16.0772C21.0084 16.1777 21.0838 16.2698 21.2178 16.3536C21.3351 16.4206 21.5193 16.5295 21.7706 16.6803C22.0386 16.8143 22.3234 16.965 22.6249 17.1325C22.9432 17.3001 23.2196 17.4592 23.4541 17.61C23.9734 17.9115 24.3587 18.2716 24.61 18.6904C24.878 19.0925 25.012 19.662 25.012 20.3991V21.2283H21.8962Z" fill="white"/>
      </svg>`
    };

    return currencySigns[currencyCode] ;
  }

  encodeKHQR(data: any): string {
    const format = (id: string, value?: string): string => {
      if (!value) return '';
      const len = value.length.toString().padStart(2, '0');
      return `${id}${len}${value}`;
    };
  
    // Merchant Account Information Template (Tag 29)
    const merchantAccountInfo = 
      format("00", "khqr@ppcb") +
      format("01", "0000") +
      format("02", "39360226Phnom Penh Commercial Bank"); // Example bank
  
    const merchantAccount = format("29", merchantAccountInfo);
  
    const payload = [
      format("00", "01"), // Payload Format Indicator
      format("01", "12"), // Point of Initiation Method
      merchantAccount,
      format("52", "5999"), // Merchant Category Code (generic retail)
      format("53", "840"),  // Currency (USD)
      format("54", data.TransactionAmount), // Amount
      format("58", "KH"), // Country
      format("59", data.MerchantName), // Merchant Name
      format("60", data.MerchantCity), // Merchant City
      format("62", format("01", "2400017020240521000008420199170013171628268728163047")) // Additional Data
    ];
  
    // Generate string before CRC
    let qrString = payload.join('');
    qrString += "6304"; // Append CRC ID and length placeholder
  
    // Compute CRC16-CCITT (False)
    const crc = this.calculateCRC(qrString).toUpperCase();
    return qrString + crc;
  }
  
  calculateCRC(str: string): string {
    let crc = 0xFFFF;
    for (let c of str) {
      crc ^= c.charCodeAt(0) << 8;
      for (let i = 0; i < 8; i++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).padStart(4, '0');
  }
  


}
