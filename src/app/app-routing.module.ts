import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'create-trip',
    loadChildren: () => import('./pages/create-trip/create-trip.module').then( m => m.CreateTripPageModule)
  },
  {
    path: 'trip-info',
    loadChildren: () => import('./pages/trip-info/trip-info.module').then( m => m.TripInfoPageModule)
  },
  {
    path: 'activities',
    loadChildren: () => import('./pages/activities/activities.module').then( m => m.ActivitiesPageModule)
  },
  {
    path: 'report/:id',
    loadChildren: () => import('./pages/report/report.module').then( m => m.ReportPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
