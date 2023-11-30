import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTripsPage } from './my-trips.page';

const routes: Routes = [
  {
    path: '',
    component: MyTripsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTripsPageRoutingModule {}
