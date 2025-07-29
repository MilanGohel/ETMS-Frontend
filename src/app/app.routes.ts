import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';
import { Dashboard } from './dashboard/dashboard';
import { Projects } from './projects/projects';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { AuthGuard } from './auth-guard';
import { ProjectDetails } from './projects/project-details/project-details';

export const routes: Routes = [
    {
        path: "",
        component: Layout,
        children: [
            { path: 'dashboard', component: Dashboard },
            {
                path: 'projects',
                component: Projects,
            },
            {
                path:'project/:id',
                component: ProjectDetails
            }
        ],
        canActivate: [AuthGuard]
    },
    {
        path: "login",
        component: Login,
    },
    {
        path: "signup",
        component: Signup
    }
];
