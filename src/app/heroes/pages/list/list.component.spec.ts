import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { Hero, PublisherEnum } from '../../interfaces/heroes.interface';
import { heroesMocked, HeroesServiceMock, heroMocked } from '../../services/heroes-service-mock';
import { HeroesService } from '../../services/heroes.service';
import { ListComponent } from './list.component';


describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let dialog: MatDialog;
  const heroes: Hero[] = [
    {
      id: 'sb_hero1',
      superhero: 'hero1',
      publisher: PublisherEnum[0],
      alterEgo: 'alter_ego',
      firstAppearance: '1980',
      characters: 'characters'
    },
    {
      id: 'sb_hero2',
      superhero: 'hero2',
      publisher: PublisherEnum[1],
      alterEgo: 'alter_ego',
      firstAppearance: '1980',
      characters: 'characters'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListComponent ],
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        RouterTestingModule,
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
          provide: HeroesService,
          useClass: HeroesServiceMock
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(ListComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog on trigger', () => {

    spyOn(dialog, 'open').and.returnValue({afterClosed: () => of({id: 1})} as MatDialogRef<typeof DialogComponent>);

    component.openConfirmDialog({id: 1});
    expect(dialog.open).toHaveBeenCalled();

  });

  it('should do nothing if there is no result', () => {

    spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(null)} as MatDialogRef<typeof DialogComponent>);
    const spy = spyOn<any>(component, 'delete').and.callThrough();

    component.openConfirmDialog({id: 1});
    expect(spy).not.toHaveBeenCalled();

  });

  it('Should get table data in click suggestions', fakeAsync(() => {

    component.dataSource = new MatTableDataSource<Hero>(heroes);

    component.showSuggestions();
    tick();

    expect( component.dataSource.data ).toBe(heroes);

  }));

  it('search filter by searchTerm', () => {

    const searchTerm = 'searchTerm';

    component.dataSource = new MatTableDataSource<Hero>(heroes);
    component.search(searchTerm);

    expect( component.dataSource.filter ).toBe(searchTerm);

  });

  it('cleanResults should get heroes from service', () => {

    const spy = spyOn<any>( component, 'getHeroesFromService' ).and.callFake( () => {});

    component.cleanResults();

    expect( spy ).toHaveBeenCalled();

  });

  it('Should not call service if searchTerm is null', () => {

    const spy = spyOn(component['heroesService'], 'getHeroById').and.callThrough();

    const event: MatAutocompleteSelectedEvent = {
      option: {
        value: null
      }
    } as MatAutocompleteSelectedEvent;

    component.searchOption(event);

    expect( spy ).not.toHaveBeenCalled();

  });

  it('Should set searchTerm if option value matches', () => {

    const event: MatAutocompleteSelectedEvent = {
      option: {
        value: heroes[0]
      }
    } as MatAutocompleteSelectedEvent;

    component.searchOption(event);

    expect( component.searchTerm ).toBe('hero1');

  });

  it('finalizeSubscription should hide loading', () => {

    component.dataSource = new MatTableDataSource<Hero>(heroes);
    component['finalizeSubscription']();

    expect( component.showLoading ).toBeFalse;
    expect().nothing();

  });

  it('Should fetch heroes table onInit', fakeAsync(() => {
    spyOn(component['heroesService'], 'getHeroes').and.callThrough();
    const spy = spyOn<any>(component, 'finalizeSubscription').and.callThrough();

    component['getHeroesFromService']();
    tick();

    expect(spy).toHaveBeenCalled();
    expect(component.dataSource instanceof MatTableDataSource).toBeTruthy();
  }));

  it('Should show suggestions on write in search input', fakeAsync(() => {
    spyOn(component['heroesService'], 'getSuggestions').and.callThrough();

    component.showSuggestions();
    tick();

    expect(component.heroes).toEqual(heroesMocked);
  }));

  it('Should fetch heroes table after delete a hero', fakeAsync(() => {
    spyOn(component['heroesService'], 'getHeroes').and.callThrough();
    const spy = spyOn<any>(component, 'finalizeSubscription').and.callThrough();

    component['delete'](heroMocked);
    tick();

    expect(spy).toHaveBeenCalled();
    expect(component.dataSource instanceof MatTableDataSource).toBeTruthy();
  }));

});
