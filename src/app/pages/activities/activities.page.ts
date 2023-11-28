import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {
  private sub: any;
  fullDate: any;
  trip: any;
  dayState: any;
  tripId: any;
  dayTrip: any = [];
  tabSelected = 1;
  isCreateView = true;
  isEditView = false;

  isActivityDescriptionRequired = false;
  isURlTitleRequired = false;
  isURLRequired = false;
  isNoteValueRequired = false;


  activityDescription: string | undefined;
  estimatedTime: string | undefined;
  localization: string | undefined;
  activityId: string | undefined;
  urlTitle: string | undefined;
  urlValue: string | undefined;
  noteValue: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private alertCtrl: AlertController,

  ) {
  }

  ionViewWillEnter() {
    this.tabSelected = 1;
    this.reset()
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params: { [x: string]: any; }) => {
      this.tripId = params['tripId'];
      this.fullDate = params['fullDate'];
      this.dayState = params['dayState'];
      this.trip = this.localStorageService.getTrip(this.tripId);
      this.dayTrip = this.trip.daysForTrip.find((t: { fullDate: any; }) => t.fullDate == this.fullDate);
    });
  }

  selectTab(tabIndex: number) {
    this.tabSelected = tabIndex;
  }

  create() {
    this.isCreateView = true;
  }

  edit() {
    this.isEditView = true;
  }

  createActivity() {
    this.isActivityDescriptionRequired = false;
    if (!this.activityDescription || this.activityDescription.trim() == "") {
      this.isActivityDescriptionRequired = true
      return;
    }
    let activity = {
      description: this.activityDescription,
      estimatedTime: this.estimatedTime,
      localization: this.localization,
      id: new Date().getTime()
    }
    let idx = this.getTripIndex(this.dayTrip.fullDate);
    this.dayTrip.activities.push(activity);
    this.trip.daysForTrip[idx] = this.dayTrip;
    this.localStorageService.updateTrip(this.trip);
    Swal.fire({
      icon: 'success',
      text: 'Actividad agregada!!',
      heightAuto: false,
    });
    this.trip = this.localStorageService.getTrip(this.tripId);
    this.reset();
  }

  createUrl() {
    this.isURlTitleRequired = false;
    this.isURLRequired = false;
    if (!this.urlTitle || this.urlTitle.trim() == "") {
      this.isURlTitleRequired = true
      return;
    }
    if (!this.urlValue || this.urlValue.trim() == "") {
      this.isURLRequired = true
      return;
    }
    let url = {
      title: this.urlTitle,
      url: this.urlValue,
      id: new Date().getTime()
    }
    this.trip.urls.push(url)
    this.localStorageService.updateTrip(this.trip);
    Swal.fire({
      icon: 'success',
      text: 'Link agregado!!',
      heightAuto: false,
    });
    this.trip = this.localStorageService.getTrip(this.tripId);
    this.reset();
  }

  createNote(){
    this.isNoteValueRequired = false;
    if (!this.noteValue || this.noteValue.trim() == "") {
      this.isNoteValueRequired = true
      return;
    }
    let note = {
      value: this.noteValue,
      id: new Date().getTime()
    }
    this.trip.notes.push(note)
    this.localStorageService.updateTrip(this.trip);
    Swal.fire({
      icon: 'success',
      text: 'Nota agregada!!',
      heightAuto: false,
    });
    this.trip = this.localStorageService.getTrip(this.tripId);
    this.reset();
  }

  resetAction() {
    this.isEditView = false;
    this.isCreateView = false;
  }

  getTripIndex(fullDate: string) {
    let index = -1;
    let filteredObj = this.trip.daysForTrip.find(function (item: any, i: any) {
      if (item.fullDate === fullDate) {
        index = i;
      }
    });
    return index;
  }

  reset() {
    this.resetAction();
    this.isActivityDescriptionRequired = false;
    this.isURlTitleRequired = false;
    this.isURLRequired = false;
    this.isNoteValueRequired = false;
    this.activityDescription = "";
    this.estimatedTime = "";
    this.localization = "";
    this.activityId = "";
    this.urlTitle = "";
    this.urlValue = "";
    this.noteValue = "";
  }

  redirectToUrl(url: string) {
    window.open(url, "_blank");
  }

  async openItemMenu(item: any) {
    const alert = await this.alertCtrl.create({
      message: '¿Qué acción desea realizar?',
      mode: 'ios',
      // cssClass: 'alertQR',
      buttons: [
        {
          text: 'Atrás',
          role: 'cancel',
          cssClass: 'blackOption',
          handler: () => {
          }
        },
        {
          text: 'Editar',
          cssClass: 'blackOption',
          handler: () => {
            this.showEditItemView(item.id)
          }
        },
        {
          text: 'Eliminar',
          cssClass: 'redOption',
          handler: () => {
            this.deleteItem(item.id);
          }
        },
      ],
    });
    await alert.present();
  }

  deleteItem(id: any) {    
    if (this.tabSelected == 1) {
      let tripIndex = this.getTripIndex(this.dayTrip.fullDate);
      this.dayTrip.activities = this.dayTrip.activities.filter((t: { id: any; }) => t.id != id)
      this.trip.daysForTrip[tripIndex] = this.dayTrip;
      this.localStorageService.updateTrip(this.trip);
      Swal.fire({
        icon: 'success',
        text: 'Actividad eliminada!!',
        heightAuto: false,
      });
      this.trip = this.localStorageService.getTrip(this.tripId);
      this.resetAction();
    } 
    else if (this.tabSelected == 2) {     
      this.trip.urls = this.trip.urls.filter((t: { id: any; }) => t.id != id)
      this.localStorageService.updateTrip(this.trip);
      Swal.fire({
        icon: 'success',
        text: 'Link eliminado!!',
        heightAuto: false,
      });
      this.trip = this.localStorageService.getTrip(this.tripId);
      this.resetAction();
    }
    else if (this.tabSelected == 3) {     
      this.trip.notes = this.trip.notes.filter((t: { id: any; }) => t.id != id)
      this.localStorageService.updateTrip(this.trip);
      Swal.fire({
        icon: 'success',
        text: 'Nota eliminada!!',
        heightAuto: false,
      });
      this.trip = this.localStorageService.getTrip(this.tripId);
      this.resetAction();
    }

  }

  showEditItemView(id: any) {
    this.activityId = id;
    this.isEditView = true;
  }

  editItem(id: any) {
    let tripIndex = this.getTripIndex(this.dayTrip.fullDate);
    this.dayTrip.activities = this.dayTrip.activities.filter((t: { id: any; }) => t.id != id)
    this.trip.daysForTrip[tripIndex] = this.dayTrip;
    this.localStorageService.updateTrip(this.trip);
    Swal.fire({
      icon: 'success',
      text: 'Actividad eliminada!!',
      heightAuto: false,
    });
    this.trip = this.localStorageService.getTrip(this.tripId);
    this.resetAction();
  }

}
