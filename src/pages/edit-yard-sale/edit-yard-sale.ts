import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '../../../node_modules/@angular/http';

/**
 * Generated class for the EditYardSalePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-yard-sale',
  templateUrl: 'edit-yard-sale.html',
})
export class EditYardSalePage {

  user: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditYardSalePage');
    console.log(this.navParams.get('user'));
    this.user = this.navParams.get('user');
  }

  private closeModal() {

    this.viewCtrl.dismiss();
  }

  private endSale(){
    let link = "https://talaltahir.com/local-messages-api/delete-whale-sale.php";
    this.http.post(link, {username:this.user['username']}).subscribe(data => {
      try {

        console.log(data["_body"]);

        // this.presentLoadingSpinner();
        // setTimeout(() => {
        //   this.presentToastSuccess();
        // }, 3000);

        this.closeModal();
      } catch (error) {
        console.log(data);
        console.log(error);
        // this.presentToastFailure();


      }
    }, error => {
      // this.presentToastFailure();
      console.log(error);
    });
  }
  

}
