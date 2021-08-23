import { Hero, PublisherEnum } from '../interfaces/heroes.interface';
import { of, Observable } from 'rxjs';

export const heroesMocked: Hero[] = [
  {
    id: 'batman',
    superhero: 'Batman',
    publisher: PublisherEnum.DCComics,
    alterEgo: 'Bruce',
    firstAppearance: '1988',
    characters: 'Jocker'
  },
  {
    id: 'deadpool',
    superhero: 'Deadpool',
    publisher: PublisherEnum.MarvelComics,
    alterEgo: '?',
    firstAppearance: '1978',
    characters: '?'
  }
];

export const heroMocked: Hero = {
  id: 'dc-flash',
  superhero: 'Flash',
  publisher: PublisherEnum.DCComics,
  alterEgo: '?',
  firstAppearance: '1978',
  characters: '?'
};

export class HeroesServiceMock {

 public getHeroes(): Observable<Hero[]> {
    return of(heroesMocked);
  }

  public getHeroById(id: string): Observable<Hero> {
    return of(heroMocked);
  }

  public getSuggestions(searchTerm: string): Observable<Hero[]> {
    return of(heroesMocked);
  }

  public addHero(hero: Hero): Observable<Hero> {
    return of(heroMocked);
  }

  public updateHero(hero: Hero): Observable<Hero> {
    return of(heroMocked);
  }

  public deleteHeroById(id: string): Observable<{}> {
    return of({});
  }
}
