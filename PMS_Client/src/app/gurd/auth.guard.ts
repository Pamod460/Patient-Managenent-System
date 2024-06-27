import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../services/auth.service";
import {map} from "rxjs/operators";


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    console.log("loggedin")
    return true;
  } else {
    return authService.canSignup().pipe(
      map(userExists => {
        if (userExists) {
          router.navigate(['/login']);
        } else {
          router.navigate(['/signup']);
        }
        return false;
      })
    );
  }
};
