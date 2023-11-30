import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'my-trips',
        loadChildren: () => import('../my-trips/my-trips.module').then(m => m.MyTripsPageModule)
      },
      {
        path: 'exchange-rate',
        loadChildren: () => import('../exchange-rate/exchange-rate.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'create-trip',
        loadChildren: () => import('../create-trip/create-trip.module').then(m => m.CreateTripPageModule)
      },
      {
        path: 'trip-info/:id',
        loadChildren: () => import('../trip-info/trip-info.module').then(m => m.TripInfoPageModule)
      },
      {
        path:'activities/:tripId/:fullDate/:dayState',
        loadChildren: () => import('../activities/activities.module').then(m => m.ActivitiesPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/my-trips',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/my-trips',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
