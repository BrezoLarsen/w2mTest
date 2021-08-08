import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeroesRoutingModule } from './heroes-routing.module';

import { MaterialModule } from '../material/material.module';

import { AddComponent } from './pages/add/add.component';
import { HeroComponent } from './pages/hero/hero.component';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';


@NgModule({
  declarations: [
    AddComponent,
    HeroComponent,
    HomeComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HeroesRoutingModule,
    FormsModule
  ]
})
export class HeroesModule { }
