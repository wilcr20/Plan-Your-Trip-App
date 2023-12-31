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

  itemEdited: any;

  isActivityDescriptionRequired = false;
  isURlTitleRequired = false;
  isURLRequired = false;
  isNoteValueRequired = false;


  activityDescription: string | undefined;
  estimatedTime: string | undefined;
  localization: string | undefined;
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
    if(!this.dayTrip.activities){
      this.dayTrip.activities = [];
    }
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
    let idx = this.getTripIndex(this.dayTrip.fullDate);
    if(!this.dayTrip.urls){
      this.dayTrip.urls = [];
    }
    this.dayTrip.urls.push(url);
    this.trip.daysForTrip[idx] = this.dayTrip;
    this.localStorageService.updateTrip(this.trip);
    Swal.fire({
      icon: 'success',
      text: 'Link agregado!!',
      heightAuto: false,
    });
    this.trip = this.localStorageService.getTrip(this.tripId);
    this.reset();
  }

  createNote() {
    this.isNoteValueRequired = false;
    if (!this.noteValue || this.noteValue.trim() == "") {
      this.isNoteValueRequired = true
      return;
    }
    let note = {
      value: this.noteValue,
      id: new Date().getTime()
    }
    let idx = this.getTripIndex(this.dayTrip.fullDate);
    if(!this.dayTrip.notes){
      this.dayTrip.notes = [];
    }
    this.dayTrip.notes.push(note);
    this.trip.daysForTrip[idx] = this.dayTrip;
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
    this.urlTitle = "";
    this.urlValue = "";
    this.noteValue = "";
  }

  redirectToUrl(url: string) {
    window.open(url, "_blank");
  }

  async openItemMenu(item: any, idx: number, total: number, canMove: boolean) {

    let buttonsToUse = [
      {
        text: 'Editar',
        cssClass: 'blackOption',
        handler: () => {
          this.showEditItemView(item)
        }
      },
      {
        text: 'Eliminar',
        cssClass: 'redOption',
        handler: () => {
          this.deleteItem(item.id);
        }
      }
    ];

    if (idx > 0 && total > idx && canMove) {
      buttonsToUse.push(
        {
          text: 'Mover hacia arriba',
          cssClass: 'blueOption',
          handler: () => {
            this.moveActivityPosition(item.id, idx, idx - 1);
          }
        }
      );
    }
    if (idx + 1 < total && canMove) {
      buttonsToUse.push(
        {
          text: 'Mover hacia abajo',
          cssClass: 'blueOption',
          handler: () => {
            this.moveActivityPosition(item.id, idx, idx + 1);
          }
        }
      );
    }
    const alert = await this.alertCtrl.create({
      message: '¿Qué acción desea realizar?',
      mode: 'ios',
      buttons: buttonsToUse,
    });
    await alert.present();
  }

  moveActivityPosition(id: any, oldPosition: number, newPosition: number) {
    let a = this.dayTrip.activities[oldPosition];
    let b = this.dayTrip.activities[newPosition];
    this.dayTrip.activities[oldPosition] = b;
    this.dayTrip.activities[newPosition] = a;

    let dayForTripIdx = this.getTripIndex(this.dayTrip.fullDate);
    this.trip.daysForTrip[dayForTripIdx].activities = this.dayTrip.activities
    this.localStorageService.updateTrip(this.trip);
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
      let tripIndex = this.getTripIndex(this.dayTrip.fullDate);
      this.dayTrip.urls = this.dayTrip.urls.filter((t: { id: any; }) => t.id != id)
      this.trip.daysForTrip[tripIndex] = this.dayTrip;
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
      let tripIndex = this.getTripIndex(this.dayTrip.fullDate);
      this.dayTrip.notes = this.dayTrip.notes.filter((t: { id: any; }) => t.id != id)
      this.trip.daysForTrip[tripIndex] = this.dayTrip;
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

  showEditItemView(item: any) {
    this.isEditView = true;
    if (this.tabSelected == 1) {

      let activityIdx = this.dayTrip.activities.findIndex((act: { id: any; }) => act.id == item.id)
      this.itemEdited = this.dayTrip.activities[activityIdx];
      this.activityDescription = this.itemEdited.description;
      this.estimatedTime = this.itemEdited.estimatedTime;
      this.localization = this.itemEdited.localization;
    }
    else if (this.tabSelected == 2) {
      let urlIdx = this.dayTrip.urls.findIndex((act: { id: any; }) => act.id == item.id)
      this.itemEdited = this.dayTrip.urls[urlIdx];
      this.urlTitle = this.itemEdited.title;
      this.urlValue = this.itemEdited.url;
    }
    else if (this.tabSelected == 3) {
      let noteIdx = this.dayTrip.notes.findIndex((act: { id: any; }) => act.id == item.id)
      this.itemEdited = this.dayTrip.notes[noteIdx];
      this.noteValue = item.value;
    }
  }


  editNote() {
    this.isNoteValueRequired = false;
    if (!this.noteValue || this.noteValue.trim() == "") {
      this.isNoteValueRequired = true
      return;
    }
    this.itemEdited.value = this.noteValue;

    let dayForTripIdx = this.getTripIndex(this.dayTrip.fullDate);
    let noteIdx = this.dayTrip.notes.findIndex((act: { id: any; }) => act.id == this.itemEdited.id)
    this.trip.daysForTrip[dayForTripIdx].notes[noteIdx] = this.itemEdited;
    this.localStorageService.updateTrip(this.trip);

    Swal.fire({
      icon: 'success',
      text: 'Nota editada!!',
      heightAuto: false,
    });
    this.trip = this.localStorageService.getTrip(this.tripId);
    this.reset();
  }

  editUrl() {
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

    this.itemEdited.title = this.urlTitle;
    this.itemEdited.url = this.urlValue;

    let dayForTripIdx = this.getTripIndex(this.dayTrip.fullDate);
    let urlIdx = this.dayTrip.urls.findIndex((url: { id: any; }) => url.id == this.itemEdited.id);
    this.trip.daysForTrip[dayForTripIdx].urls[urlIdx] = this.itemEdited;
    this.localStorageService.updateTrip(this.trip);
    Swal.fire({
      icon: 'success',
      text: 'Link editado!!',
      heightAuto: false,
    });
    this.trip = this.localStorageService.getTrip(this.tripId);
    this.reset();
  }

  editActivity() {
    this.isActivityDescriptionRequired = false;
    if (!this.activityDescription || this.activityDescription.trim() == "") {
      this.isActivityDescriptionRequired = true
      return;
    }

    this.itemEdited.description = this.activityDescription;
    this.itemEdited.estimatedTime = this.estimatedTime;
    this.itemEdited.localization = this.localization;

    let dayForTripIdx = this.getTripIndex(this.dayTrip.fullDate);
    let activityIdx = this.dayTrip.activities.findIndex((act: { id: any; }) => act.id == this.itemEdited.id)

    this.trip.daysForTrip[dayForTripIdx].activities[activityIdx] = this.itemEdited;
    this.localStorageService.updateTrip(this.trip);
    Swal.fire({
      icon: 'success',
      text: 'Actividad editada!!',
      heightAuto: false,
    });
    this.trip = this.localStorageService.getTrip(this.tripId);
    this.reset();
  }

}
