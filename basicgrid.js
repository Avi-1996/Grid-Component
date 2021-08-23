import "./basicGrid.css";
export class Grid {
  constructor(host, options) {
    this.host = typeof host === "string" ? document.querySelector(host) : host;
    this.options = this.defineBasicOptions(options);

    this.basicCellSyle = {
      width: 112,
      height: 20,
    };

    this.rowHeaderPanelCount = this.options.rowHeaderCount || 1;

    //  this.addRowHeader(this.host);
    this.draWGrid();

    this.addEvents(this.host);

    this.defineStyle(this.host, { height: "400", overflow: "auto" });

    this.selectedCell = null;

    this.settings = {
      colWidth: 112,
      rowHeight: 20,
    };
  }
  draWGrid() {
    let { createEl } = this;
    let { columns, dataSource } = this.options;
    let outerDiv = this.defineStyle(createEl("div", { classList: "bs-grid outer" }),{width:(this.basicCellSyle.width*this.options.columns.length)});
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

      this.defineStyle(cellDiv, this.basicCellSyle);

      header.appendChild(cellDiv);
    }
    outerDiv.appendChild(header);

    let dataTable = createEl("div", { classList: "dataTable" });
    // dataTable.style.width = this.tableWid;
    dataTable.classList.add("dataTable");
    for (let data of dataSource) {
      rowDiv = createEl("div", { classList: "bs bsRow" });
      this.addRowHeader(rowDiv);
      for (const col of columns) {
        cellDiv = createEl("div", {
          classList: "bs bsCell",
          textContent: data[col.binding],
        });
this.defineStyle(cellDiv,this.basicCellSyle)
        rowDiv.appendChild(cellDiv);
      }

      dataTable.appendChild(rowDiv);
    }

    outerDiv.appendChild(dataTable);
    this.host.appendChild(outerDiv);
    this.refresh(dataTable);
  }

  addRowHeader(header) {
    let cellDiv;
    for (let i = 0; i < this.rowHeaderPanelCount; i++) {
      cellDiv = this.createEl("div", {
        classList: "bs bsCell rowH",
        textContent: "",
      });
this.defineStyle(cellDiv,{height:this.basicCellSyle.height,width:20})
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
      console.log("x=>" + +x + "Y==>", y);
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

  refresh(dataTable) {}

  hitTest(x, y) {
    let { columns, dataSource } = this.options;
    let result = {};
    this.getvzisbleRows(x, y);
    console.log(x, y);
    if (x < 20 && y > 20) {
      result.hitArea = "rowHeader";
    } else if (
      parseInt(x / 112) < columns.length &&
      parseInt(y / 20) < columns.length
    ) {
    }
  }

  getvzisbleRows(x, y) {
    let hostInfo = this.host
      .querySelector(".bs-grid.outer")
      .getBoundingClientRect();
    let sheetArea;
    console.log(hostInfo);
    let row = 0,
      col = 0;

    let rowHWidth = document.querySelector(".bs.bsCell.rowH").offsetWidth - 1;
    let rowHeight = document.querySelector(".bs.bsCell.rowH").offsetWidth - 1;
    let numberOfColumns = hostInfo.width / this.settings.colWidth;

    let numberOfRows =
      (hostInfo.height - 1 * this.options.dataSource.length) /
      this.settings.rowHeight;


    if (x > 20) {
      if (y > 20) {
        let initalX = 20;
        let initalY = 20;
        while (initalX + this.basicCellSyle.width < x) {
          initalX += this.basicCellSyle.width;
          col++;
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

  Dimension(elm) {
    var elmHeight, elmMargin;

    if (document.all) {
      // IE
      elmHeight = elm.currentStyle.height;
      elmMargin =
        parseInt(elm.currentStyle.marginTop, 10) +
        parseInt(elm.currentStyle.marginBottom, 10) +
        "px";
    } else {
      // Mozilla
      elmHeight = document.defaultView
        .getComputedStyle(elm, "")
        .getPropertyValue("height");
      elmMargin =
        parseInt(
          document.defaultView
            .getComputedStyle(elm, "")
            .getPropertyValue("margin-top")
        ) +
        parseInt(
          document.defaultView
            .getComputedStyle(elm, "")
            .getPropertyValue("margin-bottom")
        ) +
        "px";
    }
    return elmHeight + elmMargin;
  }
}
