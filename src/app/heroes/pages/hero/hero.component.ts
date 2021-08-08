import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Hero } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  id: string;
  hero: Hero;

  constructor(
    private activatedRouter: ActivatedRoute,
    private heroesService: HeroesService,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRouter.params.pipe(
      switchMap( ({id}) => this.heroesService.getHeroById(id))
    )
    .subscribe(hero => this.hero = hero);
  }

  back() {
    this.router.navigate(['heroes/lista'])
  }

}
