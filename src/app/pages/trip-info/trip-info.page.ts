import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-trip-info',
  templateUrl: './trip-info.page.html',
  styleUrls: ['./trip-info.page.scss'],
})
export class TripInfoPage implements OnInit {
  private sub: any;
  trip: any;
  today: Date;
  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,

  ) { 
    this.today = new Date();

  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params: { [x: string]: any; }) => {
      let id = params['id'];
      this.trip = this.localStorageService.getTrip(id);
      console.log(this.trip);
      
    })
  }

  getDayState(dayTrip: any){
    // 1 = Today, 2 = Previous days, 3 = Next days
    this.today.setHours(0, 0, 0, 0);
    let dateObjectbyTripDay = new Date(dayTrip.fullDate);
    dateObjectbyTripDay.setHours(0, 0, 0, 0);
   
    if(dateObjectbyTripDay.getTime() == this.today.getTime()){     
      return 1
    }else if(dateObjectbyTripDay.getTime() > this.today.getTime()){
      return 2
    }else if(dateObjectbyTripDay.getTime() < this.today.getTime()){
      return 3
    }
    return 0
    
  }

}
