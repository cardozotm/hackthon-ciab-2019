import { Component, OnInit } from '@angular/core';
import { CordaService } from 'src/app/services/corda.service';
import * as moment from 'moment';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
  averageAge: number;
  averageIncome: number;
  totalUsersFin = 0;
  totalUsersPer = 0;
  totalUsersCon = 0;
  totalUsers = 0;


  constructor(
    private cordaSv: CordaService
  ) { }

  ngOnInit() {
    this.getAllStates();
  }

  getAllStates() {
    this.totalUsersFin = 0;
    this.totalUsersPer = 0;
    this.totalUsersCon = 0;
    this.totalUsers = 0;
    this.averageAge = 0;
    this.averageIncome = 0;
    this.cordaSv.getAll()
      .then((states: Array<any>) => {
        // console.log(states);
        let sumAge = 0;
        let sumIncome = 0;
        states.forEach(el => {
          const identity = el.state.data.identity;
          console.log(identity);
          const perData = JSON.parse(identity.personalData);
          const finData = JSON.parse(identity.financialData);
          if (identity.personalDataAuth === 'true') {
            const age = moment(perData.birthDate.split('/').reverse()).fromNow(true).match(/\d+/g).map(Number)[0];
            sumAge += age;
            this.totalUsersPer += 1;
          }
          if (identity.financialDataAuth === 'true') {
            this.totalUsersFin += 1;
            const income = finData.anualIncome;
            sumIncome += income;
          }
          if (identity.contactDataAuth === 'true') {
            this.totalUsersCon += 1;
          }
          if (identity.personalDataAuth === 'true' || identity.financialDataAuth === 'true' || identity.contactDataAuth === 'true') {
            this.totalUsers += 1;
          }
        });
        if (this.totalUsersFin > 0) {
          this.averageIncome = sumIncome / this.totalUsersFin;
        }
        if (this.totalUsersPer > 0) {
          this.averageAge = sumAge / this.totalUsersPer;
        }
      });
  }



}
