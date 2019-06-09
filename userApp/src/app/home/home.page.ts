import { Component, OnInit } from '@angular/core';
import { MockUserService } from '../services/mock-user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private mock: MockUserService, ) {}

  ngOnInit() {
    this.mock.createUser();
  }

}
