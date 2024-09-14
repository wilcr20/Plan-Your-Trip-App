import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(key: string) {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  updateItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getTrip(id: number) {
    let tripList = this.getItem("trips");
    if (tripList) {
      let list = JSON.parse(tripList) as Array<any>;
      let trip = list.find((t) => t.id == id);
      return trip;
    }
  }

  updateTrip(trip: any) {
    let tripsSaved = this.getItem("trips");
    if (tripsSaved) {
      let trips = JSON.parse(tripsSaved);
      let idx = this.getTripIndex(trips, trip.id);
      trips[idx] = trip;
      this.updateItem("trips", JSON.stringify(trips))
    }
  }

  getTripIndex(trips: any, id: any) {
    let index = -1;
    trips.find(function (item: any, i: any) {
      if (item.id === id) {
        index = i;
      }
    });
    return index;
  }

  getActivityIndexByTrip(tripIndex: any) {
    let index = -1;
    let tripsSaved = this.getItem("trips");
    if (tripsSaved) {
      let trips = JSON.parse(tripsSaved);
      trips[tripIndex].daysForTrip.find(function (item: any, i: any) {
      });
      return index;
    }
    return undefined;
  }

  removeTrip(id: number){
    let tripsSaved = this.getItem("trips");
    if (tripsSaved) {
      let trips = JSON.parse(tripsSaved) as Array<any>;
      trips = trips.filter( trip => trip.id != id);
      this.updateItem("trips", JSON.stringify(trips))
    }
  }

}
