export interface Hero {
  id?: string;
  superhero: string;
  publisher: PublisherEnum;
  alterEgo: string;
  firstAppearance: string;
  characters: string;
}

export interface Publisher {
  id: string;
}

export enum PublisherEnum {
  DCComics = 'DC Comics',
  MarvelComics = 'Marvel Comics'
}
