import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CordaService {

  bankList = [
    {
      name: 'Banco Euro',
      authListPending: [
        { name: 'Dados pessoais', key: 'personalData'},
        { name: 'Dados financeiros', key: 'financialData'},
      ],
      authList: [
        { name: 'Dados de contato', key: 'contactData'}
      ]
    }
  ];

  constructor(
    private cryptoSv: CryptoService,
    private http: HttpClient,
  ) { }

  getBanks() {
    return new Promise((resolve, reject) => {
      resolve(this.bankList);
    });
  }

  approveDataRequest(auth) {
    return new Promise(async (resolve, reject) => {
      const message = this.cryptoSv.generateNonce();
      const signature = await this.cryptoSv.signWithPrivk(localStorage.getItem('privKey'), message);
      const identity = JSON.parse(localStorage.getItem('userInfo')).identity;
      const data = {
        message,
        signature,
        uid: identity.uid,
        personalDataAuth: identity.personalDataAuth,
        financialDataAuth: identity.financialDataAuth,
        contactDataAuth: identity.contactDataAuth,
      };
      data[auth.key + 'Auth'] = true;
      console.log(data);
      this.http.post(`${environment.cordaApi}/autorize`, data).subscribe(
        (res) => {
          console.log(res, 'accepted');
          resolve(res);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
      resolve();
    });
  }

  rejectDataRequest(auth) {
    return new Promise(async (resolve, reject) => {
      const message = this.cryptoSv.generateNonce();
      const signature = await this.cryptoSv.signWithPrivk(localStorage.getItem('privKey'), message);
      const data = {
        message,
        signature
      };
      console.log(data, 'rejected');
      resolve();
    });
  }

  deleteDataAuth(auth) {
    return new Promise(async (resolve, reject) => {
      const message = this.cryptoSv.generateNonce();
      const signature = await this.cryptoSv.signWithPrivk(localStorage.getItem('privKey'), message);
      const data = {
        message,
        signature,
      };
      data[auth.key] = false;
      this.http.post(`${environment.cordaApi}/autorize`, data).subscribe(
        (res) => {
          console.log(res, 'marked for deletion');
          resolve(res);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  getAll() {
    return new Promise ((resolve, reject) => {
      this.http.get(`${environment.cordaApi}/all`).subscribe(
        (res: any) => {
          console.log(res);
          resolve(res.entity);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }
}
