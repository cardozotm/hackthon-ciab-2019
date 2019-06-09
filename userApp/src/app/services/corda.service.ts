import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CordaService {

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

  constructor() { }

  getBanks() {
    return new Promise((resolve, reject) => {
      resolve(this.bankList);
    });
  }

  approveDataRequest(auth) {
    return new Promise((resolve, reject) => {
      console.log(auth, 'accepted');
      resolve();
    });
  }

  rejectDataRequest(auth) {
    return new Promise((resolve, reject) => {
      console.log(auth, 'rejected');
      resolve();
    });
  }

  deleteDataAuth(auth) {
    return new Promise((resolve, reject) => {
      console.log(auth, 'marked for deletion');
      resolve();
    });
  }
}
