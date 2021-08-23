import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddComponent } from './pages/add/add.component';
import { HeroComponent } from './pages/hero/hero.component';
import { ListComponent } from './pages/list/list.component';
import { HomeComponent } from './pages/home/home.component';


const heroesRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'nuevo',
        component: AddComponent
      },
      {
        path: 'editar/:id',
        component: AddComponent
      },
      {
        path: 'detalle/:id',
        component: HeroComponent
      },
      {
        path: 'lista',
        component: ListComponent
      },
      {
        path: '**',
        redirectTo: 'lista'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(heroesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HeroesRoutingModule { }
