import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest'

/**
 * Generated class for the RinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-rinfo',
  templateUrl: 'rinfo.html',
})
export class RinfoPage {

  /*ringkasaninfo = { "username": "", "token": "", "proyek_id" : "" };
  userDetails: any;
  responseData: any;*/
  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider) {    
    const area_info = JSON.parse(localStorage.getItem('tindakan'));    
    console.log(area_info["area_info"]);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RinfoPage');
    /*this.rest.restPost(this.mapData, "maps/welcome/get_maps_info").then((result) => {
      this.responseData = result;
      console.log(this.responseData)
            });*/
  }

}
