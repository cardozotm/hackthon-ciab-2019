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
  dataList = [
    // tslint:disable-next-line:max-line-length
    { name: 'Dados pessoais', key: 'personalData', details: `<ul><li>Nome</li><li>CPF/CNPJ</li><li>Data de Nascimento</li><li>Identificação de gênero</li></ul>` },
    // tslint:disable-next-line:max-line-length
    { name: 'Dados financeiros', key: 'financialData', details: `<ul><li>Empresa</li><li>Limite de crédito</li><li>Nº de dependentes</li><li>Renda anual</li><li>Declaração de IR</li></ul>` },
    { name: 'Dados de contato', key: 'contactData', details: `<ul><li>E-mail</li><li>Telefone</li><li>Endereço</li></ul>`}
  ];
  identity;
  constructor(
    private alertCtrl: AlertController,
    private cordaSv: CordaService,
    private mock: MockUserService,
  ) { }

  ngOnInit() {
    this.getBanks();
    this.getUser();
  }

  getUser() {
    this.identity = JSON.parse(localStorage.getItem('userInfo')).identity;
    this.user = {
      personalData: JSON.parse(this.identity.personalData),
      contactData: JSON.parse(this.identity.contactData),
      financialData: JSON.parse(this.identity.financialData)
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
      <ul><li>${auth.name} ${this.dataList.find(x => x.name === auth.name).details}</li><ul>
      `,
      buttons: [
        {
          text: 'Autorizar',
          cssClass: 'affirmative',
          handler: () => {
            this.cordaSv.approveDataRequest(auth).then((res: any) => {
              console.log('Request approved', res);
              // this.getBanks();
              localStorage.setItem('userInfo', JSON.stringify(res.entity.data));
              this.getUser();
            });
          }
        },
        {
          text: 'Voltar',
          // handler: () => {
          //   this.cordaSv.rejectDataRequest(auth).then(() => {
          //     console.log('Request rejected');
          //     // this.getBanks();
          //   });
          // },
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
      <p><b>${bank.name}</b> deseja acessar suas informações de:</p>
      <ul><li>${auth.name} ${this.dataList.find(x => x.name === auth.name).details}</li><ul>
      `,
      buttons: [
        'Voltar',
        {
          text: 'Remover',
          cssClass: 'danger',
          handler: () => {
            this.cordaSv.deleteDataAuth(auth).then((res: any) => {
              console.log('Authorization deleted');
              // this.getBanks();
              localStorage.setItem('userInfo', JSON.stringify(res.entity.data));
              this.getUser();
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
