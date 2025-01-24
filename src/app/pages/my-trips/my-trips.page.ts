import { Component } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-trips',
  templateUrl: 'my-trips.page.html',
  styleUrls: ['my-trips.page.scss']
})
export class MyTripsPage {
  trips: any = [];
  nationalTimeCR = "";
  nationalDateCR = "";
  timeUpdate: any;
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
  ) { }

  ionViewWillEnter() {
    clearInterval(this.timeUpdate);
    // this.timeUpdate = setInterval(() => {
    //   let today = new Date().toISOString();
    //   this.nationalDateCR = today.split("T")[0];
    //   this.nationalTimeCR = today.split("T")[1].split(".")[0];
    // }, 1000);

    let tripsSaved = this.localStorageService.getItem("trips");
    if (tripsSaved) {
      // Just added to hide existing trip
      this.trips = JSON.parse(tripsSaved).reverse();
    }
  }

  redirectToCreateTripView() {
    this.router.navigateByUrl("tabs/create-trip");
  }

  redirectToTripInfoView(id: number) {
    this.router.navigate(['tabs/trip-info', id]);
  }


  decode(base64: any) {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
  }


  enterTripCode() {
    Swal.fire({
      title: "Ingrese el código del viaje",
      input: "text",
      heightAuto: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      showLoaderOnConfirm: true
    }).then((resp) => {
      if (resp.isConfirmed) {
        try {
          let trip = JSON.parse(this.decode(resp.value))
          this.registerTripViaCode(trip);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            text: 'Se ha ingresado un código inválido, intente de nuevo.',
            heightAuto: false,
          });

        }
      }

    })
  }

  registerTripViaCode(trip: any) {
    let tripsSaved = this.localStorageService.getItem("trips");
    if (!tripsSaved) {
      let tripList = [trip]
      this.localStorageService.setItem("trips", JSON.stringify(tripList));
      this.showAlertTripCreated()
    } else {
      let listParsed = JSON.parse(tripsSaved)  as Array<any>;

      let tripInList:any = listParsed.find((t) => t.id == trip.id);
      if(!tripInList){
        listParsed.push(trip);
      }else{
        for (let index = 0; index < listParsed.length; index++) {
          const tripByIndex = listParsed[index];
          if(tripByIndex.id == trip.id){
            listParsed[index] = trip;
          }
        }
      }
      this.localStorageService.updateItem("trips", JSON.stringify(listParsed))
      this.showAlertTripCreated()
    }
  }

  showAlertTripCreated(){
    Swal.fire({
      icon: 'success',
      text: 'Viaje agregado!!',
      heightAuto: false,
    });
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
}