export class CellFactory {
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
    //
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


    for (const [index, col] of columns.entries()) {
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
      left += col.width
      header.appendChild(cellDiv);
    }
    outerDiv.appendChild(header);
    let dataTableGrid = createEl("div", { classList: "dataTableGrid" });


    dataTableGrid.style.height = this.dataTable.length * 20;
    outerDiv.appendChild(dataTableGrid);
    this.drawChunk(this.host.getBoundingClientRect().height /20, 0, outerDiv);
    this.host.appendChild(outerDiv);
    // this.refresh(dataTableGrid);
  }

  drawChunk(rowCount, fromRow, grid) {
    //debugger
    let rowDiv, cellDiv;
    let dataTableGrid = grid.querySelector(".dataTableGrid")
    let { columns } = this.options;
    console.log(this.getNumberOfRowsToVisble()+1)
    if (fromRow < this.dataTable.length) {
      dataTableGrid.innerHTML = "";
      let height = this.host.style.height;
      dataTableGrid.appendChild(this.addRowPanel(fromRow, rowCount,1));
      for (let i = fromRow; i < fromRow + rowCount; i++) {
        rowDiv = this.createEl("div", { classList: "bs bsRow" });

        //  this.addRowHeader(rowDiv, i);
        let left = 20;
        for (const [index, col] of columns.entries()) {
          let isEven = i % 2 === 0 ? " even" : " odd";
          cellDiv = this.createEl("div", {
            classList: "bs bsCell" + isEven,
            textContent: this.dataTable[i][col.binding],
          });

          this.defineStyle(cellDiv, {
            width: col.width + "px",
            height: this.dataTable[i].height + "px",
            postition: "absolute",
            top: i * 20 + "px",
            left: left + "px",
          });
          left += col.width
          rowDiv.appendChild(cellDiv);
        }

        dataTableGrid.appendChild(rowDiv);
      }
    }
  }

  addRowPanel(fromRow, rowCount, colCount) {
    let rowHCell, rowDiv;
    let rowHPanel = this.createEl("div",
      {
        classList: "bs bsrowH"
      })
    for (let row = fromRow; row < fromRow + rowCount; row++) {
      rowDiv = this.createEl("div", {
        classList: "bs rowH",
        textContent: ""
      })
      for (let col = 0; col < colCount; col++) {
        rowHCell = this.createEl("div", {
          classList: "bs bsCell rowH",
          textContent: ""
        })
        this.defineStyle( rowHCell, {
          height: this.basicCellSyle.height,
          width: 20,
          position: "absolute",
          top: row * 20 + 20 + "px",
        });
        rowDiv.appendChild(rowHCell)

      }
  
      rowHPanel.appendChild(rowDiv)
    }
    // this.defineStyle(rowHPanel, { top: "20px" })
    return rowHPanel
  }
  updateCellContent(fromRow, rowCount) {

  }
  createEl(tagName, options = {}) {
    return Object.assign(document.createElement(tagName), options);
  }

  updateCell(cell, celltype, row, col) { }

  createDataSource() {
    let self = this;
    let { columns, dataSource } = self.options;
    let internalDataTable = [];

    columns.map((col) => {
      col.width = col.width ? col.width : self.settings.colWidth;
    });

    dataSource.forEach((rowItem) => {
      rowItem.height = self.basicCellSyle.height;
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

  
  getNumberOfRowsToVisble(iRow) {
    let height = this.host
      .getBoundingClientRect().height;
    return (height) / 20;
  }
}

class CellArray {
  constructor(rowCount, colCount) {
    this.rowCount = rowCount;
    this.colCount = colCount;

    this.dataArray = (() => {
      let arr = [],
        length = rowCount * colCount;
      while (length--) arr.push(null);
      return arr;
    })();

  }
  /*
1,2

 0 1 2 3 4  5    6   7  
[1,2,3,5,6,44, 55, 85]
   0    1    2
   ------------
0: 1    2    3 
1: 4    5    6 
2: 44  55   85
*/

  getData(row, col) {
    //return this.dataArray[(row*this.colCount) +col-1]
  }
  setData(row, col, data) {
    //this.dataArray[(row*this.colCount +col-1)] = data
  }

  getDataItem(row) { }
}
