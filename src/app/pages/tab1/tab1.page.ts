import { Component } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  trips: any = [];

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}
  
  ionViewWillEnter(){
    let tripsSaved = this.localStorageService.getItem("trips");
    if(tripsSaved){
      this.trips = JSON.parse(tripsSaved);
    }
  }

  redirectToCreateTripView(){
    this.router.navigateByUrl("tabs/create-trip");
  }

  

}
