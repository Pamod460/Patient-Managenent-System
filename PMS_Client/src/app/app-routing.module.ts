import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainWindowComponent} from "./views/main-window/main-window.component";
import {HomeComponent} from "./views/home/home.component";
import {authGuard} from "./gurd/auth.guard";
import {LoginComponent} from "./views/login/login.component";
import {SignupComponent} from "./views/signup/signup.component";
import {accessGuard} from "./gurd/access.guard";
import {signupGuard} from "./gurd/signup.guard";

const routes: Routes = [{
  path: "", component: MainWindowComponent, canActivate: [authGuard],
  children: [
    {path: "home", component: HomeComponent},
    {
      path: "users",
      canActivate: [accessGuard],
      loadChildren: () => import("./modules/user/user.module").then((m) => m.UserModule),
    },
    {path: "reports", loadChildren: () => import("./modules/report/report.module").then((m) => m.ReportModule)},
    {path: "records", loadChildren: () => import("./modules/record/record.module").then((m) => m.RecordModule)},
    {path: "patients", loadChildren: () => import("./modules/patient/patient.module").then((m) => m.PatientModule)},
    {path: '', redirectTo: '/home', pathMatch: 'full'}]
},
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '', pathMatch: 'full', canActivate: [signupGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full', canActivate: [signupGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
