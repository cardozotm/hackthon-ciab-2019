import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as CPF from 'gerador-validador-cpf';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class MockUserService {

  constructor(
    private http: HttpClient,
    private cryptoSv: CryptoService,
  ) {
  }

  checkUser() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.cordaApi}/users`)
        .subscribe(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          });
    });
  }

  createUser() {
    return new Promise(async (resolve, reject) => {
      const personal = {
        name: 'Amalia Snider',
        uid: CPF.generate(),
        picture: 'http://placehold.it/32x32',
        birthDate: 'xx/xx/xxxx',
        gender: 'female'

      };
      const contact = {
        email: 'amaliasnider@bulljuice.com',
        phone: '+1 (857) 516-3299',
        address: '461 Coleridge Street, Bradenville, Palau, 6263'

      };
      const financial = {
        company: 'GINKOGENE',
        creditLimit: 75133,
        numberOfDependents: 9,
        anualIncome: 87478,
        taxesReturn: 51825
      };

      const keys = await this.cryptoSv.generateKeyPair();
      localStorage.setItem('privKey', keys.privKey);
      const data = {
        uid: personal.uid,
        pubkey: this.cryptoSv.parseKeys(keys.pubKey),
        personalData: JSON.stringify(personal),
        contactData: JSON.stringify(contact),
        financialData: JSON.stringify(financial)
      };
      console.log(data);
      this.http.post(`${environment.cordaApi}/create-account`, data)
        .subscribe(
          (res: any) => {
            console.log(res);
            localStorage.setItem('userInfo', JSON.stringify(res.entity.data));
            resolve(res);
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });
  }
}
