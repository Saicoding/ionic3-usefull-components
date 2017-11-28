import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { CameraProvider } from '../../providers/util/camera.provider';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mytext: string;
  posts = [];

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    private camera: CameraProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public actionsheetCtrl: ActionSheetController,
    public alertCtrl: AlertController
  ) {
    console.log('ok')
  }

  ionViewDidLoad() {
    this.storage.get('myImgs').then((val) => {
      if (val) {
        this.posts = JSON.parse(val);
      } else { 
        let imgs = [
          {
            description: 'Trying out digital painting',
            image: './assets/imgs/b.jpg',
            time: new Date()
          },
          {
            description: '',
            image: './assets/imgs/c.jpg',
            time: new Date()
          },
          {
            description: 'Look at this amazing clay humming bird I crafted!',
            image: './assets/imgs/d.jpg',
            time: new Date()
          },
          {
            description: 'Origami tullip tutorial',
            image: './assets/imgs/e.jpg',
            time: new Date()
          },
          {
            description: '',
            image: './assets/imgs/f.jpg',
            time: new Date()
          },
          {
            description: '',
            image: './assets/imgs/g.jpg',
            time: new Date()
          },
          {
            description: 'Delicious chocolate bread recipe!',
            image: './assets/imgs/h.jpg',
            time: new Date()
          },
          {
            description: '',
            image: './assets/imgs/i.jpg',
            time: new Date()
          },
          {
            description: '',
            image: './assets/imgs/j.jpg',
            time: new Date()
          },
          {
            description: '',
            image: './assets/imgs/k.jpg',
            time: new Date()
          },
          {
            description: 'Fastest car of all times',
            image: './assets/imgs/l.jpg',
            time: new Date()
          },
        ];
        let str = JSON.stringify(imgs);
        this.storage.set('myImgs', str);
        this.storage.get('myImgs').then(val => {
          this.posts = JSON.parse(val);
        })
      }
    })
  }

  add_img() {
    this.creat_actionsheet(this.add_handler);
  }

  add_handler = (from) => {
    const loading = this.loadingCtrl.create();  
    loading.present();
    return from.then(picture => {

      this.showAlert(picture);
      loading.dismiss();
    });
  }

  showAlert(pic) {
    if(pic){

      let alert = this.alertCtrl.create({
        title: '相片描述',
        message: "请填写照片描述",
        inputs: [
          {
            name: 'title',
            placeholder: '相片描述'
          },
        ],
        buttons: [
          {
            text: '取消',
            handler: data => {

            }
          },
          {
            text: '保存',
            handler: data => {
              let img = {
                description: data.title,
                image: pic,
                time: new Date()
                // time: (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString()
              }
              console.log(img.time)
              this.posts.unshift(img);
              let str = JSON.stringify(this.posts);
              this.storage.set('myImgs', str);
            }
          }
        ]
      });
      alert.present();
    }else{
      return
    }
  }

  changeDescription(post,index){
    let alert = this.alertCtrl.create({ 
      title:'修改描述',
      message: "请填写照片描述",
      inputs: [
        {
          name: 'title',
          placeholder: post.description
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {

          }
        },
        {
          text: '保存',
          handler: data => {
            post.description=data.title;
            let str = JSON.stringify(this.posts);
            this.storage.set('myImgs', str);
          }
        }
      ]
    });
    alert.present();
  }
  creat_actionsheet(handler , post?) {
    const actionsheet = this.actionsheetCtrl.create({
      title: '选择图片',
      buttons: [
        {
          text: '照相',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
           handler(this.camera.getPictureFromCamera(),post);
          }
        },
        {
          text: !this.platform.is('ios') ? '相片库' : 'camera roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            handler(this.camera.getPictureFromPhotoLibrary(),post);
          }
        },
        {
          text: '取消',
          icon: !this.platform.is('ios') ? '关闭' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          }
        }
      ]
    });
    return actionsheet.present();
  }

/**
 * 防止不识别this 所以采用箭头函数
 */

  change_handler = (from,post) => {
    const loading = this.loadingCtrl.create();

    loading.present();
    return from.then(picture => {

      post.image = picture;
      let str = JSON.stringify(this.posts);
      this.storage.set('myImgs', str);
      loading.dismiss();
    });
  }

  change_image(post){
    this.creat_actionsheet(this.change_handler, post);
  }
}
