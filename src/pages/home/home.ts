import { Component, ViewChild, ElementRef,NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OneblokPage } from '../oneblok/oneblok';
import { RestProvider } from '../../providers/rest/rest'

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map:any;

  constructor(public navCtrl: NavController, public ngZone:NgZone,public rest:RestProvider) {

  }
  ionViewDidLoad(){
    this.loadMap();
  }
blok(){
  this.navCtrl.push(OneblokPage);
}
loadMap(){

  this.rest.PolygonPost({ "action": "mapionic"},"maps/welcome/ionic_maps").then((result) => { 
	//this.responseData = result;	
		
	  var centermap =  [result.dtmaps.lat,result.dtmaps.long] ;// seolah2 data sudah dapat dari server
	  let LatLng = new google.maps.LatLng(centermap[0], centermap[1]);
		
	  let mapOptions = {
		center:LatLng,
		zoom:18,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	  };
		
	  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);  
	  var imgl = [result.dtmaps.imglnorth,result.dtmaps.imglsouth, result.dtmaps.imgleast, result.dtmaps.imglwest] //seolah2 data sudah dapat dari server
	  var bounds = new google.maps.LatLngBounds(
		new google.maps.LatLng( imgl[0], imgl[1] ), // lat bawah long atas X
		new google.maps.LatLng( imgl[2], imgl[3] ), //lat atas long bawah X
		);
		
		var  historicalOverlay = new google.maps.GroundOverlay(
					'http://map.eidaramata.com/assets/attach/'+result.dtmaps.org_id+'/'+result.dtmaps.imgpath,
					bounds);
		  historicalOverlay.setMap(this.map);
		  
		var polygon	= result.poly; 
	//get triangle	
		 var cords 	= []; 
		var str 	= (polygon.toString()).split(" "); 
		
		for (var j=0; j < str.length; j++) { 
			var point = str[j].split(",");
			cords.push(new google.maps.LatLng(parseFloat(point[0]), parseFloat(point[1])));
		}  
		
	//end get triangle	
		/* var triangleCoords = [

		  { lat: -6.892528, lng: 107.544442 },
		  { lat: -6.893012, lng: 107.544445 },
		  { lat: -6.893004, lng: 107.545276 },
		  { lat: -6.892533, lng: 107.545276 },

		];


		var triangleCoords2 = [

		  { lat: -6.893627, lng: 107.54493 },
		  { lat: -6.893622, lng: 107.545643 },
		  { lat: -6.894219, lng: 107.545649 },
		  { lat: -6.894208, lng: 107.544935 },

		]; */

		   var bermudaTriangle = new google.maps.Polygon({
			 paths: cords,
			 strokeColor: '#FF0000',
			 strokeOpacity: 0.8,
			 strokeWeight: 2,
			 fillColor: '#FF0000',
			 fillOpacity: 0.35
		   });
		   bermudaTriangle.setMap(this.map);
		   google.maps.event.addListener(bermudaTriangle,'click', () => {
			 this.ngZone.run(()=>{
			   this.blok()
			 });
			}); 
	}, (err) => {	
		this.loading.dismiss();
		this.presentToast("Tidak terhubung ke server");
	});		
  }
}


