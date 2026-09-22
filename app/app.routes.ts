import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MovimentiComponent } from './pages/movimenti/movimenti.component';
import { DettaglioMovimentoComponent } from './pages/dettaglio-movimento/dettaglio-movimento.component';
import { BonificoComponent } from './pages/bonifico/bonifico.component';
import { ModificaPasswordComponent } from './pages/modifica-password/modifica-password.component';
import { ProfiloComponent } from './pages/profilo/profilo.component';

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
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'movimenti',
    component: MovimentiComponent
  },

  {
    path: 'dettaglio-movimento/:id',
    component: DettaglioMovimentoComponent
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
    path: '**',
    redirectTo: 'login'
  },
  {
    path: 'profilo',
    component: ProfiloComponent
  }
];