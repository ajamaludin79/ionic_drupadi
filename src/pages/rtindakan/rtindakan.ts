import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RtindakanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-rtindakan',
  templateUrl: 'rtindakan.html',
})
export class RtindakanPage {
  /*rlaporan = { "username": "", "token": "", "proyek_id" : "" };
  userDetails: any;
  responseData: any;*/

  constructor(public navCtrl: NavController, public navParams: NavParams) {    
	const area_info = JSON.parse(localStorage.getItem('tindakan'));    
    console.log(area_info["action_plan"]);    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RtindakanPage');
  }

}
