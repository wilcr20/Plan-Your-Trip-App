import { Component } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-trips',
  templateUrl: 'my-trips.page.html',
  styleUrls: ['my-trips.page.scss']
})
export class MyTripsPage {
  trips: any = [];

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {}
  
  ionViewWillEnter(){
    let tripsSaved = this.localStorageService.getItem("trips");
    if(tripsSaved){
      this.trips = JSON.parse(tripsSaved).reverse();
    }
  }

  redirectToCreateTripView(){
    this.router.navigateByUrl("tabs/create-trip");
  }

  redirectToTripInfoView(id: number){
    this.router.navigate(['tabs/trip-info', id ]);
  }

  

}
