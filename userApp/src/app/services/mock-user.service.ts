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

      };
      const contact = {

      };
      const financial = {

      };

      const keys = await this.cryptoSv.generateKeyPair();
      localStorage.setItem('privKey', keys.privKey);
      const data = {
        uid: CPF.generate(),
        pubkey: this.cryptoSv.parseKeys(keys.pubKey),
        personalData: JSON.stringify(personal),
        contactData: JSON.stringify(contact),
        financialData: JSON.stringify(financial)
      };
      console.log(data);
      this.http.post(`${environment.cordaApi}/create-account`, data)
        .subscribe(
          (res) => {
            console.log(res);
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
