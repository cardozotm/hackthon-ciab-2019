import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationsPage } from './authorizations.page';

describe('AuthorizationsPage', () => {
  let component: AuthorizationsPage;
  let fixture: ComponentFixture<AuthorizationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
