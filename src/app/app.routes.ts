import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./features/product/product.component').then((m) => m.ProductComponent),
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./features/product/product.component').then((m) => m.ProductComponent),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'products',
    pathMatch: 'full',
  }
];
