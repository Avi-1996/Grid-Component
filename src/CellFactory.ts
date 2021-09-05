import "reflect-metadata";
export class CellFactory {
  internalElements: CellArray
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
    this.drawChunk(this.getNumberOfRowsToVisble(), 0, outerDiv);
    this.host.appendChild(outerDiv);
    // this.refresh(dataTableGrid);
  }

  drawChunk(rowCount, fromRow, grid) {
    let rowDiv, cellDiv;
    let dataTableGrid = grid.querySelector(".dataTableGrid");
    let { columns } = this.options;
    let visibleRows = this.getNumberOfRowsToVisble();
    if (fromRow + visibleRows <= this.dataTable.length) {
      dataTableGrid.innerHTML = "";
      dataTableGrid.appendChild(this.addRowPanel(fromRow, rowCount, 1));
      for (let i = fromRow; i < fromRow + rowCount; i++) {
        rowDiv = this.createEl("div", { classList: "bs bsRow" });
        let left = 20;
        for (let colIndex = 0; colIndex < columns.length; colIndex++) {
          const col = columns[colIndex];

          this.internalElements.setData(
            i,
            colIndex,
            (item) => (item.textContent = this.dataTable[i][col.binding])
          );

          cellDiv = this.internalElements.getData(i, colIndex);

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

  updateCellContent(fromRow, rowCount) {
    let i = 0;
    let top = 20;
    let visibleRows = this.getNumberOfRowsToVisble() - fromRow;

    let aboveDiv = this.internalElements.getData(fromRow - 1, 0);
    if (aboveDiv) {
      console.log(top * (fromRow + 1) + rowCount * 20);
      for (let colIndex = 0; colIndex < this.options.columns.length; colIndex++) {
        const col = this.options.columns[colIndex];
        this.internalElements.setData(fromRow - 1, colIndex, (item) => {

          item.style.top = top * (fromRow + 1) + visibleRows * 20;
        });
      }
    }
    let rows = fromRow;
    // while (i < fromRow) {
    //   for (const [colIndex, col] of this.options.columns.entries()) {
    //     this.internalElements.setData(i, colIndex, (item) => {
    //       if (
    //         item.style.top <
    //         this.internalElements.getData(i, colIndex).style.top
    //       ) {
    //         console.log("top=>", top + visibleRows * 20);
    //         item.style.top = top * (i + 1) + visibleRows * 20;
    //       }
    //     });
    //   }
    //   rows++;
    //   top += 20;
    //   i++;
    // }

    for (let rowIndex = fromRow; rowIndex < fromRow + rowCount; rowIndex++) {
      for (let colIndex = 0; colIndex < this.options.columns.length; colIndex++) {
        const col = this.options.columns[colIndex];
        let div = this.internalElements.getData(rowIndex, colIndex);
        this.internalElements.setData(rowIndex, colIndex, (item) => {
          item.textContent = this.dataTable[rowIndex][col.binding];
        });
      }
    }
  }

  createEl(tagName, options = {}) {
    return Object.assign(document.createElement(tagName), options);
  }

  updateCell(row, col) { }

  createDataSource() {
    let self = this;
    let cellDiv;
    let { columns, dataSource } = self.options;
    let internalDataTable = [];
    let internalElements = new CellArray(dataSource.length, columns.length);

    columns.map((col) => {
      col.width = col.width ? col.width : self.settings.colWidth;
    });

    dataSource.forEach((rowItem, rowIndex) => {
      rowItem.height = self.basicCellSyle.height;
      rowItem.element = {};

      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const col = columns[colIndex];
        let isEven = rowIndex % 2 === 0 ? " even" : " odd";
        cellDiv = this.createEl("div", {
          classList: "bs bsCell" + isEven,
        });
        internalElements.setData(rowIndex, colIndex, cellDiv);
      }
      internalDataTable.push(rowItem);
    });
    window.ie = internalElements;
    this.internalElements = internalElements;
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

    this.dataArray = (() => {
      let arr = [],
        length = rowCount * colCount;
      while (length--) arr.push(null);
      return arr;
    })();
  }

  getData(row, col) {
    return this.dataArray[row * this.colCount + col - 1];
  }
  setData(row, col, callback) {
    let item = this.dataArray[row * this.colCount + col - 1];
    if (callback instanceof Function) {

      callback(item);
    } else {
      this.dataArray[row * this.colCount + col - 1] = callback;
    }
  }

  getDataItem(row) { }
}
