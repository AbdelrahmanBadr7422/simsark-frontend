import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { loggedGuard } from './guards/logged-guard';
import { sellerGuard } from './guards/seller-guard';

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
        path: 'forget-password',
        loadComponent: () =>
          import('./components/auth/forget-pass/forget-pass').then((c) => c.ForgetPass),
        title: 'Forget Password',
      },

      {
        path: 'reset-password/:token',
        loadComponent: () =>
          import('./components/auth/reset-pass/reset-pass').then((c) => c.ResetPass),
        title: 'Reset Password',
      },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        canActivate: [sellerGuard],
        path: 'create-post',
        loadComponent: () => import('./pages/new-post/new-post').then((c) => c.NewPost),
        title: 'Add New Post',
      },
      {
        path: 'user',
        loadComponent: () => import('./components/auth/user/user').then((c) => c.User),
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full',
          },
          {
            path: 'profile',
            loadComponent: () => import('./components/auth/profile/profile').then((c) => c.Profile),
            title: 'Profile',
          },
          {
            path: 'portfolio',
            canActivate: [sellerGuard],
            loadComponent: () =>
              import('./components/auth/portfolio/portfolio').then((c) => c.Portfolio),
            title: 'Protfolio',
          },
          {
            path: 'offers',
            loadComponent: () =>
              import('./components/auth/user-offers/user-offers').then((c) => c.UserOffers),
            title: 'Offers',
          },
        ],
        title: 'User',
      },
      {
        path: 'offers/:postId',
        canActivate:[sellerGuard],
        loadComponent: () =>
          import('./components/auth/offers-list/offers-list').then((c) => c.OffersList),
        title: 'Offers',
      },
    ],
  },
  {
    path: 'post/:postId',
    loadComponent: () => import('./pages/post-details/post-details').then((c) => c.PostDetails),
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
