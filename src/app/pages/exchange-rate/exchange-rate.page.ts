import { Component } from '@angular/core';
import { ExchangeRateService } from 'src/app/shared/services/exchange-rate.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: 'exchange-rate.page.html',
  styleUrls: ['exchange-rate.page.scss']
})
export class ExchangeRatePage {

  JPY_to_USD = 0;
  USD_to_JPY = 0;
  JPY_to_CRC = 0;
  CRC_to_JPY = 0;
  isLoading = false;

  yenToUsd_input = 0;
  usdToYen_input = 0;
  crcToYen_input = 0;
  yenToCrc_input = 0;

  constructor(
    private exchangeRateService: ExchangeRateService,
    private localStorageService: LocalStorageService) {
  }

  ionViewWillEnter() {
    this.isLoading = false;
    let lastFetch = this.localStorageService.getItem("lastFetchForExchangeRate");
    if (!lastFetch) {
      let today = new Date();
      today.setTime(today.getTime() + 12 * 60 * 60 * 1000); // every 12 hours will reload the API value
      this.localStorageService.setItem("lastFetchForExchangeRate", JSON.stringify(today.getTime()));
      this.setConversions();
    } else {
      let now = new Date().getTime();
      if (now > JSON.parse(lastFetch)) {
        this.setConversions();
      } else {
        this.JPY_to_USD = JSON.parse(this.localStorageService.getItem("JPY_to_USD") || "0");
        this.USD_to_JPY = JSON.parse(this.localStorageService.getItem("USD_to_JPY") || "0");
        this.JPY_to_CRC = JSON.parse(this.localStorageService.getItem("JPY_to_CRC") || "0");
        this.CRC_to_JPY = JSON.parse(this.localStorageService.getItem("CRC_to_JPY") || "0");
      }
    }
  }

  clearData() {
    this.crcToYen_input = 0;
    this.usdToYen_input = 0;
    this.yenToCrc_input = 0;
    this.yenToUsd_input = 0;
  }

  showErrorMsg() {
    Swal.fire({
      icon: 'error',
      text: 'Ocurrió un error al obtener la información.',
      heightAuto: false,
    });
  }

  getRoundValue(value: number) {
    return Math.floor(value * 100) / 100
  }

  setConversions() {
    this.getConversionFromYenToDollar();
    this.getConversionFromDollarToYen();
    this.getConversionFromYenToColon();
    this.getConversionFromColonToYen();
  }

  getConversionFromDollarToYen() {
    this.isLoading = true;
    this.exchangeRateService.getConversion("JPY", "USD", 1).subscribe((response: any) => {
      if (response.result === "success") {
        this.isLoading = false;
        this.JPY_to_USD = response.conversion_result
        this.localStorageService.setItem("JPY_to_USD", this.JPY_to_USD.toString());
      } else {
        this.isLoading = false;
        this.showErrorMsg();
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.showErrorMsg();
    })
  }

  getConversionFromYenToDollar() {
    this.isLoading = true;
    this.exchangeRateService.getConversion("USD", "JPY", 1).subscribe((response: any) => {
      if (response.result === "success") {
        this.isLoading = false;
        this.USD_to_JPY = response.conversion_result
        this.localStorageService.setItem("USD_to_JPY", this.USD_to_JPY.toString())
      } else {
        this.isLoading = false;
        this.showErrorMsg();
      }
    }, (err) => {
      this.isLoading = false;
      console.log(err);
      this.showErrorMsg();
    })
  }

  getConversionFromYenToColon() {
    this.isLoading = true;
    this.exchangeRateService.getConversion("JPY", "CRC", 1).subscribe((response: any) => {
      if (response.result === "success") {
        this.isLoading = false;
        this.JPY_to_CRC = response.conversion_result
        this.localStorageService.setItem("JPY_to_CRC", this.JPY_to_CRC.toString())
      } else {
        this.isLoading = false;
        this.showErrorMsg();
      }
    }, (err) => {
      this.isLoading = false;
      console.log(err);
      this.showErrorMsg();
    })
  }

  getConversionFromColonToYen() {
    this.isLoading = true;
    this.exchangeRateService.getConversion("CRC", "JPY", 1).subscribe((response: any) => {
      if (response.result === "success") {
        this.isLoading = false;
        this.CRC_to_JPY = response.conversion_result
        this.localStorageService.setItem("CRC_to_JPY", this.CRC_to_JPY.toString())
      } else {
        this.isLoading = false;
        this.showErrorMsg();
      }
    }, (err) => {
      this.isLoading = false;
      console.log(err);
      this.showErrorMsg();
    })
  }

}
