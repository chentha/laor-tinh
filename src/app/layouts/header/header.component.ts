import { Component, Input, OnInit } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GeneralFunctionService } from 'src/app/core/function/general-function.service';
import { SearchFormComponent } from 'src/app/search-form/search-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AllApiService } from 'src/app/core/all-api.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CartComponent } from 'src/app/cart/cart.component';
import { CartService } from 'src/app/core/cart.service';
import { ProfileUserComponent } from 'src/app/profile-user/profile-user.component';
import { NGXToastrService } from 'src/app/core/function/toast.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    visible: boolean = false;
    isPasswordVisible: boolean = false;
    checkAfterLogin: boolean = false;
    userData: any;
    Avatar: any;
    accessToken: any;
    cartCount: number = 0;
    cateList:any;

    inputGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        confirmationPassword: new FormControl('', Validators.required),
        gender: new FormControl('', Validators.required)
    })

    constructor(
        private allFunction: GeneralFunctionService,
        public dialog: MatDialog,
        private allApi: AllApiService,
        private cookieService: CookieService,
        private router: Router,
        private cartService: CartService,
        private ToastrService: NGXToastrService,
    ) {
        this.cartService.cartCount$.subscribe((count) => {
            this.cartCount = count;
        });
        this.getCategory();
    }


    ngOnInit(): void {
        this.loadDataUser();

        localStorage.getItem('num_cart')
        const cart = localStorage.getItem('num_cart')
        console.log('data cart', cart)
    }

    get f() {
        return this.inputGroup.controls
    }


    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    showSubmenu(item: any) {
        item.showSubmenu = true;
    }

    hideSubmenu(item: any) {
        item.showSubmenu = false;
    }

    getCategory(){
        this.allApi.getAllData(this.allApi.categoryUrl).subscribe(
            (data:any) => {
                this.cateList = data.data;
                console.log('data', this.cateList)
            }
        )
    }

    gotoPage(category: any) {
        console.log(category);
        this.router.navigate(
          ['shop-more'],
          {
            queryParams: { category: category },
          },
        );
      }


    login() {
        this.checkAfterLogin = true;
        let inputData = {
            'email': this.f.email.value,
            'password': this.f.password.value
        }

        // Encode email and password in Base64 
        // header with Basic Auth
        const credentials = btoa(`${environment.Username}:${environment.Password}`);
        const headers = {
            Authorization: `Basic ${credentials}`
        };

        this.allApi.loginData(this.allApi.loginUrl, inputData, { headers }).subscribe(
            (data: any) => {
                this.userData = data;
                this.Avatar = data.data.user.avatar;
                this.accessToken = data.data.accessToken;
                console.log('Login successful:', this.userData);
                this.checkAfterLogin = false;
                this.visible = false;
                this.ToastrService.typeSuccessLogint();
                // const tmpToken = this.allFunction.encryptFileForLocal(environment.localEncriptKey, this.userData.accessToken);
                // const profile = this.allFunction.encryptFileForLocal(environment.localEncriptKey, JSON.stringify(this.userData));


                // this.cookieService.set('token', tmpToken, 0.25); 
                localStorage.setItem('user', JSON.stringify(this.userData));
                localStorage.setItem('token', this.accessToken);
            },
            err => {
                this.checkAfterLogin = true;
                console.error('Login error:', err);
            }
        );
    }


    signup() {
        this.checkAfterLogin = true;
        let inputData = {
            "name": this.f.name.value,
            "email": this.f.email.value,
            "password": this.f.password.value,
            "confirmationPassword": this.f.confirmationPassword.value,
            "gender": this.f.gender.value
        }

        const credentials = btoa(`${environment.Username}:${environment.Password}`);
        const headers = {
            Authorization: `Basic ${credentials}`
        };

        this.allApi.signupData(this.allApi.registerUrl, inputData, { headers }).subscribe(
            (data: any) => {

                this.checkAfterLogin = false;
                console.log('data success register', data);
                this.userData = data;
                this.Avatar = data.data.avatar;
                // const profile = this.allFunction.encryptFileForLocal(environment.localEncriptKey, JSON.stringify(user));
                this.ToastrService.typeSuccessRegister();
                this.checkAfterLogin = false;
                this.visible = false;
                localStorage.setItem('user', JSON.stringify(this.userData));

            },
            err => {
                this.checkAfterLogin = true;
                console.log('Error', err)
            }
        )
    }

    loadDataUser() {
        const profileUser = localStorage.getItem('user');

        if (profileUser) {
            this.userData = JSON.parse(profileUser);

            this.Avatar = this.userData?.data?.user?.avatar;
        }
    }


    showDialoglogin() {
        this.visible = true;
    }

    openForm(type: 'add' | 'edit', data?: any) {
        let tmp_DialogData: any = {
            size: "medium",
            type: type,
            form_name: 'search'
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


    openFormCart(type: 'add' | 'edit', data?: any) {
        let tmp_DialogData: any = {
            size: "medium",
            type: type,
            form_name: 'cart'
        }
        const dialogRef = this.dialog.open(CartComponent,
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
                        result.is_refresh = true
                    }
                }
                console.log('close', result)
            }
        )
    }

    openFormProfile(type: 'add' | 'edit', data?: any) {
        let tmp_DialogData: any = {
            size: "medium",
            type: type,
            form_name: 'profile'
        }
        const dialogRef = this.dialog.open(ProfileUserComponent,
            this.allFunction.dialogDataProfile(
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
                        result.is_refresh = true
                    }
                }
                console.log('close', result)
            }
        )
    }

    logout() {
        console.log("logout")
        localStorage.removeItem('token');
        localStorage.clear();
        this.checkAfterLogin = false
        if (!localStorage.getItem('token')) {
            this.router.navigate(['']);
            this.checkAfterLogin = true
            this.userData = null
            //   window.location.reload(); 
            console.log("no token", this.userData)
        }

    }

}

