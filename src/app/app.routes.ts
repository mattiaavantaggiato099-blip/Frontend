import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './utils/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MovimentiComponent } from './pages/movimenti/movimenti.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'registrazione',
        component: RegisterComponent
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
    }
]
