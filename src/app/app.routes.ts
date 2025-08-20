import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Signup } from './features/signup/signup';
import { AuthGuard } from './auth-guard';
import { ProjectDetails } from './features/project/pages/project-details/project-details';
import { Login } from './features/login/login';
import { ProjectList } from './features/project/pages/project-list/project-list';
import { VerifyUserComponent } from './features/verify-user/verify-user.component';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment.development';
import { PermissionManagementComponent } from './features/permission/permission-management/permission-management.component';
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
            }
        ],
        canActivate: [AuthGuard]
    },
    {
        path: "login",
        component: Login,
        providers: [
            {
                provide: 'SocialAuthServiceConfig',
                useValue: {
                    autoLogin: false,
                    providers: [
                        {
                            id: GoogleLoginProvider.PROVIDER_ID,
                            provider: new GoogleLoginProvider(googleClientId)
                        },
                    ],
                    onError: (err) => { console.error(err) }
                } as SocialAuthServiceConfig
            }
        ]

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
    }
];
