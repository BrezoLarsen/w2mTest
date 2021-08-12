import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, switchMap, take, takeUntil } from 'rxjs/operators';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { Hero, Publisher, PublisherEnum } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  public publishers: Publisher[] = [
    {
      id: 'DC Comics'
    },
    {
      id: 'Marvel Comics'
    }
  ]

  public hero = {} as Hero;

  public heroForm: FormGroup = null;
  public showLoading = false;

  public get isCreating(): boolean {
    return !this._id;
  }

  public get title(): string {
    return this.isCreating ? 'Nuevo héroe:' : 'Editar héroe:'
  }

  private _id: string;
  private _ngUnsuscribe: Subject<void> = new Subject<void>();

  constructor (
    private heroesService: HeroesService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initHeroForm();
    this._id = this.activatedRouter.snapshot.params['id'];

    if (this.isCreating) return;
      this.activatedRouter.params
        .pipe(switchMap( ({id}) => this.heroesService.getHeroById(id)))
        .pipe(take(1))
        .subscribe((hero) => {
          this.hero = hero
          this.patchFormValues(this.hero);
        });
      }

  ngOnDestroy(): void {
    this._ngUnsuscribe.next();
    this._ngUnsuscribe.complete();
  }

  public goToListPage() {
    this.router.navigate(['heroes/lista'])
  }

  public save() {
    this.showLoading = true;

    if (this.hero.id) {
      this.heroesService.updateHero(this.heroForm.value)
        .pipe(finalize(() => this.finalizeSubscription()))
        .subscribe();
    } else {
      this.heroesService.addHero(this.heroForm.value)
        .pipe(finalize(() => this.showLoading = false))
        .subscribe(hero => this.router.navigate(['/heroes/detalle/', hero.id]));
    }
  }

  public isValid(field) {
    return this.heroForm.controls[field].errors && this.heroForm.controls[field].touched;
  }

  public openConfirmDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete();
      }
    });
  }

  private delete() {
    this.showLoading = true;
    this.heroesService.deleteHeroById(this.hero.id)
        .pipe(finalize(() => this.showLoading = false))
        .subscribe(hero => this.router.navigate(['/heroes/lista']));
  }

  private initHeroForm() {
    this.heroForm = this.formBuilder.group({
      superhero: [ '', [Validators.required, Validators.minLength(3)] ],
      alterEgo: [ '', Validators.required ],
      firstAppearance: [ '', Validators.required ],
      characters: [ '', Validators.required ],
      publisher: [ '', Validators.required ]
    });
  }

  private patchFormValues(hero: Hero) {
    this.heroForm.patchValue({
      superhero: hero.superhero,
      alterEgo: hero.alterEgo,
      firstAppearance: hero.firstAppearance,
      characters: hero.characters,
      publisher: hero.publisher
    });
  }

  private finalizeSubscription() {
    this.showLoading = false;
    this.snackBar.open('Editado con éxito!', 'Ok!', {duration: 3000});
  }
}
