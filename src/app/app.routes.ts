import { Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { Dashboard } from './features/dashboard/pages/dashboard';
import { AuthGuard } from './core/guards/auth-guard';
import { ProjectDetails } from './features/project/pages/project-details/project-details';
import { ProjectList } from './features/project/pages/project-list/project-list';
import { VerifyUserComponent } from './features/verify-user/verify-user.component';
import { environment } from '../environments/environment.development';
import { PermissionManagementComponent } from './features/permission/permission-management/permission-management.component';
import { UserProfileComponent } from './features/my-profile/pages/my-profile.component';
import { Signup } from './features/auth/pages/signup/signup';
import { Login } from './features/auth/pages/login/login';
const googleClientId = environment.googleClientId;

export const routes: Routes = [
    {
        path: "",
        component: Layout,
        children: [
            { path: 'dashboard', component: Dashboard },
            {
                path: 'projects',
                component: ProjectList,
            },
            {
                path: 'project/:id',
                component: ProjectDetails,
            },
            {
                path: "my-profile",
                component: UserProfileComponent
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
    },
    {
        path: "verify-user",
        component: VerifyUserComponent
    },
    {
        path: "admin/manage-permissions",
        component: PermissionManagementComponent
    },

];
