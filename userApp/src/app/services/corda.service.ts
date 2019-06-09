import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CordaService {

  bankList = [
    {
      name: 'Banco Inter',
      authListPending: [
        { name: 'Dados pessoais', key: 'personalData'},
        { name: 'Dados financeiros', key: 'financialData'},
      ],
      authList: [
        { name: 'Dados de contato', key: 'contactData'}
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
