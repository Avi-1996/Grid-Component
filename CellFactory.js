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

    this.addRowHeader(header);
    //
    for (const col of columns) {
      cellDiv = createEl("div", {
        classList: "bs bsCell colH",
        textContent: col.header,
      });

      this.defineStyle(cellDiv, { width: col.width ? col.width : 112 });

      header.appendChild(cellDiv);
    }
    outerDiv.appendChild(header);
    let dataTableGrid = createEl("div", { classList: "dataTableGrid" });

    this.drawChunk(20, 0, dataTableGrid);

    dataTableGrid.style.height = this.dataTable.length * 20;
    outerDiv.appendChild(dataTableGrid);
    this.host.appendChild(outerDiv);
    // this.refresh(dataTableGrid);
  }

  drawChunk(rowCount, fromRow, dataTableGrid) {
    let rowDiv, cellDiv;
    let { columns } = this.options;
    if (rowCount <= this.dataTable.length) {
      dataTableGrid.innerHTML = "";
      let height = this.host.style.height;

      for (
        let i = fromRow;
        i < parseInt(height.slice(0, height.length - 2) / 20);
        i++
      ) {
        rowDiv = this.createEl("div", { classList: "bs bsRow" });
        this.addRowHeader(rowDiv);
        for (const col of columns) {
          cellDiv = this.createEl("div", {
            classList: "bs bsCell",
            textContent: this.dataTable[i][col.binding],
          });
          this.defineStyle(cellDiv, {
            width: col.width,
            height: this.dataTable[i].height,
          });
          rowDiv.appendChild(cellDiv);
        }

        dataTableGrid.appendChild(rowDiv);
      }
    }
  }

  createEl(tagName, options = {}) {
    return Object.assign(document.createElement(tagName), options);
  }

  createDataSource() {
    let self = this;
    let { columns, dataSource } = self.options;
    let internalDataTable = [];

    columns.map((col) => {
      col.width = col.width ? col.width : self.settings.colWidth;
    });

    dataSource.forEach((rowItem) => {
      rowItem.height = self.basicCellSyle.rowHeight;
      internalDataTable.push(rowItem);
    });

    return internalDataTable;
  }

  addRowHeader(header) {
    let cellDiv;
    for (let i = 0; i < this.rowHeaderPanelCount; i++) {
      cellDiv = this.createEl("div", {
        classList: "bs bsCell rowH",
        textContent: "",
      });
      this.defineStyle(cellDiv, {
        height: this.basicCellSyle.height,
        width: 20,
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
    //console.log(this.dataArray)
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

  getDataItem(row) {}
}

console.log(new CellArray(2, 2));
