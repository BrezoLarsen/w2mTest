# W2mTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.7.

## Development api

Navigate to server folder and run `json-server --watch db.json`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Dockerfile

Run `ng build` to build the project.
Run `docker image build -t example:spa .`


Run `docker container run -p 8080:80 --name example-container example:spa`

Navigate to `http://localhost:8080/`

