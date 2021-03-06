import { Component, Input, ViewChildren, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { IonicPage, NavController, Platform, ActionSheetController, LoadingController, AlertController, } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { CameraProvider } from '../../providers/util/camera.provider';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mytext: any;
  mytext1: any;
  mytext2: any;
  posts = [];
  isDelete: boolean = false;
  delPost = [];
  time: number = 0;
  interval: number;

  @ViewChildren('mycard')
  mycards: QueryList<ElementRef>;

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
  /**
   * 载入
   */

  ionViewDidLoad() {
    this.storage.get('myImgs').then((val) => {
      if (this.mytext == val) {
        this.posts = JSON.parse(val);
      } else {
        let imgs = [
          {
            description: '1Trying out digital painting',
            image: './assets/imgs/b.jpg',
            time: new Date()
          },
          {
            description: '2Delicious chocolate bread recipe!',
            image: './assets/imgs/c.jpg',
            time: new Date()
          },
          {
            description: '3Look at this amazing clay humming bird I crafted!',
            image: './assets/imgs/d.jpg',
            time: new Date()
          },
          {
            description: '4Origami tullip tutorial',
            image: './assets/imgs/e.jpg',
            time: new Date()
          },
          {
            description: '5Delicious chocolate bread recipe!',
            image: './assets/imgs/f.jpg',
            time: new Date()
          },
          {
            description: '6Delicious chocolate bread recipe!',
            image: './assets/imgs/g.jpg',
            time: new Date()
          },
          {
            description: '7Delicious chocolate bread recipe!',
            image: './assets/imgs/h.jpg',
            time: new Date()
          },
          {
            description: '8Delicious chocolate bread recipe!',
            image: './assets/imgs/i.jpg',
            time: new Date()
          },
          {
            description: '9Delicious chocolate bread recipe!',
            image: './assets/imgs/j.jpg',
            time: new Date()
          },
          {
            description: '10Delicious chocolate bread recipe!',
            image: './assets/imgs/k.jpg',
            time: new Date()
          },
          {
            description: '11Fastest car of all times',
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

  /**
   * 事件
   */

  //添加图片
  add_img() {
    this.creat_actionsheet(this.add_handler);
  }
  //修改描述
  changeDescription(post, index) {
    if (!this.isDelete) {
      let alert = this.alertCtrl.create({
        title: '修改描述',
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
              post.description = data.title;
              let str = JSON.stringify(this.posts);
              this.storage.set('myImgs', str);
            }
          }
        ]
      });
      alert.present();

    }
  }
  //修改图片
  change_image(post) {
    if (!this.isDelete) {
      this.creat_actionsheet(this.change_handler, post);
    }

  }
  //删除图片
  del_img() {
    this.isDelete = true;
    for (let i = 0; i < this.delPost.length; i++) {
      this.removeByValue(this.posts, this.delPost[i]);
    }
    let str = JSON.stringify(this.posts);
    this.storage.set('myImgs', str);
  }
  //从删除界面回到图片浏览界面  
  cancel() {
    this.isDelete = false;
    this.delPost = [];
    this.mycards.forEach(e => {
      e.nativeElement.style.opacity = 1.0;
    });
  }
  //变换删除状态
  toogleClass(mycard, post) {
    if (this.isDelete) {
      if (this.platform.is('android')) {
        if (mycard.className == 'pin card card-md') {
          mycard.setAttribute('class', 'pin card card-md animated infinite pulse')
          this.delPost.push(post);
        } else {
          mycard.setAttribute('class', 'pin card card-md')
          this.removeByValue(this.delPost, post);
        }
      } else if (this.platform.is('ios')) {
        if (mycard.className == 'pin card card-ios') {
          mycard.setAttribute('class', 'pin card card-ios animated infinite pulse')
          this.delPost.push(post);
        } else {
          mycard.setAttribute('class', 'pin card card-ios')
          this.removeByValue(this.delPost, post);
        }
      }
    }
  }

  /**
   * 回调函数
   */

  add_handler = (from) => {
    const loading = this.loadingCtrl.create();
    loading.present();
    return from.then(picture => {

      this.showAlert(picture);
      loading.dismiss();
    });
  }

  change_handler = (from, post) => {
    const loading = this.loadingCtrl.create();

    loading.present();
    return from.then(picture => {

      post.image = picture;
      let str = JSON.stringify(this.posts);
      this.storage.set('myImgs', str);
      loading.dismiss();
    });
  }

  /**
   * 共用
   */
  creat_actionsheet(handler, post?) {
    const actionsheet = this.actionsheetCtrl.create({
      title: '选择图片',
      buttons: [
        {
          text: '照相',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            handler(this.camera.getPictureFromCamera(), post);
          }
        },
        {
          text: !this.platform.is('ios') ? '相片库' : 'camera roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            handler(this.camera.getPictureFromPhotoLibrary(), post);
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
   * 弹窗
   */
  showAlert(pic) {
    if (pic) {

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
    } else {
      return
    }
  }
  hold_del(post) {
    let alert = this.alertCtrl.create({
      message: "是否删除",
      buttons: [
        {
          text: '取消',
          handler: data => {

          }
        },
        {
          text: '删除',
          handler: data => {
            this.removeByValue(this.posts, post);
            let str = JSON.stringify(this.posts);
            this.storage.set('myImgs', str);
          }
        }
      ]
    });
    alert.present();
  }
  // 从数组中删除指定元素
  removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  }

}
