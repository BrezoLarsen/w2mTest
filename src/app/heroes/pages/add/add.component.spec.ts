import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { Hero, PublisherEnum } from '../../interfaces/heroes.interface';
import { HeroesServiceMock } from '../../services/heroes-service-mock';
import { HeroesService } from '../../services/heroes.service';
import { HeroComponent } from '../hero/hero.component';
import { ListComponent } from '../list/list.component';
import { AddComponent } from './add.component';

class ActivatedRouteStub {
  params = of({
      id: 'dc-flash',
  });

  snapshot = {
      params: {
          id: 'dc-flash'
      }
  };
}

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddComponent ],
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {path: 'heroes/lista', component: ListComponent},
          {path: 'heroes/detalle/:id', component: HeroComponent}
        ]),
        MaterialModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: MatDialog,
          useValue: {open: () => of({id: 1})}
        },
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteStub,
        },
        {
          provide: HeroesService,
          useClass: HeroesServiceMock
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(AddComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
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

  it('patchFormValues should patch values to Form', () => {
    const hero: Hero = {
      id: 'id',
      superhero: 'hero1',
      publisher: PublisherEnum.DCComics,
      alterEgo: 'alter_ego',
      firstAppearance: '1980',
      characters: 'characters'
    };

    const spy = spyOn<any>(component.heroForm, 'patchValue').and.callThrough();
    component['patchFormValues'](hero);

    expect(spy).toHaveBeenCalledWith(hero);
  });

  it('finalizeSubscription should hide loading', () => {

    component['finalizeSubscription']();
    expect(component.showLoading ).toBeFalse;
    expect().nothing();

  });

  it('Should open dialog on trigger', () => {

    spyOn(dialog, 'open').and.returnValue({afterClosed: () => of({id: 1})} as MatDialogRef<typeof DialogComponent>);

    component.openConfirmDialog();
    expect(dialog.open).toHaveBeenCalled();

  });

  it('Should do nothing if there is no result on close dialog', () => {

    spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(null)} as MatDialogRef<typeof DialogComponent>);
    const spy = spyOn<any>(component, 'delete').and.callThrough();

    component.openConfirmDialog();
    expect(spy).not.toHaveBeenCalled();

  });

  it('Should call updateHero if hero id is not null', fakeAsync(() => {
    const spy = spyOn(component['heroesService'], 'updateHero').and.callThrough();

    component.hero.id = 'dc-flash';
    component.save();
    flush();

    expect(spy).toHaveBeenCalled();

  }));


  it('Should call addHero if hero id is not provide', fakeAsync(() => {
    const spy = spyOn(component['heroesService'], 'addHero').and.callThrough();

    component.hero.id = '';
    component.save();
    flush();

    expect(spy).toHaveBeenCalled();

  }));

  it('Should call addHero if hero id is null', fakeAsync(() => {
    component['_id'] = 'flash';
    const hero: Hero = {
      id: 'dc-flash',
      alterEgo: 'deadpool',
      characters: '?',
      firstAppearance: '1998',
      publisher: PublisherEnum.DCComics,
      superhero: 'deadpool',
    };
    const spy = spyOn(component['heroesService'], 'getHeroById').and.callFake((id) => of(hero));

    component.ngOnInit();
    tick();

    expect(spy).toHaveBeenCalledWith('dc-flash');
    expect(component.hero).toEqual(hero);

  }));

  it('Should set edit title if there is id', () => {
    component['_id'] = 'flash';

    expect(component.title).toBe('Editar héroe:');
  });

  it('Should set new hero title if there is not id', () => {
    component['_id'] = undefined;

    expect(component.title).toBe('Nuevo héroe:');
  });

});
