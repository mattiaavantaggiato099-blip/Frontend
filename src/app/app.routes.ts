import { Routes } from '@angular/router';
import { FrontendModificaPasswordComponent } from './frontend-modifica-password/frontend-modifica-password';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'modifica-password',
    pathMatch: 'full'
  },
  {
    path: 'modifica-password',
    component: FrontendModificaPasswordComponent
  }
];