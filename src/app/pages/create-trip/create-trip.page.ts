import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.page.html',
  styleUrls: ['./create-trip.page.scss'],
})
export class CreateTripPage implements OnInit {
  isSubmitted = false;
  name: string | undefined;
  description: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;

  isNameRequired = false;
  isStartDateRequired = false;
  isEndDateRequired = false;
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {
  }

  ionViewWillEnter() {
    this.name = undefined;
    this.description = undefined;
    this.startDate = undefined;
    this.endDate = undefined;
  }

  ngOnInit() {
  }

  createTrip() {
    this.isNameRequired = false;
    this.isEndDateRequired = false;
    this.isStartDateRequired = false;
    if (!this.name || this.name.trim() == "") {
      this.isNameRequired = true;
      return;
    }

    if (!this.startDate) {
      this.isStartDateRequired = true;
      return;
    }
    if (!this.endDate) {
      this.isEndDateRequired = true;
      return;
    }

    let trip = {
      name: this.name,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      daysForTrip: this.generateDaysForTrip(),
      id: new Date().getTime()
    }

    let tripList = this.localStorageService.getItem("trips");
    if (!tripList) {
      let tripList = [trip]
      this.localStorageService.setItem("trips", JSON.stringify(tripList))
    } else {
      let listParsed = JSON.parse(tripList);
      listParsed.push(trip);
      this.localStorageService.updateItem("trips", JSON.stringify(listParsed))
    }

    this.redirectToHomePage();

  }

  redirectToHomePage() {
    this.router.navigateByUrl("tabs/my-trips");

  }

  generateDaysForTrip() {
    let daysGenerated: any = [];
    if (this.startDate && this.endDate) {
      let firsDay = new Date(this.startDate);
      firsDay.setHours(0, 0, 0, 0);
      firsDay.setDate(firsDay.getDate() + 1);

      let lastDay = new Date(this.endDate);
      lastDay.setHours(0, 0, 0, 0);
      lastDay.setDate(lastDay.getDate() + 1);

      while (firsDay <= lastDay) {       
        daysGenerated.push({
          display: this.getDayValue(firsDay.getDay()) + " " + firsDay.getUTCDate() + " de " + this.getMonthValue(firsDay.getMonth()) +" del "+ firsDay.getUTCFullYear(),
          activities: [],
          fullDate : `${firsDay.getMonth()+1}-${firsDay.getUTCDate()}-${firsDay.getFullYear()}`
        })
        firsDay.setDate(firsDay.getDate() + 1);
      }
    }   
    return daysGenerated;
  }


  getDayValue(idx: number) {
    switch (idx) {
      case 0:
        return "Domingo"
      case 1:
        return "Lunes"
      case 2:
        return "Martes"
      case 3:
        return "Miércoles"
      case 4:
        return "Jueves"
      case 5:
        return "Viernes"
      case 6:
        return "Sábado"
      default:
        return ""
    }
  }

  getMonthValue(idx: number) {
    switch (idx) {
      case 0:
        return "Enero";
      case 1:
        return "Febrero";
      case 2:
        return "Marzo";
      case 3:
        return "Abril";
      case 4:
        return "Mayo";
      case 5:
        return "Junio";
      case 6:
        return "Julio";
      case 7:
        return "Agosto";
      case 8:
        return "Septiembre";
      case 9:
        return "Octubre";
      case 10:
        return "Noviembre";
      case 11:
        return "Diciembre";
      default:
        return "";
    }
  }



}
