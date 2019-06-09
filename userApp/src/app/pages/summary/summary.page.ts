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

  constructor(
    private cordaSv: CordaService
  ) { }

  ngOnInit() {
    this.getAllStates();
  }

  getAllStates() {
    this.cordaSv.getAll()
    .then((states: Array<any>) => {
      let counter = 0;
      let sum = 0;
      states.forEach(el => {
        const perData = JSON.parse(el.state.data.identity.personalData);
        counter += 1;
        const age = moment(perData.birthDate.split('/').reverse()).fromNow(true).match(/\d+/g).map(Number)[0];
        sum += age;
        console.log(sum);
      });
      this.averageAge = sum / counter;
    });
  }



}
