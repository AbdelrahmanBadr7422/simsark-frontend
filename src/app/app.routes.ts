import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { loggedGuard } from './guards/logged-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((c) => c.Home),
    title: 'Home',
  },
  {
    path: 'explore',
    loadComponent: () => import('./components/shared/explore/explore').then((c) => c.Explore),
    title: 'Explore',
  },
  {
    path: 'auth',
    canActivate: [loggedGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login').then((c) => c.Login),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () => import('./components/auth/register/register').then((c) => c.Register),
        title: 'Register',
      },

      {
        path: 'reset-password',
        loadComponent: () =>
          import('./components/auth/forget-pass/forget-pass').then((c) => c.ForgetPass),
        title: 'Reset Password',
      },
    ],
  },
  {
    path: '',
    canActivate: [],
    children: [
      {
        path: 'create-post',
        loadComponent: () => import('./pages/new-post/new-post').then((c) => c.NewPost),
        title: 'Add New Post',
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((c) => c.Profile),
        title: 'Profile',
      },
    ],
  },
  {
    path: 'post/:postId',
    loadComponent: () => import('./pages/post-detials/post-detials').then((c) => c.PostDetails),
    title: 'Post',
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((c) => c.Contact),
    title: 'Contact Us',
  },

  {
    path: '**',
    loadComponent: () =>
      import('./pages/page-not-found/page-not-found').then((c) => c.PageNotFound),
    title: '404 Error',
  },
];
