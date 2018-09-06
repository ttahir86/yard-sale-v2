import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { IonPullUpFooterState } from '../../../node_modules/ionic-pullup';
import { CreateYardSalePage } from '../create-yard-sale/create-yard-sale';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Http } from '../../../node_modules/@angular/http';






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
  sales: any[] = [];
  closestSales: any;
  newlyAddedYardSale: any = false;

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
  public user: any = {
    lat: 5,
    lng: 5,
    zoom: this.ZOOM_LEVEL
  };

  mapIcon: any = {
    0:  {  
      url: './assets/imgs/yard-sale-pin.gif',
      scaledSize: {
      height: 30,
      width: 30},
    },
  };

  public svcOptions: {} = { position: 0}


  constructor(public navCtrl: NavController, public navParams: NavParams,
     private geolocation: Geolocation, 
     private modalCtrl: ModalController,
     private uniqueDeviceID: UniqueDeviceID,
    private http: Http) { 
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
    modalPage.onDidDismiss(returndata => {
    
      try{
        console.log(returndata);
        this.newlyAddedYardSale = JSON.parse(returndata);
        this.sales.push(
          {
            latitude : this.newlyAddedYardSale.latitude, 
            longitude: this.newlyAddedYardSale.longitude, 
            title: '', 
            distance: 0.0
          })

      }catch(error){
        console.log(error)
      }
    });
    modalPage.present();
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

    this.findSales();
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




  findSales(){
    var link = 'https://talaltahir.com/local-messages-api/find-sales.php';
    var userGeoData = JSON.stringify
    (
      {
        lat: this.user.lat,
        lng: this.user.lng,
        maxDistance: this.MAX_DISTANCE_TO_SEARCH,
      }
    );
  
    this.http.post(link, userGeoData).subscribe(data => {
      try {
        console.log(data["_body"]);
        this.closestSales = JSON.parse(data["_body"]);
      } catch (error) {
        console.log(data);
      }
      
      for (let i in this.closestSales ) {
        var lat =  Number(this.closestSales[i].latitude)
        var lng =  Number(this.closestSales[i].longitude)
 
        let d = Number(this.closestSales[i].distance).toFixed(2);
        this.sales.push({latitude:lat, longitude: lng, title: this.closestSales[i].title, distance: d})
     }
    }, error => {
      console.log(error);
    });
  }


}