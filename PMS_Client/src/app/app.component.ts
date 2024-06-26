import {Component, inject, OnInit} from '@angular/core';
import {IdleService} from "./services/idle.service";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'PMS-Client';
  constructor(private idleService:IdleService) {
  }

  ngOnInit(): void {

    }


}
