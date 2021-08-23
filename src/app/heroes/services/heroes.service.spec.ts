import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Observable, throwError } from 'rxjs';
import { heroMocked } from './heroes-service-mock';
import { HeroesService } from './heroes.service';


describe('HeroesService', () => {
  let service: HeroesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(HeroesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should return observable when getHeroes is called', inject(
    [HeroesService], HeroesService => {
      const data = HeroesService.getHeroes();
      expect(data instanceof Observable).toEqual(true);
    }
  ));

  it('Should return observable when getHeroById is called', inject(
    [HeroesService], HeroesService => {
      const id = 'flash';
      const data = HeroesService.getHeroById(id);
      expect(data instanceof Observable).toEqual(true);
    }
  ));

  it('Should return observable when getSuggestions is called', inject(
    [HeroesService], HeroesService => {
      const searchTerm = 'deadpool';
      const data = HeroesService.getSuggestions(searchTerm);
      expect(data instanceof Observable).toEqual(true);
    }
  ));

  it('Should return observable when addHero is called', inject(
    [HeroesService], HeroesService => {
      const data = HeroesService.addHero(heroMocked);
      expect(data instanceof Observable).toEqual(true);
    }
  ));

  it('Should return observable when updateHero is called', inject(
    [HeroesService], HeroesService => {
      const data = HeroesService.updateHero(heroMocked);
      expect(data instanceof Observable).toEqual(true);
    }
  ));

  it('Should return observable when deleteHeroById is called', inject(
    [HeroesService], HeroesService => {
      const id = 'spiderman';
      const data = HeroesService.deleteHeroById(id);
      expect(data instanceof Observable).toEqual(true);
    }
  ));

});
