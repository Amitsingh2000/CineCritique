import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MovieComponent } from './movie/movie.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'login/:error',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'dashboard',component:DashboardComponent,canActivate :[AuthGuard]},
    {path:'movie/:type/:id',component:MovieComponent},
    {path:'register',component:RegisterComponent},
    {path:'**',component:HomeComponent}
];
