import "./basicGrid.css";
import { CellFactory } from "./CellFactory";
export class Grid {
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
    this.dataTable = this.createDataSource();
    this.basicCellSyle = {
      width: 112,
      height: 20,
      boxSizing: "border-box",
    };

    this.cellFactory = new CellFactory(this.options, this.host);
    this.rowHeaderPanelCount = this.options.rowHeaderCount || 1;

    //  this.addRowHeader(this.host);

    this.cellFactory.draWGrid();
    this.defineStyle(this.host.querySelector(".bs-grid.outer"), {
      width: "max-content",
    });
    this.addEvents(this.host.querySelector(".bs-grid.outer"));

    this.selectedCell = null;
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

  createEl(tagName, options = {}) {
    return Object.assign(document.createElement(tagName), options);
  }

  addEvents(host) {
    let self = this;
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
      self.settings.viewport.currentTopY = e.target.scrollTop;
      self.settings.viewport.currentLeftX = e.target.scrollLeft;
      // (scrollTop) / (docHeight - winHeight);
      console.log(e.target.scrollTop % self.basicCellSyle.height);

      self.cellFactory.drawChunk(
        self.getNumberOfRowsToVisble(),
        self.settings.viewport.currentTopRowIndex,
        self.host.querySelector(".dataTableGrid")
      );
    });

    host.addEventListener("mousemove", function (e) {
      var y = e.pageY - this.offsetTop;
      var x = e.pageX - this.offsetLeft;
      self.hitTest(x, y);
    });
  }

  createDataSource() {
    let self = this;
    let { columns, dataSource } = self.options;
    let internalDataTable = [];

    columns.map((col) => {
      col.width = col.width ? col.width : self.settings.colWidth;
    });

    dataSource.forEach((rowItem) => {
      rowItem.height = self.settings.rowHeight;
      internalDataTable.push(rowItem);
    });

    return internalDataTable;
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

  refresh(dataTable) {}

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
    // console.log("row=>", row, "col", col);
  }

  getNumberOfRowsToVisble() {
    return (
      this.host.querySelector(".bs-grid.outer").getBoundingClientRect().height /
        this.basicCellSyle.height -
      1
    );
  }
}
