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
  totalUsers = 0;

  constructor(
    private cordaSv: CordaService
  ) { }

  ngOnInit() {
    this.getAllStates();
  }

  getAllStates() {
    this.cordaSv.getAll()
    .then((states: Array<any>) => {
      console.log(states);
      let sumAge = 0;
      let sumIncome = 0;
      states.forEach(el => {
        const perData = JSON.parse(el.state.data.identity.personalData);
        const finData = JSON.parse(el.state.data.identity.financialData);
        this.totalUsers += 1;
        const age = moment(perData.birthDate.split('/').reverse()).fromNow(true).match(/\d+/g).map(Number)[0];
        const income = finData.anualIncome;
        sumIncome += income;
        sumAge += age;
        console.log(sumAge);
      });
      this.averageAge = sumAge / this.totalUsers;
      this.averageIncome = sumIncome / this.totalUsers;
    });
  }



}
