import { Component, ElementRef, ViewChild, OnChanges, Input, SimpleChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
// tabular grid: https://github.com/olifolkerd/tabulator
import { CellComponent, ColumnComponent, RowComponent, TabulatorFull } from 'tabulator-tables';
import * as moment from 'moment';

/*
 * So - the whole point of TypeScript is to make things strictly typed.
 *
 * At the moment the input parameters (for column definitions and data) are not typed.
 *
 * Also - the events are not typed.
 *
 * So - if you want - then you can make types for things like tableData (then it will be a typed array).
 * The variables are well documented here: http://tabulator.info/docs/4.2/options
 *  (immediately after the overview at the top of the page)
 *
 */
@Component({
  selector: 'app-tabulator-grid',
  templateUrl: './tabulator-grid.component.html',
  styleUrls: ['./tabulator-grid.component.scss']
})
export class TabulatorGridComponent implements OnChanges, OnDestroy {
  @ViewChild('tabularGridWrapper', { static: true }) wrapperDiv!: ElementRef<HTMLDivElement>;

  @Input() tableData: any[] = [];
  @Input() columnConfig: any[] = [];
  @Input() dateFormat: string = '';
  @Input() height: string = ''; // default is to auto-adjust height with the grid contents.
  // These are for passing grid events back to the parent component.
  @Output() buildingTable = new EventEmitter<void>();
  @Output() builtTable = new EventEmitter<void>();
  @Output() loadingData = new EventEmitter<any[]>();
  @Output() loadedData = new EventEmitter<any[]>();
  @Output() cellChanged = new EventEmitter<CellComponent>();

  // private variables for keeping track of the table.
  private tableDiv = document.createElement('div'); // this is the div that will contain that tabulator-grid HTML.
  private myTable: any; // this will become a reference to the tabulator-grid object
  private gridClosing: boolean = false;

  constructor() {
    // Default the date format if it was not specified.
    this.dateFormat = this.dateFormat || 'DD MMM YYYY';
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Configure the grid with whatever changes are made by the calling component.
    //  (this code also initialises the grid)
    this.drawTable(changes);
  }

  ngOnDestroy(): void {
    this.gridClosing = true;
    // Not sure if this is necessary - but remove all rows and columns from the grid.
    if (this.myTable) {
      this.myTable.setData([]);
      this.myTable.setColumns([]);
    }
  }

  private drawTable(changes: SimpleChanges): void {
    if ((this.gridClosing) || (!this.columnConfig)) {
      return;
    }
    // Re-route date sorting and editing to local overrides.
    //  (allows Angular to decide how/when the moment library is in use)
    this.fastForEach(this.columnConfig, colConfigEntry => {
      if (colConfigEntry.sorter == "date") {
        colConfigEntry.sorter = this.dateSorter.bind(this);
        colConfigEntry.editor = this.dateEditor.bind(this);
      }
    });

    // create the table if necessary - update it if it exists already.
    if (!this.myTable) {

      // create the table with the given Angular parameters
      // for details about the Tabulator parameters - check http://tabulator.info/docs/4.2/options
      this.myTable = new TabulatorFull(this.tableDiv, {
        data: this.tableData || [],
        reactiveData: true, // enable data reactivity - means that array content changes get reflected by the grid (without Angular having to worry)
        columns: this.columnConfig,
        layout: 'fitData',
        height: this.height,
      });
      // Capture some of the events and pass them back to the declaring code.
      // http://tabulator.info/docs/5.0/events
      this.myTable.on('tableBuilding', this.tableBuilding.bind(this));
      this.myTable.on('tableBuilt', this.tableBuilt.bind(this));
      this.myTable.on('cellEdited', this.cellEdited.bind(this));
      this.myTable.on('dataLoading', this.dataLoading.bind(this));
      this.myTable.on('dataLoaded', this.dataLoaded.bind(this));
      this.wrapperDiv.nativeElement.appendChild(this.tableDiv);

    } else {
      // Check what changed, and only update that stuff
      if (changes['columnConfig']) {
        this.myTable.setColumns(this.columnConfig);
      }
      if (changes['tableData']) {
        this.myTable.setData(this.tableData);
      }

    }
  }


  //////////////////////////////////////////////////////////////////
  // Passing grid events to the component that has the grid: Begin
  private tableBuilding() {
    this.buildingTable.emit();
  }
  private tableBuilt() {
    this.builtTable.emit();
  }
  private cellEdited(cell: CellComponent) {
    //cell - cell 
    this.cellChanged.emit(cell);
  }
  private dataLoading(data: any[]) {
    //data - the data loading into the table
    this.loadingData.emit(data);
  }
  private dataLoaded(data: any[]) {
    //data - the data loading into the table
    this.loadedData.emit(data);
  }
  // Passing grid events to the component that has the grid: End
  //////////////////////////////////////////////////////////////////


  //////////////////////////////////////////////////////////////////
  // Date Handling: Begin
  private dateSorter(a: any, b: any,
    aRow: RowComponent, bRow: RowComponent, column: ColumnComponent,
     dir: any, sorterParams: any) {
    //a, b - the two values being compared
    //aRow, bRow - the row components for the values being compared (useful if you need to access additional fields in the row data for the sort)
    //column - the column component for the column being sorted
    //dir - the direction of the sort ("asc" or "desc")
    //sorterParams - sorterParams object from column definition array
    var date1 = moment(a, this.dateFormat);
    var date2 = moment(b, this.dateFormat);
    return date1.diff(date2, "seconds"); // return the difference between the two dates
  }

  private dateEditor(cell: CellComponent, onRendered: Function, success: Function, cancel: Function) {
    //cell - the cell component for the editable cell
    //onRendered - function to call when the editor has been rendered
    //success - function to call to pass the successfuly updated value to Tabulator
    //cancel - function to call to abort the edit and return to a normal cell

    //create and style input
    var expectedDataFormat = this.dateFormat;
    var cellValue = moment(cell.getValue(), expectedDataFormat).format("YYYY-MM-DD");
    var input = document.createElement("input");

    input.setAttribute("type", "date");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    input.value = cellValue;

    onRendered(function () {
      input.focus();
      input.style.height = "100%";
    });

    function onChange() {
      if (input.value != cellValue) {
        var successValue = moment(input.value, "YYYY-MM-DD").format(expectedDataFormat);
        success(successValue);
      } else {
        cancel();
      }
    }

    //submit new value on blur or change
    input.addEventListener("blur", onChange);

    //submit new value on enter
    input.addEventListener("keydown", function (e) {
      if (e.key == 'Enter') {
        onChange();
      }

      if (e.key == 'Escape') {
        cancel();
      }
    });

    return input;
  }
  // Date Handling: End
  //////////////////////////////////////////////////////////////////

  // Generic logic - this could be moved to a common library if you want.
  // foreach using the fastest iterator in Javascript (the while loop)
  private fastForEach<T>(inArr: T[], execFunc: (element: T, i: number) => void): void {
    let i = 0;
    while (i < inArr.length) {
      execFunc(inArr[i], i);
      i++;
    }
  }

}
