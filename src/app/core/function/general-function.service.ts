import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core'; 
import * as CryptoJS from 'crypto-js'; // npm i crypto-js 

@Injectable({
  providedIn: 'root',
})
export class GeneralFunctionService {
 
  environment = environment;
  searchDelay = 1800 // 3s
  closeDelaySmall = 550;

  constructor (
    ) {
      
  }
 

  //** method encrypt value */
  encryptFileForLocal(keys: any, value: any) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encryptd = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encryptd.toString();
  }

  //** method decrypt value */
  decryptFileForLocal(keys: any, value: any) {
    if (value != null) {
      var key = CryptoJS.enc.Utf8.parse(keys);
      var iv = CryptoJS.enc.Utf8.parse(keys);
      var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    }
    else {
      return null;
    }
  }


  closeDialog(form_name: any) {
    document
      .getElementsByClassName(form_name)[0]
      .classList.remove("animate__slideInLeft");
    document
      .getElementsByClassName(form_name)[0]
      .classList.add("animate__slideOutRight");
  }

  closeUserDialog(form_name: any) {
    const elements = document.getElementsByClassName(form_name);
    if (elements.length > 0) {
      elements[0].classList.remove("animate__slideInLeft");
      elements[0].classList.add("animate__slideOutRight");
    } else {
      console.warn(`Element with class ${form_name} not found.`);
    }
  }
  

  dialogData(size: 'medium' | 'large' | 'extra large', type?: 'add' | 'edit' | 'reset' | 'view', form_name?: any, data?: any) {
    let width = '100%'
    if (size == 'medium') { width = '500px' }
    else if (size == 'large') { width = '1000px' }
    else if (size == 'extra large') { width = '1200px' }
    let tmp_data: any = {
      width: width,
      height: "100%",
      position: { right: '0' },
      disableClose: true,
      data: {
        type: type,
        form_name: form_name,
        data: data || null
      },
      // panelClass: ["my_popup_slide" , "my_slide_left", "max-width-95"]
      panelClass: [form_name, "animate__animated", "animate__slideInRight", "m-w-100", "animate_duration_0_5"]
    };
    return tmp_data
  }



  dialogDataProfile(size: 'medium' | 'large' | 'extra large', type?: 'add' | 'edit' | 'reset' | 'view', form_name?: any, data?: any) {
    let width = '100%'
    if (size == 'medium') { width = '500px' }
    else if (size == 'large') { width = '1000px' }
    else if (size == 'extra large') { width = '1200px' }
    let tmp_data: any = {
      width: width,
      height: "70%",
      position: { center: '0' },
      disableClose: true,
      data: {
        type: type,
        form_name: form_name,
        data: data || null
      },
      // panelClass: ["my_popup_slide" , "my_slide_left", "max-width-95"]
      // panelClass: [form_name, "animate__animated", "animate__slideInRight", "m-w-100", "animate_duration_0_5"]
    };
    return tmp_data
  }

  dialogKhqr(size: 'medium' | 'large' | 'extra large', type?: 'add' | 'edit' | 'reset' | 'view', form_name?: any, data?: any) {
    let width = '100%'
    if (size == 'medium') { width = '500px' }
    else if (size == 'large') { width = '1000px' }
    else if (size == 'extra large') { width = '1200px' }
    let tmp_data: any = {
      width: width,
      height: "70%",
      position: { center: '0' },
      disableClose: true,
      data: {
        type: type,
        form_name: form_name,
        data: data || null
      },
      // panelClass: ["my_popup_slide" , "my_slide_left", "max-width-95"]
      // panelClass: [form_name, "animate__animated", "animate__slideInRight", "m-w-100", "animate_duration_0_5"]
    };
    return tmp_data
  }

}