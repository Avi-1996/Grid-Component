import "reflect-metadata";
import "./basicGrid.css";

import { CellFactory } from "./CellFactory";
export class Grid implements GridStructure {
  host: HTMLElement
  settings: {
    colWidth: number,
    rowHeight: number,
    viewport: {
      currentTopRowIndex: number,
      currentLeftColIndex: number,
      currentTopY: number,
      currentLeftX: number,
    },
  }
  options: {
    dataSource: [], columns: [], rowHeaderCount: number,

  }
  basicCellSyle: {
    width: number,
    height: number,
    boxSizing: string,
  }
  cellFactory: CellFactory
  rowHeaderPanelCount: number
  selectedCell: HTMLElement

  constructor(host, options) {
    this.host = typeof host === "string" ? document.querySelector(host) : host;

    this.settings = {
      colWidth: 112,
      rowHeight: 20,
      viewport: {
        currentTopRowIndex: 0,
        currentLeftColIndex: 0,
        currentTopY: 0,
        currentLeftX: 0,
      },
    };

    this.options = this.defineBasicOptions(options);
    this.basicCellSyle = {
      width: 112,
      height: 20,
      boxSizing: "border-box",
    };

    this.cellFactory = new CellFactory(this.options, this.host);
    this.rowHeaderPanelCount = this.options.rowHeaderCount || 1;

    //  this.addRowHeader(this.host);

    this.cellFactory.draWGrid();
    this.addEvents(this.host.querySelector(".bs-grid.outer"));

    this.selectedCell = null;
  }

  defineStyle(el, stylInfo = {}) {
    Object.keys(stylInfo).forEach((styleProp) => {
      el.style[styleProp] = stylInfo[styleProp];
    });
    return el;
  }

  createEl(tagName, options = {}) {
    return Object.assign(document.createElement(tagName), options);
  }

  addEvents(host) {
    let self = (this as any);
    host.addEventListener("mousedown", function (e) {
      let { target } = e;
      let { classList } = target;
      if (classList.contains("bsCell") && !classList.contains("colH"))
        self.setActiveCell(e.target);
      var y = e.pageY - this.offsetTop;
      var x = e.pageX - this.offsetLeft;
      self.hitTest(x, y);
    });

    host.addEventListener("scroll", function (e) {
      //console.log(e.target.scrollTop);
      self.settings.viewport.currentTopRowIndex = Math.round(
        e.target.scrollTop / self.basicCellSyle.height
      );
      self.settings.viewport.currentBottomRowIndex = Math.round(
        e.target.scrollTop / self.basicCellSyle.height +
        self.getNumberOfRowsToVisble() -
        1
      );
      self.settings.viewport.currentTopY = e.target.scrollTop;
      self.settings.viewport.currentLeftX = e.target.scrollLeft;

      if (
        self.settings.viewport.currentBottomRowIndex <=
        (self.options.dataSource.length - 1)
      ) {


        self.cellFactory.drawChunk(
          self.getNumberOfRowsToVisble(),
          self.settings.viewport.currentTopRowIndex,
          self.host.querySelector(".bs-grid.outer")
        );
        // self.cellFactory.updateCellContent(
        //   self.settings.viewport.currentTopRowIndex,
        //   self.getNumberOfRowsToVisble()
        // );
        // console.log(
        //   "bottomRow==>",
        //   self.settings.viewport.currentBottomRowIndex
        // );
      }
    });

    host.addEventListener("mousemove", function (e) {
      var y = e.pageY - this.offsetTop;
      var x = e.pageX - this.offsetLeft;
      self.hitTest(x, y);
    });
  }

  setActiveCell(el) {
    if (this.selectedCell) {
      this.selectedCell.classList.remove("selected");
    }
    if (el) {
      el.classList.add("selected");
      this.selectedCell = el;
    }
  }

  defineBasicOptions(options) {
    return Object.assign(options, {
      selectedCellColor: "#0085c7",
      selectedCellForeColor: "white",
    });
  }

  startEdit(el) {
    this.setActiveCell(null);
    el.contentEditable = true;
    el.select();
  }

  refresh(dataTable) { }

  hitTest(x, y) {
    let { columns, dataSource } = this.options;
    let result = {};
    this.getVisibleRows(x, y);
    if (x < 20 && y > 20) {
      result.hitArea = "rowHeader";
    } else if (
      parseInt(x / 112) < columns.length &&
      parseInt(y / 20) < columns.length
    ) {
    }
  }

  getVisibleRows(x, y) {
    let hostInfo = this.host
      .querySelector(".bs-grid.outer")
      .getBoundingClientRect();
    let sheetArea;

    let row = 0,
      col = 0;
    y += this.settings.viewport.currentTopY;
    x += this.settings.viewport.currentLeftX;
    if (x > 20) {
      if (y > 20) {
        let initalX = 20;
        let initalY = 20;
        for (let colItem of this.options.columns) {
          if (initalX + colItem.width < x) {
            initalX += colItem.width;
            col++;
          } else break;
        }
        while (initalY + this.settings.rowHeight < y) {
          initalY += this.settings.rowHeight;
          row++;
        }
      } else {
        sheetArea = "colHeader";
      }
    } else {
      sheetArea = "rowHeader";
    }
    console.log("row=>", row, "col", col);
  }

  getNumberOfRowsToVisble(iRow) {
    let height = this.host
      .querySelector(".bs-grid.outer")
      .getBoundingClientRect().height;
    return height / 20;
  }
}


export interface GridStructure {
  host: HTMLElement
  settings: {
    colWidth: number,
    rowHeight: number,
    viewport: {
      currentTopRowIndex: number,
      currentLeftColIndex: number,
      currentTopY: number,
      currentLeftX: number,
    },
  }
  options: {
    dataSource: [], columns: [], rowHeaderCount: number,

  }
  basicCellSyle: {
    width: number,
    height: number,
    boxSizing: string,
  }
  cellFactory: CellFactory
  rowHeaderPanelCount: number
  selectedCell: HTMLElement

  getNumberOfRowsToVisble: (iRow: number) => number

  refresh: (dataTable: HTMLElement) => void

  hitTest: (x: number, y: number) => void

  getVisibleRows: (x: number, y: number) => void

}