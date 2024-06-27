import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {map} from "rxjs/operators";

export const signupGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.canSignup().pipe(
    map(userExists => {
      console.log("signup",userExists)
      if (userExists) {
        router.navigate(['/login']);
      } else {
        router.navigate(['/signup']);
      }
      return false;
    })
  );
};
