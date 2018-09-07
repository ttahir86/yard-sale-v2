import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Slides } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { IonPullUpFooterState } from '../../../node_modules/ionic-pullup';
import { CreateYardSalePage } from '../create-yard-sale/create-yard-sale';
import { Storage } from '@ionic/storage';
import { Http } from '../../../node_modules/@angular/http';
import { GoogleMapsAPIWrapper } from '@agm/core';







@Component({
  selector: 'page-leaflet',
  templateUrl: 'home.html',

})
export class HomePage {
  gmap: any;
  ZOOM_LEVEL = 11;
  RADIUS = 10;
  MAX_DISTANCE_TO_SEARCH = 6;//miles
  footerState: IonPullUpFooterState;
  isUsersLocationLoaded: boolean = false;
  sales: any[] = [];
  closestSales: any;
  newlyAddedYardSale: any = false;
  isAddYardSaleButtonDisabled: boolean = true;
  bDoesUserExist = false;
  username: any = false;
  usersSale: any = false;
  bDoesUserHaveActiveSale: any = false;
  @ViewChild(Slides) slides: Slides;

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
    zoom: this.ZOOM_LEVEL,
    username: false
  };

  mapIcon: any = {
    0: {
      url: './assets/imgs/yard-sale-pin.gif',
      scaledSize: {
        height: 30,
        width: 30
      },
    },
  };

  public svcOptions: {} = { position: 0 }


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private geolocation: Geolocation,
    private modalCtrl: ModalController,
    private http: Http,
    private storage: Storage,
    private gMaps: GoogleMapsAPIWrapper) {
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  deleteStorageKey(key) {
    this.storage.remove(key).then(() => { })
  }
  protected mapReady(map) {
    this.gmap = map;
  }

  public markerClicked = (markerObj) => {
    if (this.map)
      this.gmap.setCenter({ lat: markerObj.latitude, lng: markerObj.longitude });
    console.log('clicked', markerObj, { lat: markerObj.latitude, lng: markerObj.longitude });
  }
  slideChanged (){
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
    if (currentIndex >= this.sales.length){
      currentIndex = this.sales.length - 1
    }
    console.log(this.sales[currentIndex])
    this.centerMap(this.sales[currentIndex])
  }

  centerMap(sale){
    if (this.map)
      this.gmap.panTo({ lat: sale.latitude, lng: sale.longitude });
  }
  ionViewDidLoad() {
    // this.deleteStorageKey("username");
    let key = "username";
    this.storage.get(key).then((name) => {
      console.log('get callback: ' + name);


      this.bDoesUserExist = name == null ? false : true;
      if (!this.bDoesUserExist) {
        console.log('making new user')
        this.makeNewUser();
      } else {
        name = name.replace(/['"]+/g, '').replace(/[\r\n]/g, "");
        this.username = name;
        this.storage.set(key, this.username)
        this.user['username'] = this.username;
        this.bDoesUserExist = true;
        console.log('running rindIfUserHasAc')
        this.findIfUserHasActiveYardSale(name);
      }

    });



    this.RADIUS = (1609.34 * this.MAX_DISTANCE_TO_SEARCH)

    this.getUsersLocation();

  }

  makeNewUser() {
    var link = 'https://talaltahir.com/local-messages-api/make-new-user.php';
    let key = "username";
    this.http.post(link, {}).subscribe(data => {
      try {



        this.username = data["_body"].replace(/['"]+/g, '').replace(/[\r\n]/g, "");;
        this.storage.set(key, this.username)
        this.user['username'] = this.username;
        this.bDoesUserExist = true;
        console.log(this.username);
        console.log("this.bDoesUserExist : " + this.bDoesUserExist)
        this.bDoesUserExist = true;


      } catch (error) {
        console.log(data);
        console.log(error);


      }
    }, error => {
      console.log(error);
    });
  }

  createYardSale() {
    console.log('open modal start')
    this.openModal();
    console.log('open modal end')
  }

  openModal() {
    var data = { "user": this.user };
    var modalPage = this.modalCtrl.create('CreateYardSalePage', data);
    modalPage.onDidDismiss(returndata => {

      try {
        console.log(returndata);
        this.newlyAddedYardSale = returndata;
        this.sales.push(
          {
            latitude: this.newlyAddedYardSale.latitude,
            longitude: this.newlyAddedYardSale.longitude,
            title: '',
            distance: 0.0
          })

      } catch (error) {
        console.log(returndata);
        console.log(error)
      }
    });
    modalPage.present();
  }

  openModalEdit() {
    var data = { "user": this.user };
    var modalPage = this.modalCtrl.create('EditYardSalePage', data);
    modalPage.onDidDismiss(returndata => {

      try {
        console.log(returndata);
      
        this.bDoesUserHaveActiveSale = false;

      } catch (error) {
        console.log(error)
      }
    });
    modalPage.present();
  }



  getUsersLocation() {
    this.isAddYardSaleButtonDisabled = true;
    console.log('geocallback')
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
    console.log('geocallback')
    this.map = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      zoom: this.ZOOM_LEVEL
    }

    this.user = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      radius: this.RADIUS,
      username: this.username
    }

    this.isUsersLocationLoaded = true;
    this.isAddYardSaleButtonDisabled = false;
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

  findIfUserHasActiveYardSale(username) {
    console.log("findIfUserHasActiveYardSale: " + username)
    let link = 'https://talaltahir.com/local-messages-api/find-sales-by-username.php';
    let userData =
    {
      username: this.user.username
    }

    console.log("post data:")
    console.log(userData)
    this.http.post(link, userData).subscribe(data => {
      try {
        // console.log(data["_body"]);
        this.usersSale = data["_body"].replace(/[\r\n]/g, "");
        console.log("usersSale: " + this.usersSale);
        console.log(this.usersSale);
        this.bDoesUserHaveActiveSale = this.usersSale == "\"{status : false}\"" ? false : true;
        console.log("this.bDoesUserHaveActiveSale: " + this.bDoesUserHaveActiveSale);
        if (this.bDoesUserHaveActiveSale) {
          this.usersSale = JSON.parse(this.usersSale);
          console.log(this.usersSale);
        }
      } catch (error) {
        console.log(error)
        console.log(data);
        console.log("usersSale: " + this.usersSale);
        this.bDoesUserHaveActiveSale = false;
        console.log("this.bDoesUserHaveActiveSale: " + this.bDoesUserHaveActiveSale);
      }

    }, error => {
      console.log(error);
    });
  }





  findSales() {
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
        // console.log(data["_body"]);
        this.closestSales = JSON.parse(data["_body"]);
      } catch (error) {
        console.log(data);
      }

      for (let i in this.closestSales) {
        var lat = Number(this.closestSales[i].latitude)
        var lng = Number(this.closestSales[i].longitude)

        let d = Number(this.closestSales[i].distance).toFixed(2);
        this.sales.push({ latitude: lat, longitude: lng, title: this.closestSales[i].title, distance: d })
      }
    }, error => {
      console.log(error);
    });
  }


}