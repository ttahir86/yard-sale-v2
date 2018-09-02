import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { IonPullUpFooterState } from '../../../node_modules/ionic-pullup';
import { CreateYardSalePage } from '../create-yard-sale/create-yard-sale';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';






@Component({
  selector: 'page-leaflet',
  templateUrl: 'home.html',

})
export class HomePage {
  ZOOM_LEVEL = 11;
  RADIUS = 10;
  MAX_DISTANCE_TO_SEARCH = 6;//miles
  footerState: IonPullUpFooterState;
  isUsersLocationLoaded: boolean = false;

  public labelOptions = {
    color: '#CC0000',
    fontFamily: '',
    fontSize: '10px',
    fontWeight: 'bold',
    text: ' '
  }

  public map: {} = {
    lat: 5,
    lng: 5,
    zoom: this.ZOOM_LEVEL
  }
  public user: {} = {
    lat: 5,
    lng: 5,
    zoom: this.ZOOM_LEVEL
  };

  public svcOptions: {} = { position: 0}


  constructor(public navCtrl: NavController, public navParams: NavParams,
     private geolocation: Geolocation, 
     private modalCtrl: ModalController,
     private uniqueDeviceID: UniqueDeviceID) { 
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  ionViewDidLoad() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => console.log(uuid))
      .catch((error: any) => console.log(error));
    this.RADIUS = (1609.34 * this.MAX_DISTANCE_TO_SEARCH)

    this.getUsersLocation();

  }

  createYardSale(){
    console.log('open modal start')
    this.openModal();
    console.log('open modal end')
  }

  openModal(){
    var data ={"user" : this.user} ;
    var modalPage = this.modalCtrl.create('CreateYardSalePage', data);
    modalPage.present();
  }
  closeModal(){

  }


  getUsersLocation(){

    let GPSoptions = { enableHighAccuracy: true, maximumAge: 0 };
    this.geolocation.getCurrentPosition(GPSoptions)
      .then((position) => {
        this.geolocationCallBack(position)
      })
      .catch((error) => {
        console.log('Error getting location', error);
      },
    );
  }


  geolocationCallBack(pos) {

    this.map = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      zoom: this.ZOOM_LEVEL
    }

    this.user = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      radius: this.RADIUS
    }

    this.isUsersLocationLoaded = true; 
  }






  footerExpanded() {
    console.log('Footer expanded!');
  }

  footerCollapsed() {
    console.log('Footer collapsed!');
  }

  toggleFooter() {
    this.footerState = this.footerState == IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }


}