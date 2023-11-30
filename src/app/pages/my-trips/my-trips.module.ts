import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyTripsPage } from './my-trips.page';

import { MyTripsPageRoutingModule } from './my-trips-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MyTripsPageRoutingModule
  ],
  declarations: [MyTripsPage]
})
export class MyTripsPageModule {}
