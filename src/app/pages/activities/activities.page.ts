import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

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
  dayTrip: any = [];
  tabSelected = 1;
  isCreateView = true;
  isEditView = false;

  isActivityDescriptionRequired = false;
  activityDescription: string | undefined;
  estimatedTime: string | undefined;
  localization: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,

  ) {
  }

  ionViewWillEnter(){
    this.reset()

  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params: { [x: string]: any; }) => {
      let tripId = params['tripId'];
      this.fullDate = params['fullDate'];
      this.dayState = params['dayState'];
      this.trip = this.localStorageService.getTrip(tripId);
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
      localization: this.localization
    }
    let idx = this.getTripIndex(this.dayTrip.fullDate);
    this.dayTrip.activities.push(activity);
    this.trip.daysForTrip[idx] = this.dayTrip;
    this.localStorageService.updateTrip(this.trip);
    this.resetAction();
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
    this.activityDescription = "";
    this.estimatedTime = "";
    this.localization = "";
  }

}
