import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
  relationship: any = "Today";
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateYardSalePage');
    console.log(this.navParams.get('message'));
    console.log(this.relationship);
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

}
