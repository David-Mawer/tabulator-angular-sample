import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module'; // CLI imports AppRoutingModule

import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { TabulatorGridComponent } from './tabulator-grid/tabulator-grid.component';


@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    TabulatorGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule // CLI adds AppRoutingModule to the AppModule's imports array
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
