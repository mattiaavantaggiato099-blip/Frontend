import { Routes } from "@angular/router";

import { authGuard } from "./utils/auth.guard";

import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";

import { HomeComponent } from "./pages/home/home.component";
import { AppLayoutComponent } from "./components/app-layout/app-layout.component";
import { ListaMovimentiComponent } from "./components/lista-movimenti/lista-movimenti.component";
import { BonificoComponent } from "./pages/bonifico/bonifico.component";
import { ModificaPasswordComponent } from "./pages/modifica-password/modifica-password.component";
import { MovimentiDettaglioComponent } from "./pages/movimenti-dettaglio/movimenti-dettaglio.component";
import { ProfiloComponent } from "./pages/profilo/profilo.component";
import { RicaricaComponent } from "./pages/ricarica/ricarica.component";
import { MovimentiComponent } from "./pages/movimenti/movimenti.component";
import { EmailVerificataComponent } from "./pages/email-verificata/email-verificata.component";
import { VerificaEmailComponent } from "./pages/verifica-email/verifica-email.component";
import { DepositoComponent } from "./pages/deposito/deposito.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },

  {
    path: "registrazione",
    component: RegisterComponent,
  },
  {
    path: "verifica-email",
    component: VerificaEmailComponent,
  },
  {
    path: "email-verificata",
    component: EmailVerificataComponent,
  },
  {
    path: "",
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "home",
        component: HomeComponent,
      },
      {
        path: "movimenti",
        component: MovimentiComponent,
      },
      {
        path: "bonifico",
        component: BonificoComponent,
      },
      {
        path: "dettaglio",
        component: MovimentiDettaglioComponent,
      },
      {
        path: "profilo",
        component: ProfiloComponent,
      },
      {
        path: "ricarica",
        component: RicaricaComponent,
      },
      {
        path: "modifica-password",
        component: ModificaPasswordComponent,
      },
      { path: 'deposito', 
        component: DepositoComponent, 
      },
    ],
  },

  {
    path: "**",
    redirectTo: "login",
  },
];