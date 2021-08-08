import { Component, OnInit, ViewChild } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/heroes.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { finalize, switchMap } from 'rxjs/operators';


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
  public displayedColumns: string[] = ['name', 'alter_ego', 'publisher', 'first_appearance', 'characters', 'acctions'];
  public loading = false;

  public searchTerm: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private heroesService: HeroesService) { }

  ngOnInit(): void {
    this.loading = true;
    this.getHeroesFromService();
    console.log(this.dataSource)
  }

  showSuggestions() {
    this.heroesService.getSuggestions(this.searchTerm)
    .subscribe(heroes => this.heroes = heroes);
    console.log(this.searchTerm)
  }

  search(searchTerm: string) {
    this.dataSource.filter = searchTerm;
  }

  searchOption(event: MatAutocompleteSelectedEvent) {
    const hero: Hero = event.option.value;
    this.searchTerm = hero.superhero;
    this.heroesService.getHeroById(hero.id)
      .pipe(switchMap(hero => this.dataSource.filter = hero.id))
      .subscribe();
  }

  cleanResults() {
    this.getHeroesFromService();
    console.log(this.dataSource)
    this.searchTerm = '';
  }

  goToEdit(clickedRow: Hero): void {
    console.log('EDIT ', clickedRow.id)
  }

  delete(clickedRow: Hero): void {
    console.log('DELETE ', clickedRow.id)
  }

  private getHeroesFromService() {
    this.heroesService.getHeroes()
      .pipe(finalize(() => this.finalizeSubscription()))
      .subscribe(heroes => this.dataSource = new MatTableDataSource<Hero>(heroes));
  }

  private finalizeSubscription(): void {
    this.loading = false;
    this.dataSource.paginator = this.paginator;
  }
}
