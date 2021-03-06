import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, ModalController, LoadingController, ToastController  } from 'ionic-angular';
import { OneblokPage } from '../oneblok/oneblok';
import { RestProvider } from '../../providers/rest/rest'
import { ModalPage } from '../modal/modal'


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  userDetails: any;
  responseData: any;
  loading: any
  mapData = { "username": "", "action": "", "token": "", "proyek_id": "" }
  namaproyek: any
  constructor(public navCtrl: NavController, public ngZone: NgZone, public rest: RestProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    const data = JSON.parse(localStorage.getItem('userDrupadi'));
    this.userDetails = data.userData;
    this.mapData.username = this.userDetails.username;
    this.mapData.token = this.userDetails.token;
    this.mapData.action = "ionic_maps";
  }
  ionViewDidLoad() {
    console.log('did load')
    this.loadMap();
  }
  ionViewDidLeave() {
    //console.log('did leave');
  }
  ionViewWillEnter() {
    console.log('will enter');
    this.resizeMap()
    //refresh jika ada perubahan tindakan dan foto
    var tchange = JSON.parse(localStorage.getItem('tchange'));
    var tfoto = JSON.parse(localStorage.getItem('foto'));
    if (tchange == "true" || tfoto != null) {
      localStorage.removeItem('tchange')
      localStorage.removeItem('foto')
      this.loadMap();
    }
  }
  showLoader() {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Loading..',
    });

    this.loading.present();
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: 'top',
      dismissOnPageChange: false,
      showCloseButton: true
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  loadMap() {
    this.showLoader()
    this.rest.restPost(this.mapData, "maps/welcome/ionic_maps").then((result) => {
      this.responseData = result;
      console.log(this.responseData);
      localStorage.setItem('tindakan', JSON.stringify(this.responseData));
      // untuk dikirim ke ringkasasan laporan
      var rpryk = {"pry_name": this.responseData.dtmaps["pry_name"], "pry_id": this.responseData.dtmaps["pry_id"] }
      localStorage.setItem('rpryk', JSON.stringify(rpryk));
      this.namaproyek = this.responseData.dtmaps["pry_name"];
      var centermap = [this.responseData.dtmaps["lat"], this.responseData.dtmaps["long"]] // data server
      let LatLng = new google.maps.LatLng(centermap[0], centermap[1]);

      let mapOptions = {
        center: LatLng,
        zoom: 15,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.SATELLITE
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      var bounds = new google.maps.LatLngBounds();
      var imgl = [this.responseData.dtmaps["imglnorth"], this.responseData.dtmaps["imglsouth"], this.responseData.dtmaps["imgleast"], this.responseData.dtmaps["imglwest"]] //data server
      var boundsImg = new google.maps.LatLngBounds(
        new google.maps.LatLng(imgl[0], imgl[1]), // lat bawah long atas X
        new google.maps.LatLng(imgl[2], imgl[3]), //lat atas long bawah X
      );
      var historicalOverlay = new google.maps.GroundOverlay(
        this.rest.base_url + 'assets/attach/' + this.responseData.dtmaps["org_id"] + '/' + this.responseData.dtmaps["imgpath"],
        boundsImg);
      historicalOverlay.setMap(this.map);
      var polygon = this.responseData.poly;

      // cek polygon
      if ((polygon.length > 0) && (polygon["0"] != '')) {
        var cords = [], areaid = '';
        for (var i = 0; i < polygon.length; i++) {
          var arr = polygon[i].split(" ");
          areaid = this.responseData.area_id[i];
          for (var j = 0; j < arr.length; j++) {
            var point = arr[j].split(",");
            //console.log(point)
            cords.push(new google.maps.LatLng(parseFloat(point[0]), parseFloat(point[1])));
          }
          bounds.extend(cords[cords.length - 1])

          var polygons = (new google.maps.Polygon({
            paths: cords,
            map: this.map,
            strokeColor: 'green',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: 'green',
            fillOpacity: 0.35,
            area_id: areaid
          }));
          var y = this;
          google.maps.event.addListener(polygons, 'click', function() { //alert(this.area_id);
            //google.maps.event.addListener(polygons,'click',  () => {
            y.ngZone.run(() => {
              var x = this.area_id;
              y.blok(x);
            });
          });
          //polygons.setMap(this.map);

          cords = [];
        }
        // polygon bounds
        this.map.fitBounds(bounds);
      } else {
        // image bounds
        this.map.fitBounds(boundsImg);
      }

    }, (err) => {
      this.presentToast("Tidak terhubung ke server");
      this.loading.dismiss();
    });
    this.loading.dismiss();
  }

  // agar setelah navpush peta tidak pecah
  private resizeMap(): void {
    if (this.map) {
      google.maps.event.trigger(this.map, 'resize');
    }
  }
  blok(x) {
    this.navCtrl.push(OneblokPage, {
      area_id: x,
    });
  }
  showModal() {
    // reset
    // show modal
    let modal = this.modalCtrl.create(ModalPage);
    modal.onDidDismiss(data => {
      this.mapData.proyek_id = data;
      if (data != undefined)
      localStorage.removeItem('tindakan')
        this.loadMap();
      //console.log(this.mapData)
    })
    modal.present();
  }
}
