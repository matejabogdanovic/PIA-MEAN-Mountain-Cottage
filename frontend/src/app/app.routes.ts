import { Routes } from '@angular/router';
import { UnregisteredPageComponent } from './pages/unregistered-page/unregistered-page.component';

import { FormsLayoutComponent } from './layouts/forms-layout/forms-layout.component';
import { RegisterComponent } from './auth-components/register/register.component';
import { AdminLoginComponent } from './auth-components/admin-login/admin-login.component';
import { PublicLoginComponent } from './auth-components/public-login/public-login.component';
import { PasswordChangeComponent } from './auth-components/password-change/password-change.component';

import { OwnerLayoutComponent } from './layouts/owner-layout/owner-layout.component';
import { OwnerHomePageComponent } from './pages/owner-home-page/owner-home-page.component';
import { TouristLayoutComponent } from './layouts/tourist-layout/tourist-layout.component';
import { TouristHomePageComponent } from './pages/tourist-home-page/tourist-home-page.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminHomePageComponent } from './pages/admin-home-page/admin-home-page.component';
import { OwnerMyCottagesPageComponent } from './pages/owner-my-cottages-page/owner-my-cottages-page.component';
import { TouristCottagesPageComponent } from './pages/tourist-cottages-page/tourist-cottages-page.component';
import { CottagePageComponent } from './pages/cottage-page/cottage-page.component';
import { TouristMyReservationsPageComponent } from './pages/tourist-my-reservations-page/tourist-my-reservations-page.component';
import { OwnerReservationsPageComponent } from './pages/owner-reservations-page/owner-reservations-page.component';
import { OwnerStatisticsPageComponent } from './pages/owner-statistics-page/owner-statistics-page.component';

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

  { path: 'owner/home', component: OwnerHomePageComponent },
  {
    path: 'owner/my-cottages',
    component: OwnerMyCottagesPageComponent,
  },
  {
    path: 'owner/reservations',
    component: OwnerReservationsPageComponent,
  },
  {
    path: 'owner/statistics',
    component: OwnerStatisticsPageComponent,
  },
  { path: 'tourist/home', component: TouristHomePageComponent },
  { path: 'tourist/cottages', component: TouristCottagesPageComponent },
  {
    path: 'tourist/my-reservations',
    component: TouristMyReservationsPageComponent,
  },
  { path: 'admin/home', component: AdminHomePageComponent },

  { path: 'cottage/:_id', component: CottagePageComponent },
];
