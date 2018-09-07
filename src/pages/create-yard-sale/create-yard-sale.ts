import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '../../../node_modules/@angular/http';


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
  isSubmitButtonDisabled : boolean = false;
  btnKeepDisabling : boolean = true;
  dateStyle = "date-selected";
  selectedDateId: any = false;
  user: { lat: string, lng: string, username: string } = { lat: '', lng: '', username: ''};
  selectedTime: any;
  selectedDate: any;
  postYardSaleData: any;
  

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


  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private viewCtrl: ViewController, 
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private http: Http) {
    this.selectedRadioButton = "Now";
  }

  ionViewDidLoad() {
    this.getFutureDates();
    console.log(this.navParams.get('user'));
    this.user = this.navParams.get('user');
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

  public onDateClick(id){
    this.selectedDateId = id;    
    this.showTime = true;

    if (this.selectedRadioButton === "Future" && this.btnKeepDisabling ===  true){
      this.isSubmitButtonDisabled = true;
    }

  }

  public onTimePickerChange(){
    console.log('datepicker change')
    this.isSubmitButtonDisabled = false;
    this.btnKeepDisabling = false;
    
  }


  private closeModal() {


    this.viewCtrl.dismiss(this.postYardSaleData);
  }

  public createYardSale(){

    this.presentConfirm();


  }

  public onRadioButtonClick(isFutureSelected: boolean){
    this.isFutureSelected = isFutureSelected;
 
    
    if (this.selectedRadioButton ==="Now"){
      this.isSubmitButtonDisabled = false;
    }else if (this.selectedRadioButton === "Future" && this.btnKeepDisabling ===  true){
      this.isSubmitButtonDisabled = true;
    }
  }


  private presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm WhaleSale',
      message: 'Once your WhaleSale begins, you can stop it at anytime right from the home screen. Each WhaleSale posting will be automatically closed after 24hrs from the start. But don\'t worry, you can start as many you want!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Got it!',
          handler: () => {
            console.log('Start clicked');
            this.postYardSale();
           
          }
        }
      ]
    });
    alert.present();
  }
  presentLoadingSpinner() {
    let spinner = this.loadingCtrl.create({
      content: 'Creating WhaleSale...'
    });
  
    spinner.present();

  
    setTimeout(() => {
      spinner.dismiss();
    }, 3000);

  }
  presentToastSuccess() {
    let toast = this.toastCtrl.create({
      message: 'Your WhaleSale was created successfully!',
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  presentToastFailure() {
    let toast = this.toastCtrl.create({
      message: 'Something went wrong! Sorry...',
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  private getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  private postYardSale(){
    // this.presentLoadingSpinner();
    console.log('start')

    if (this.selectedRadioButton === 'Future'){
      console.log(this.selectedTime);
      this.selectedTime = this.selectedTime + ':00'

      let numericalMonth = this.getKeyByValue(this.monthDict, this.futureDates[this.selectedDateId]['month'] )
      console.log(numericalMonth);
      this.selectedDate = this.futureDates[this.selectedDateId]['year'] + "-" + numericalMonth + "-" + this.futureDates[this.selectedDateId]['date'];
    }else{
      let today: any = new Date();
      let dd: any  = today.getDate();
      let mm: any = today.getMonth()+1; //January is 0!
      let yyyy = today.getFullYear();

      dd = dd < 10 ? '0' + dd : dd;
      mm = mm < 10 ? '0' + mm : mm;

      this.selectedDate = yyyy + '-' + mm + '-' + dd

      let hh = today.getHours();
      let min = today.getMinutes();
      let ss = today.getSeconds();

      min = min < 10 ? '0' + min : min;
      ss = ss < 10 ? '0' + ss : ss;

      

      this.selectedTime = hh + ":" + min + ":" + ss


    }
    console.log(this.selectedDate);
    console.log(this.selectedTime);
    var link = 'https://talaltahir.com/local-messages-api/create-whale-sale.php';

    this.postYardSaleData = 
      {
        "lat": this.user.lat,
        "lng": this.user.lng,
        "startDate": this.selectedDate,
        "startTime": this.selectedTime,
        "username": this.user.username
      }


    this.http.post(link, this.postYardSaleData).subscribe(data => {
      try {
        let response = JSON.parse(data["_body"]);
        console.log(response);

        this.presentLoadingSpinner();
        setTimeout(() => {
          this.presentToastSuccess();
        }, 3000);
        
        
        this.closeModal();
      } catch (error) {
        console.log(data);
        console.log(error);
        this.presentToastFailure();

       
      }
    }, error => {
      this.presentToastFailure();
      console.log(error);
    });
  }

  

}
