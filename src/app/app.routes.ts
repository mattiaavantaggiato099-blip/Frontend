import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { BonificoComponent } from './bonifico/bonifico';
import { ModificaPasswordComponent } from './modifica-password/modifica-password';
import { HomeComponent } from './home/home';
import { RicaricaComponent } from './ricarica/ricarica';
import { RegisterComponent } from './register/register';
import { MovimentiComponent } from './movimenti/movimenti';
import { ProfiloComponent } from './profilo/profilo';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'bonifico',
    component: BonificoComponent
  },
  {
    path: 'modifica-password',
    component: ModificaPasswordComponent
  },
  {
    path: 'ricarica',
    component: RicaricaComponent
  },
  {
    path: 'movimenti',
    component: MovimentiComponent
  },
  {
    path: 'profilo',
    component: ProfiloComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];