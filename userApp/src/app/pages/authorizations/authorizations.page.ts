import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CordaService } from 'src/app/services/corda.service';
import { MockUserService } from 'src/app/services/mock-user.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-authorizations',
  templateUrl: './authorizations.page.html',
  styleUrls: ['./authorizations.page.scss'],
})
export class AuthorizationsPage implements OnInit {

  user;
  bankList;
  constructor(
    private alertCtrl: AlertController,
    private cordaSv: CordaService,
    private mock: MockUserService,
  ) { }

  ngOnInit() {
    this.getBanks();
    this.mock.createUser();
    this.getUser();
  }

  getUser() {
    const identity = JSON.parse(localStorage.getItem('userInfo')).identity;
    this.user = {
      personalData: JSON.parse(identity.personalData),
      contactData: JSON.parse(identity.contactData),
      financialData: JSON.parse(identity.financialData)
    };
  }

  getBanks() {
    this.cordaSv.getBanks().then(res => this.bankList = res);
  }

  async showDetailsApproval(auth, bank) {
    console.log(auth);
    const alert = await this.alertCtrl.create({
      header: 'Detalhes da autorização',
      message: `
      <p><b>${bank.name}</b> deseja acessar suas informações de:</p>
      <ul><li>${auth.name}</li><ul>
      `,
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

  async showDetailsApproved(auth, bank) {
    console.log(auth);
    const alert = await this.alertCtrl.create({
      header: 'Detalhes da autorização',
      message: `
      <p><b>${bank.name}</b> possui acesso a suas informações de:</p>
      <ul><li>${auth.name}</li></ul>
      `,
      buttons: [
        'Voltar',
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
