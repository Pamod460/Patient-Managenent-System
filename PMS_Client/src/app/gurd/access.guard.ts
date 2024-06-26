import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const accessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  console.log("is admin",authService.isAdmin())
  return authService.isAdmin();
};
