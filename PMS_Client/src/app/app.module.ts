import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainWindowComponent } from './views/main-window/main-window.component';
import { HomeComponent } from './views/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from '@angular/material/icon';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {ToastrModule} from "ngx-toastr";
import {DialogComponent} from "./utils/dialog/dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import { ProtectedComponent } from './views/protected/protected.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JwtInterceptor} from "./interceptor/jwt.interceptor";
import {NgChartsModule} from "ng2-charts";
import {AuthService} from "./services/auth.service";
import {IdleService} from "./services/idle.service";
import {TimeoutDialogComponent} from "./utils/TimeoutDialogComponent";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatGridListModule} from "@angular/material/grid-list";


@NgModule({
  declarations: [
    AppComponent,
    MainWindowComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    DialogComponent,
    ProtectedComponent,
    TimeoutDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    NgbModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    ToastrModule.forRoot() ,
    MatDialogModule,
    FormsModule,
    NgChartsModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatGridListModule
  ],
  providers: [ DatePipe,{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, IdleService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
