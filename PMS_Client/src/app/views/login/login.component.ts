import {Component, OnInit} from '@angular/core';

import { Router } from '@angular/router';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  username: string = '';
  password: string = '';
  errorMessage: string='';
  canSignUp: boolean = false;

  constructor(protected authService: AuthService, private router: Router) {
  }
  async ngOnInit() {
    this.canSignUp = await this.authService.canSignup();
  }
  login(): void {
    this.authService.login(this.username, this.password).subscribe(response => {
      console.log(response)
      if (response) {
        this.router.navigate(['home']);
      } else {
        // handle login failure
      }
    });
  }
}
