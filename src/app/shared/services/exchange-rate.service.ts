import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  constructor(public httpClient: HttpClient) { }

  getConversion(from: string , to: string, amount: number){
    let url = `${environment.apiForExchangeRate}${environment.apiKey}/pair/${from}/${to}/${amount}`;
    return this.httpClient.get(url);
  }
}
