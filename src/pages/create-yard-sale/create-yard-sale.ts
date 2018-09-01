import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

/**
 * Generated class for the CreateYardSalePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-yard-sale',
  templateUrl: 'create-yard-sale.html',
})
export class CreateYardSalePage {
  selectedRadioButton:   any = "Now";
  startTimeModel: any = "4:00";
  endTimeModel:   any = "4:00";
  isFutureSelected: boolean = false;
  showTime:boolean = false;
  currentMonth : string = "";
  

  futureDates : {}[] = [];
  monthDict : {} = 
  {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };


  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private toastCtrl: ToastController) {
    this.selectedRadioButton = "Now";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateYardSalePage');
    this.getFutureDates();
    console.log(this.navParams.get('message'));
  }


  private getFutureDates(){
    let firstDay = new Date(this.getCurrentFullDate());
    let i =0;
    while (i < 7){
      let fulldate: any = new Date(firstDay.getTime() + i * 24 * 60 * 60 * 1000);
      
      let day =  fulldate.getDay();
      let dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      day = dayNames[day];
      day = day.substring(0,3);

      let date =  fulldate.getDate();
      date = date < 10 ? '0' + date : date;

      let month =  fulldate.getMonth() + 1; //January is 0!
      month = month < 10 ? '0' + month : month;
      month = this.monthDict[month];
      this.currentMonth = month

      let year =  fulldate.getFullYear();
      year = year < 10 ? '0' + year : year;

      this.futureDates.push(
        {
          'day' : day,
          'month' : month,
          'date' : date,
          'year' : year

        });

      i++
    }

    return this.futureDates;
    
  }

  private getCurrentFullDate(){
    let today: any = new Date();
    let dd: any  = today.getDate();
    let mm: any = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();

    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;

    today = yyyy + '/' + mm + '/' + dd;
    return today; 
  }

  onDateClick(){
    let selectedDateId = event.srcElement.id;
    console.log(selectedDateId);     
    this.showTime = true;
  }


  private closeModal() {
    this.viewCtrl.dismiss();
  }

  public createYardSale(){
    this.presentToast();
    this.closeModal();
  }

  setFutureRadiobutton(isFutureSelected: boolean){
    this.isFutureSelected = isFutureSelected;
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Yard Sale was created successfully!',
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
