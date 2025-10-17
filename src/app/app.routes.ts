import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'registrar-acuerdos/datos-contacto',
    pathMatch: 'full'
  },
  {
    path: 'registrar-acuerdos',
    component: MainLayoutComponent,
    children: [
      {
        path: 'datos-contacto',
        loadComponent: () => import('./features/registrar-acuerdos/components/datos-contacto/datos-contacto.component').then(m => m.DatosContactoComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/registrar-acuerdos/components/documents/documents.component').then(m => m.DocumentsComponent)
      },
      {
        path: 'infractions-cuotas',
        loadComponent: () => import('./features/registrar-acuerdos/components/infractions-cuotas/infractions-cuotas.component').then(m => m.InfractionsCuotasComponent)
      },
      {
        path: 'confirmation',
        loadComponent: () => import('./features/registrar-acuerdos/components/confirmation/confirmation.component').then(m => m.ConfirmationComponent)
      }
    ]
  }
];
