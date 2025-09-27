import { Routes } from '@angular/router';
import { UnregisteredPageComponent } from './pages/unregistered-page/unregistered-page.component';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { FormsLayoutComponent } from './layouts/forms-layout/forms-layout.component';
import { RegisterComponent } from './auth-components/register/register.component';
import { AdminLoginComponent } from './auth-components/admin-login/admin-login.component';
import { PublicLoginComponent } from './auth-components/public-login/public-login.component';
import { PasswordChangeComponent } from './auth-components/password-change/password-change.component';

export const routes: Routes = [
  { path: '', component: UnregisteredPageComponent },

  {
    path: 'login',
    component: FormsLayoutComponent,
    data: { pageTitle: 'Login' },
    children: [{ path: '', component: PublicLoginComponent }],
  },
  {
    path: 'admin',
    component: FormsLayoutComponent,
    data: { pageTitle: 'Admin Login', styles: '2' },
    children: [{ path: '', component: AdminLoginComponent }],
  },

  {
    path: 'register',
    component: FormsLayoutComponent,
    data: { pageTitle: 'Register' },
    children: [{ path: '', component: RegisterComponent }],
  },
  {
    path: 'password-change/:korisnicko_ime',
    component: FormsLayoutComponent,
    data: { pageTitle: 'Password Change' },
    children: [{ path: '', component: PasswordChangeComponent }],
  },
  { path: 'home', component: HomePageComponent },
];
