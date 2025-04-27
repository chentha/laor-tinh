// qr-code.service.ts
import { Injectable } from '@angular/core';

declare var KHQR: any;
declare var QRCode: any;

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  constructor() {}

  generateQrCode(data: string, options?: any): string {
    // Use KHQR for QR generation
    const khqr = new KHQR();
    khqr.setQRData(data);
    const qrCodeSvg = khqr.generateSVG(options);
    return qrCodeSvg;
  }

  generateQrCodeWithQRCodeLib(data: string, elementId: string): void {
    // Use QRCode library for QR generation
    new QRCode(document.getElementById(elementId), data);
  }
}