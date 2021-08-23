import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { HeroesServiceMock, heroMocked } from '../../services/heroes-service-mock';
import { HeroesService } from '../../services/heroes.service';
import { HeroComponent } from './hero.component';


describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: HeroesService,
          useClass: HeroesServiceMock
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('goToListPage should navigate to List Page', () => {
    const routerstub: Router = TestBed.inject(Router);

    spyOn( routerstub, 'navigate' );
    component.goToListPage();

    expect ( routerstub.navigate ).toHaveBeenCalledWith(['heroes/lista']);
  });

  it('ngOnInit should show hero data', fakeAsync(() => {
    spyOn(component['heroesService'], 'getHeroById').and.callThrough();

    component.ngOnInit();
    tick();

    expect(component.hero).toEqual(heroMocked);
  }));

});
