import {Component, OnInit} from '@angular/core';

import { Router } from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  username: string = '';
  password: string = '';
  errorMessage: string='';
  canSignUp?: Observable<boolean>;

  constructor(protected authService: AuthService, private router: Router) {
  }
   ngOnInit() {
    this.canSignUp = this.authService.canSignup().pipe(map(userExists =>!userExists));
  }
  login(): void {
    this.authService.login(this.username, this.password).subscribe(response => {
      if (response) {
        this.router.navigate(['home']);
      } else {
        // handle login failure
      }
    });
  }
}
