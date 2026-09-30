import { Routes } from "@angular/router";
import { AppLayoutComponent } from "./components/app-layout/app-layout.component";
import { BonificoComponent } from "./pages/bonifico/bonifico.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { ListaMovimentiComponent } from "./pages/movimenti/movimenti.component";
import { ProfiloComponent } from "./pages/profilo/profilo.component";
import { RicaricaComponent } from "./pages/ricarica/ricarica.component";
import { MovimentiDettaglioComponent } from "./pages/movimenti-dettaglio/movimenti-dettaglio.component";
import { ModificaPasswordComponent } from "./pages/modifica-password/modifica-password.component";
import { authGuard } from "./utils/auth.guard";

export const routes: Routes = [
{
  path: '',
  component: AppLayoutComponent,
  canActivate: [authGuard],
  
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'movimenti', component: ListaMovimentiComponent },
      { path: 'bonifico', component: BonificoComponent },
      { path: 'dettaglio', component: MovimentiDettaglioComponent },
      { path: 'profilo', component: ProfiloComponent },
      { path: 'ricarica', component: RicaricaComponent },
      { path: 'modifica-password', component: ModificaPasswordComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];