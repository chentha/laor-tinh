import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MegaMenuModule } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './layouts/main/main.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HeaderComponent } from './layouts/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {CarouselModule} from 'primeng/carousel';
import { DetialProductComponent } from './detial-product/detial-product.component';

import { GalleriaModule } from 'primeng/galleria';
import { AccordionModule } from 'primeng/accordion';

import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatExpansionModule} from '@angular/material/expansion';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './core/auth/auth.service';
import { DialogModule } from 'primeng/dialog';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoadingCompanyComponent } from './shared/components/loading-company/loading-company.component';
import { ViewMoreComponent } from './view-more/view-more.component';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchFormComponent } from './search-form/search-form.component';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { LoadingButtonComponent } from './shared/components/loading-button/loading-button.component';
import { CartComponent } from './cart/cart.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CheckoutsComponent } from './checkouts/checkouts.component';
import { ProfileUserComponent } from './profile-user/profile-user.component';
import {MatRadioModule} from '@angular/material/radio';
import { KhqrComponent } from './popup-khqr/khqr/khqr.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent,
    FooterComponent,
    HeaderComponent,
    DetialProductComponent,
    LoadingComponent,
    LoadingCompanyComponent,
    ViewMoreComponent,
    SearchFormComponent,
    LoadingButtonComponent,
    CartComponent,
    CheckoutsComponent,
    ProfileUserComponent,
    KhqrComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    ButtonModule,
    MegaMenuModule,
    GalleriaModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    CarouselModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    AnimateOnScrollModule,
    MatDialogModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    TabViewModule,
    ProgressSpinnerModule,
    MatRadioModule,
    ToastrModule.forRoot(),
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    // CookieService,
    // LocationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

