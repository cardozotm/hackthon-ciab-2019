import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-authorizations',
  templateUrl: './authorizations.page.html',
  styleUrls: ['./authorizations.page.scss'],
})
export class AuthorizationsPage implements OnInit {

  user = {
    name: 'Fulano da Silva.'
  };
  bankList = [
    {
      name: 'Banco Inter',
      authListPending: [
        'Dados pessoais',
        'Gastos com telefone',
        'Dados de endereço'
      ],
      authList: [
        'Gastos com telefone',
        'Dados de endereço'
      ]
    }
  ];
  constructor(
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
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
            console.log(auth, 'accepted');
          }
        },
        {
          text: 'Rejeitar',
          handler: () => {
            console.log(auth, 'rejected');
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
            console.log(auth, 'marked for deletion');
          }
        }
      ]
    });
    await alert.present();
  }

}
