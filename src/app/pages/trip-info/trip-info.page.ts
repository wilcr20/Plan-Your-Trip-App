import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import Swal from 'sweetalert2';


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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,

  ) { 
    this.today = new Date();
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params: { [x: string]: any; }) => {
      let id = params['id'];
      this.trip = this.localStorageService.getTrip(id);     
    })
  }

  getDayState(dayTrip: any){
    // 1 = Today, 2 = Previous days, 3 = Next days
    this.today.setHours(0, 0, 0, 0);
    let dateObjectbyTripDay = new Date(dayTrip.fullDate);
    dateObjectbyTripDay.setHours(0, 0, 0, 0);
   
    if(dateObjectbyTripDay.getTime() == this.today.getTime()){     
      return 1
    }else if(dateObjectbyTripDay.getTime() < this.today.getTime()){
      return 2
    }else if(dateObjectbyTripDay.getTime() > this.today.getTime()){
      return 3
    }
    return 0
    
  }

  redirectToActivitiesByDayView(dayItem: any, dayState: number){   
    this.router.navigate(['tabs/activities', this.trip.id, dayItem.fullDate, dayState ]);
  }


  encode(data: any ) {
    const bytes = new TextEncoder().encode(data);
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString);
  }

  async shareTrip(){
    let tripToShare = this.encode(JSON.stringify(this.trip))   
  
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(tripToShare);
        Swal.fire({
          icon: 'success',
          text: 'Código del viaje copaido correctamente',
          heightAuto: false,
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          text: 'Ocurrió un error al copiar el código.',
          heightAuto: false,
        });
      }
    }
  }

  redirectToReportPage(){
    this.router.navigate(['report', this.trip.id]);
  }

}


