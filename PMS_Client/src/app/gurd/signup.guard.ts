import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const signupGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.canSignup();
};
