import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { Hero } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public heroes: Hero[] = [];
  public searchResults: Hero[] = [];
  public heroSelected: Hero;
  public dataSource: MatTableDataSource<Hero>;
  public displayedColumns: string[] = ['name', 'alterEgo', 'publisher', 'firstAppearance', 'characters', 'acctions'];
  public showLoading = false;
  public searchTerm = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _ngUnsuscribe: Subject<void> = new Subject<void>();

  constructor(
    private heroesService: HeroesService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.showLoading = true;
    this.getHeroesFromService();
  }

  ngOnDestroy(): void {
    this._ngUnsuscribe.next();
    this._ngUnsuscribe.complete();
  }

  public showSuggestions(): void {
    this.heroesService.getSuggestions(this.searchTerm)
      .pipe(takeUntil(this._ngUnsuscribe))
      .subscribe(heroes => this.heroes = heroes);
  }

  public search(searchTerm: string): void {
    this.dataSource.filter = searchTerm;
  }

  public searchOption(event: MatAutocompleteSelectedEvent): void {

    if (!event.option.value) { return; };

    const hero: Hero = event.option.value;
    this.searchTerm = hero.superhero;
    this.heroesService.getHeroById(hero.id)
      .pipe(switchMap(hero => this.dataSource.filter = hero.id))
      .pipe(takeUntil(this._ngUnsuscribe))
      .subscribe();
  }

  public cleanResults(): void {
    this.getHeroesFromService();
    this.searchTerm = '';
  }

  public openConfirmDialog(clickedRow): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(clickedRow);
      }
    });
  }

  private delete(clickedRow: Hero): void {
    this.showLoading = true;
    this.heroesService.deleteHeroById(clickedRow.id)
      .pipe(finalize(() => this.showLoading = false))
      .pipe(takeUntil(this._ngUnsuscribe))
      .subscribe(() => this.getHeroesFromService());
    }

  private getHeroesFromService(): void {
    this.heroesService.getHeroes()
      .pipe(finalize(() => this.finalizeSubscription()))
      .pipe(takeUntil(this._ngUnsuscribe))
      .subscribe(heroes => this.dataSource = new MatTableDataSource<Hero>(heroes));
  }

  private finalizeSubscription(): void {
    this.showLoading = false;
    this.dataSource.paginator = this.paginator;
  }
}
