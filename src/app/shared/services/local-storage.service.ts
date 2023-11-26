import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(key: string){
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string){
    localStorage.setItem(key, value);
  }

  removeItem(key: string){
    localStorage.removeItem(key);
  }

  updateItem(key:string, value: string){
    localStorage.setItem(key, value);
  }

  getTrip(id: number){
    let tripList = this.getItem("trips");
    if(tripList){
      let list = JSON.parse(tripList) as Array<any>;
      let trip = list.find((t) => t.id == id);
      return trip;
      
    }
  }



}
