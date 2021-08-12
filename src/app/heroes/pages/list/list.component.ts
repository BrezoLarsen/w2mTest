import { Component, OnInit, ViewChild } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/heroes.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { finalize, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public heroes: Hero[] = [];
  public searchResults: Hero[] = [];
  public heroSelected: Hero;
  public dataSource: MatTableDataSource<Hero>;
  public displayedColumns: string[] = ['name', 'alterEgo', 'publisher', 'firstAppearance', 'characters', 'acctions'];
  public showLoading = false;

  public searchTerm: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private heroesService: HeroesService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.showLoading = true;
    this.getHeroesFromService();
  }

  public showSuggestions() {
    this.heroesService.getSuggestions(this.searchTerm)
    .subscribe(heroes => this.heroes = heroes);
  }

  public search(searchTerm: string) {
    this.dataSource.filter = searchTerm;
  }

  public searchOption(event: MatAutocompleteSelectedEvent) {

    if (!event.option.value) return;

    const hero: Hero = event.option.value;
    this.searchTerm = hero.superhero;
    this.heroesService.getHeroById(hero.id)
      .pipe(switchMap(hero => this.dataSource.filter = hero.id))
      .subscribe();
  }

  public cleanResults() {
    this.getHeroesFromService();
    this.searchTerm = '';
  }

  public openConfirmDialog(clickedRow) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(clickedRow);
      }
    });
  }

  private delete(clickedRow: Hero) {
    this.showLoading = true;
    this.heroesService.deleteHeroById(clickedRow.id)
      .pipe(finalize(() => this.showLoading = false))
      .subscribe(() => this.getHeroesFromService());
    }

  private getHeroesFromService() {
    this.heroesService.getHeroes()
      .pipe(finalize(() => this.finalizeSubscription()))
      .subscribe(heroes => this.dataSource = new MatTableDataSource<Hero>(heroes));
  }

  private finalizeSubscription(): void {
    this.showLoading = false;
    this.dataSource.paginator = this.paginator;
  }
}
