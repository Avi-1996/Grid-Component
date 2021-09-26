

export class CellFactory {
  options: {
    columns: [],
    dataSource: []
  }
  dataTable: []
  host: HTMLElement
  rowHeaderPanelCount: number
  internalElements: CellArray
  basicCellSyle: {
    width: number,
    height: number,
    boxSizing: string,
  };
  constructor(options, host) {
    this.host = host;
    this.options = options;

    this.rowHeaderPanelCount = options.rowHeaderCount || 1;

    this.basicCellSyle = {
      width: 112,
      height: 20,
      boxSizing: "border-box",
    };

    this.dataTable = this.createDataSource();

    this.internalElements = new CellArray(this.getNumberOfRowsToVisble(), this.options.columns.length)
    window.I = this.internalElements
  }

  draWGrid() {
    let { createEl } = this;
    let { columns } = this.options;
    let outerDiv = this.defineStyle(
      createEl("div", { classList: "bs-grid outer" }),
      { width: this.basicCellSyle.width * this.options.columns.length }
    );
    let rowDiv, cellDiv;

    // addHeader
    let header = createEl("div", { classList: "bs colHeader" });

    this.addRowHeader(header, 0);

    let topleftPanel = createEl("div", { classList: "bs bs-top-panel" });
    //adding the tope left corner
    let leftCorner = createEl("div", { classList: "bs bsCell topLeft" });
    this.defineStyle(leftCorner, {
      position: "absolute",
      left: 0,
      width: "20px",
      height: "20px",
    });

    topleftPanel.appendChild(leftCorner);
    header.appendChild(topleftPanel);
    let left = 20;

    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const col = columns[colIndex];
      cellDiv = createEl("div", {
        classList: "bs bsCell colH",
        textContent: col.header,
      });

      this.defineStyle(cellDiv, {
        width: col.width ? col.width : 112,
        position: "absolute",
        height: 20 + "px",
        top: "0px",
        left: left + "px",
      });
      left += col.width;
      header.appendChild(cellDiv);
    }
    outerDiv.appendChild(header);
    let dataTableGrid = createEl("div", { classList: "dataTableGrid" });

    dataTableGrid.style.height = this.dataTable.length * 20;

    outerDiv.appendChild(dataTableGrid);
    this.drawChunk(0, this.getNumberOfRowsToVisble(), outerDiv, null, 0);
    this.host.appendChild(outerDiv);
    // this.refresh(dataTableGrid);
  }

  createRows(desposedRows: number, bottomRow) {
    let { columns } = this.options
    let el, left = 20;
    let cellArr = [];
    for (let i = bottomRow + 1; i < desposedRows + bottomRow + 1; i++) {
      left = 20

      for (let j = 0; j < columns.length; j++) {
        let cellClass = "bs bsCell " + ((i%2 ===0) ? "even" : "odd");
        el = this.createEl("div", { classList: cellClass });
        this.defineStyle(el, {width: columns[j].width, top: (i * 20) + "px", left: left })
        left += columns[j].width;
        cellArr.push(el)
      }
    }
    return cellArr;
  }

  drawChunk(fromRow: number, rowCount: number, grid: HTMLElement, viewport?, pixelScrolled?: number, isUpScroll?: number) {
    let rowDiv, cellDiv;

    let dataTableGrid = grid.querySelector(".dataTableGrid");
    let { columns } = this.options;
    let visibleRows = this.getNumberOfRowsToVisble();
    pixelScrolled = Math.floor(pixelScrolled);
    if (viewport && pixelScrolled > 20) {
      let disposedRows = Math.floor(pixelScrolled / 20);
      debugger
      let rows = this.createRows(disposedRows, Math.floor(viewport.currentBottomRowIndex))
      this.host.querySelector(".dataTableGrid")

      this.internalElements.deleteRows(disposedRows, true);
      this.internalElements.insertRows((rows as []), false);

      debugger
   //   this.insertToData(this.internalElements.dataArray.length - 1, rows)
      // this.internalElements.dataArray.splice(this.internalElements.dataArray.length - 1, 0, ...rows)
      debugger;
      this.refresh(false, disposedRows )
      this.updateCellContent(viewport.currentTopRowIndex + disposedRows, visibleRows)

    viewport.currentBottomRowIndex += disposedRows;
    viewport.currentTopRowIndex += disposedRows;
    }


    if ((fromRow + visibleRows <= this.dataTable.length) && pixelScrolled === 0 && !isUpScroll) {
      dataTableGrid.innerHTML = ""
      dataTableGrid.appendChild(this.addRowPanel(fromRow, rowCount, 1));
      for (let i = fromRow, iRow = 0; i < fromRow + rowCount; i++, iRow++) {
        rowDiv = this.createEl("div", { classList: "bs bsRow" });
        let left = 20;

        for (let colIndex = 0; colIndex < columns.length; colIndex++) {
          const col = columns[colIndex];
          cellDiv = this.internalElements.getData(iRow, colIndex);
          if (cellDiv) {
            this.defineStyle(cellDiv, {
              width: col.width + "px",
              height: this.dataTable[i].height + "px",
              postition: "absolute",
              top: i * 20 + 20 + "px",
              left: left + "px",
            });

            left += col.width;

            rowDiv.appendChild(cellDiv);
          }

        }
        dataTableGrid.appendChild(rowDiv);
      }

      this.updateCellContent(fromRow, rowCount);
    }
  }

  addRowPanel(fromRow, rowCount, colCount) {
    let rowHCell, rowDiv;
    let rowHPanel = this.createEl("div", {
      classList: "bs bsrowH",
    });
    for (let row = fromRow; row < fromRow + rowCount; row++) {
      rowDiv = this.createEl("div", {
        classList: "bs rowH",
        textContent: "",
      });
      for (let col = 0; col < colCount; col++) {
        rowHCell = this.createEl("div", {
          classList: "bs bsCell rowH",
          textContent: "",
        });
        this.defineStyle(rowHCell, {
          height: this.basicCellSyle.height,
          width: 20,
          position: "absolute",
          top: row * 20 + 20 + "px",
        });
        rowDiv.appendChild(rowHCell);
      }

      rowHPanel.appendChild(rowDiv);
    }
    return rowHPanel;
  }

  insertToData(rowArr) {
    let internalEls = this.internalElements.dataArray;
    for (let i = 0; i < rowArr; i += this.options.columns.length) {
    }
  }

  refresh(isFromUp, rowCount){
    debugger
    let rowDiv;
    let dataTableGrid = this.host.querySelector(".dataTableGrid");
    for (let row = isFromUp?0: this.internalElements.rowCount - rowCount, iRow = 0; iRow < rowCount; row++, iRow++) {
      rowDiv = this.createEl("div",{classList:"bs bsRow"})
        for (let col = 0; col < this.options.columns.length; col++) {
          // console.log(this.internalElements.getData(row, col),row,col);
          rowDiv.appendChild(this.internalElements.getData(row, col))
        }
        dataTableGrid.appendChild(rowDiv)
      }
  }

  updateCellContent(fromRow, rowCount) {
    let i = 0;
    let top = 20;
    let visibleRows = this.getNumberOfRowsToVisble() - fromRow;
    let rowDiv;
    let cellDiv;
    let dataTableGrid = this.host.querySelector(".dataTableGrid");
    debugger
    for (let row = fromRow, iRow = 0; iRow < rowCount; row++, iRow++) {
    rowDiv = this.createEl("div",{classList:"bs bsRow"})
      for (let col = 0; col < this.options.columns.length; col++) {
        this.internalElements.setData(iRow, col, (cellDiv) => {
          if (cellDiv) {
            const columnItem = this.options.columns[col];

            cellDiv.textContent = this.dataTable[row][columnItem.binding];
          }
        })
      }
    }
  }

  createEl(tagName, options = {}) {
    return Object.assign(document.createElement(tagName), options);
  }

  updateCell(row, col) { }

  createDataSource() {
    let self = this;
    let { columns, dataSource } = self.options;
    let internalDataTable = [];


    columns.map((col: any) => {
      col.width = col.width ? col.width : this.basicCellSyle.width;
    });

    dataSource.forEach((rowItem: any, rowIndex: number) => {
      rowItem.height = self.basicCellSyle.height;
      rowItem.element = {};
      internalDataTable.push(rowItem);
    });


    return internalDataTable;
  }

  addRowHeader(header, rowIndex) {
    let cellDiv;
    for (let i = 0; i < this.rowHeaderPanelCount; i++) {
      cellDiv = this.createEl("div", {
        classList: "bs bsCell rowH",
        textContent: "",
      });
      this.defineStyle(cellDiv, {
        height: this.basicCellSyle.height,
        width: 20,
        position: "absolute",
        top: rowIndex * 20 + "px",
      });
      header.appendChild(cellDiv);
    }
  }

  defineStyle(el, stylInfo = {}) {
    Object.keys(stylInfo).forEach((styleProp) => {
      el.style[styleProp] = stylInfo[styleProp];
    });
    return el;
  }

  getNumberOfRowsToVisble(): number {
    let height = Math.floor(this.host.getBoundingClientRect().height - 20);
    return height / 20;
  }
}

class CellArray {
  rowCount: number
  colCount: number
  dataArray: []
  constructor(rowCount, colCount) {
    this.rowCount = rowCount;
    this.colCount = colCount;

    this.dataArray = ((): [] => {
      let arr = new Array(rowCount * colCount).fill(null),
        length = rowCount * colCount;
      let cellDiv: HTMLElement = null

      for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
          cellDiv = this.createEl("div", {
            classList: "bs bsCell" + (row % 2 == 0 ? " even" : " odd"),
          });
          arr[row * colCount + col] = cellDiv;

        }
      }
      return arr;
    })();
  }

  createEl(tagName, options = {}) {
    return Object.assign(document.createElement(tagName), options);
  }
  getData(row, col) {
    return this.dataArray[row * this.colCount + col ];
  }
  setData(row, col, callback) {
    let item = this.dataArray[row * this.colCount + col];
    if (callback instanceof Function) {

      callback(item);
    } else {
      this.dataArray[row * this.colCount + col] = callback;
    }
  }
  deleteRows(noOFRowsTodelete, fromBeg) {
  let row = fromBeg ? 0 : this.dataArray.length - (noOFRowsTodelete * this.colCount);
  for (let i = row; i < noOFRowsTodelete * this.colCount  ; i+=this.colCount) {
    (this.dataArray[i] as HTMLElement).parentElement.remove()
    this.dataArray.splice(i,this.colCount);

  }
}



  

  insertRows(rowArrayToInsert: [], fromBeg: boolean) {
    let row = fromBeg ? 0 : this.dataArray.length
if(fromBeg)
(this.dataArray as any)= [].concat(rowArrayToInsert,this.dataArray)
else{
  (this.dataArray as any)= [].concat(this.dataArray,rowArrayToInsert)
}

  }


  shiftRow(row, toRow) {
    let sliced = this.dataArray.splice(row, this.colCount)
    this.dataArray.splice(toRow - this.colCount, 0, ...sliced)
  }

  getDataItem(row) { }
}
