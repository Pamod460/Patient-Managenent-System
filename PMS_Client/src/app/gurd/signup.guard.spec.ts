import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { signupGuard } from './signup.guard';

describe('signupGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => signupGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
