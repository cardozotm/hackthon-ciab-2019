import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CordaService } from 'src/app/services/corda.service';
import { MockUserService } from 'src/app/services/mock-user.service';

@Component({
  selector: 'app-authorizations',
  templateUrl: './authorizations.page.html',
  styleUrls: ['./authorizations.page.scss'],
})
export class AuthorizationsPage implements OnInit {

  user = {
    name: 'Fulano da Silva'
  };
  bankList;
  constructor(
    private alertCtrl: AlertController,
    private cordaSv: CordaService,
    private mock: MockUserService,
  ) { }

  ngOnInit() {
    this.getBanks();
    this.mock.createUser();
  }

  getBanks() {
    this.cordaSv.getBanks().then(res => this.bankList = res);
  }

  async showDetailsApproval(auth) {
    console.log(auth);
    const alert = await this.alertCtrl.create({
      header: 'Detalhes da autorização',
      message: `${auth}`,
      buttons: [
        {
          text: 'Autorizar',
          handler: () => {
            this.cordaSv.approveDataRequest(auth).then(() => {
              console.log('Request approved');
              this.getBanks();
            });
          }
        },
        {
          text: 'Rejeitar',
          handler: () => {
            this.cordaSv.rejectDataRequest(auth).then(() => {
              console.log('Request rejected');
              this.getBanks();
            });
          },
          cssClass: 'danger',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async showDetailsApproved(auth) {
    console.log(auth);
    const alert = await this.alertCtrl.create({
      header: 'Detalhes da autorização',
      message: `${auth}`,
      buttons: ['Voltar',
        {
          text: 'Remover',
          cssClass: 'danger',
          handler: () => {
            this.cordaSv.deleteDataAuth(auth).then(() => {
              console.log('Authorization deleted');
              this.getBanks();
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
