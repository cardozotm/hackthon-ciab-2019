import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authorizations',
  templateUrl: './authorizations.page.html',
  styleUrls: ['./authorizations.page.scss'],
})
export class AuthorizationsPage implements OnInit {

  user = {
    name: 'Fulano'
  };
  bankList = [
    {
      name: 'Banco Inter',
      authList: [
        'Dados pessoais',
        'Gastos com telefone',
        'Dados de endereço'
      ]
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
