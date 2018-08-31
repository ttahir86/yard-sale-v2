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
  relationship:   any = "Today";
  startTimeModel: any = "4:00";
  endTimeModel:   any = "4:00";


  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private toastCtrl: ToastController) {
    this.relationship = "Today";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateYardSalePage');
    console.log(this.navParams.get('message'));
    console.log(this.relationship);
  }

  private closeModal() {
    this.viewCtrl.dismiss();
  }

  public createYardSale(){
    this.presentToast();

    this.closeModal();
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
