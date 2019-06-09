import { TestBed } from '@angular/core/testing';

import { MockUserService } from './mock-user.service';

describe('MockUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MockUserService = TestBed.get(MockUserService);
    expect(service).toBeTruthy();
  });
});
