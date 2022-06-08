import { Component, ChangeDetectorRef } from '@angular/core';
import { Tabulator } from 'tabulator-tables';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {

  // Variables to configure the grid: Begin
  public tableData: any[];
  public columnConfig: any[];
  public dateFormat: string = 'DD/MM/YYYY';
  // Variables to configure the grid: End

  // Variable to show updates
  public updateInfo: string = '{{nothing yet}}';

  constructor(private changeRef: ChangeDetectorRef) {
    this.columnConfig = [
      { title: "Name", field: "name", width: 150, editor: "input" },
      { title: "Location", field: "location", width: 130, editor: "autocomplete", editorParams: { allowEmpty: true, showListOnEmpty: true, values: true } },
      { title: "Progress", field: "progress", sorter: "number", hozAlign: "left", formatter: "progress", width: 140, editor: true },
      { title: "Gender", field: "gender", width: 90, editor: "list",
        editorParams: {
          values: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "unknown", label: "Unknown" }
          ]
        }
      },
      { title: "Rating", field: "rating", formatter: "star", hozAlign: "center", width: 100, editor: true },
      { title: "Date Of Birth", field: "dob", hozAlign: "center", sorter: "date", width: 140 },
      { title: "Driver", field: "car", width: 80, hozAlign: "center", editor: true, formatter: "tickCross" }
    ];
    this.tableData = [
      { id: 1, name: "Oli Bob", progress: 12, location: "United Kingdom", gender: "male", rating: 1, col: "red", dob: "14/04/1984", car: 1, lucky_no: 5, lorem: "Lorem ipsum dolor sit amet, elit consectetur adipisicing " },
      { id: 2, name: "Mary May", progress: 1, location: "Germany", gender: "female", rating: 2, col: "blue", dob: "14/05/1982", car: true, lucky_no: 10, lorem: "Lorem ipsum dolor sit amet, elit consectetur adipisicing " },
      { id: 3, name: "Christine Lobowski", progress: 42, location: "France", gender: "female", rating: 0, col: "green", dob: "22/05/1982", car: "true", lucky_no: 12, lorem: "Lorem ipsum dolor sit amet, elit consectetur adipisicing " },
      { id: 4, name: "Brendon Philips", progress: 100, location: "USA", gender: "male", rating: 1, col: "orange", dob: "01/08/1980", lucky_no: 18, lorem: "Lorem ipsum dolor sit amet, elit consectetur adipisicing " },
      { id: 5, name: "Margret Marmajuke", progress: 16, location: "Canada", gender: "female", rating: 5, col: "yellow", dob: "31/01/1999", lucky_no: 33, lorem: "Lorem ipsum dolor sit amet, elit consectetur adipisicing " },
      { id: 6, name: "Frank Harbours", progress: 38, location: "Russia", gender: "male", rating: 4, col: "red", dob: "12/05/1966", car: 1, lucky_no: 2, lorem: "Lorem ipsum dolor sit amet, elit consectetur adipisicing " },
      { id: 7, name: "Jamie Newhart", progress: 23, location: "India", gender: "male", rating: 3, col: "green", dob: "14/05/1985", car: true, lucky_no: 63, lorem: "Lorem ipsum dolor sit amet, elit consectetur adipisicing " },
      { id: 8, name: "Gemma Jane", progress: 60, location: "China", gender: "female", rating: 0, col: "red", dob: "22/05/1982", car: "true", lucky_no: 72, lorem: "Lorem ipsum dolor sit amet, elit consectetur adipisicing " },
      { id: 9, name: "Emily Sykes", progress: 42, location: "South Korea", gender: "female", rating: 1, col: "maroon", dob: "11/11/1970", lucky_no: 44, lorem: "Lorem ipsum dolor sit amet, elit consectetur adipisicing " },
      { id: 10, name: "James Newman", progress: 73, location: "Japan", gender: "male", rating: 5, col: "red", dob: "22/03/1998", lucky_no: 9, lorem: "Lorem ipsum dolor sit amet, elit consectetur adipisicing " },
    ];
  }

  public onCellChanged(data: Tabulator.CellComponent) {
    var colName: string = data.getColumn().getField();
    var newRowData: any = data.getRow().getData();
    var sInfo: string = 'Change for "' + newRowData['name'] + '" (id=' + newRowData['id'] + '): Field [' + colName + '] Changed to ' + newRowData[colName];
    console.log(sInfo);
    this.updateInfo = sInfo;
    this.changeRef.detectChanges();
  }
}
