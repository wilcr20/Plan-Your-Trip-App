import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExchangeRatePage } from './exchange-rate.page';

import { ExchangeRatePageRoutingModule } from './exchange-rate-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExchangeRatePageRoutingModule
  ],
  declarations: [ExchangeRatePage]
})
export class Tab2PageModule {}
