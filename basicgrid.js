import "./basicGrid.css";
export class Grid {
  constructor(host, options) {
    this.host = typeof host === "string" ? document.querySelector(host) : host;
    this.options = this.defineBasicOptions(options);

    this.basicCellSyle = {
      height: "20px",
      width: "112",
      contain: "strict",
      backgroundColor: "#f7f7f7",
      overflow: "hidden",
      borderRight: "1px solid rgba(0,0,0,.2)",
      borderBottom: "1px solid rgba(0,0,0,.2)",
      color: "black",
    };

    this.rowHeaderPanelCount = this.options.rowHeaderCount || 1;

    this.tableWid =
      parseInt(this.basicCellSyle.width) * this.options.columns.length + 20;

    //  this.addRowHeader(this.host);
    this.draWGrid();

    this.addEvents(this.host);

    this.defineStyle(this.host, { height: "400" });

    this.selectedCell = null;
  }
  draWGrid() {
    let { createEl } = this;
    let { columns, dataSource } = this.options;
    let outerDiv = createEl("div", { classList: "bs-grid outer" });
    let rowDiv, cellDiv;
    //

    // addHeader
    let header = createEl("div", { classList: "bs colHeader" });
    this.addRowHeader(header);
    //

    for (const col of columns) {
      cellDiv = createEl("div", {
        classList: "colH",
        textContent: col.header,
      });

      this.defineStyle(cellDiv, this.basicCellSyle);

      header.appendChild(cellDiv);
    }
    outerDiv.appendChild(header);

    let dataTable = createEl("div", { classList: "dataTable" });
    dataTable.style.width = this.tableWid;
    dataTable.classList.add("dataTable");
    for (let data of dataSource) {
      rowDiv = createEl("div", { classList: "bs bsRow" });
      rowDiv.style.width = rowDiv = this.defineStyle(rowDiv, {
        width: this.tableWid,
        height: this.basicCellSyle.height,
      });
      this.addRowHeader(rowDiv);
      for (const col of columns) {
        cellDiv = createEl("div", {
          classList: "bs bsCell",
          textContent: data[col.binding],
        });

        this.defineStyle(
          cellDiv,

          this.basicCellSyle
        );
        rowDiv.appendChild(cellDiv);
      }

      dataTable.appendChild(rowDiv);
    }
    // this.defineStyle(dataTable, {
    //   height: this.host.style.height,
    //   overflow: "overlay",
    // });
    outerDiv.appendChild(dataTable);
    this.host.appendChild(outerDiv);
    this.refresh(dataTable);
  }

  addRowHeader(header) {
    let cellDiv;
    for (let i = 0; i < this.rowHeaderPanelCount; i++) {
      cellDiv = this.createEl("div", {
        classList: "rowH",
        textContent: "",
      });

      this.defineStyle(cellDiv, {width:20});
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
    host.addEventListener("mousedown", (e) => {
      let { target } = e;
      let { classList } = target;
      if (classList.contains("bsCell") && !classList.contains("colH"))
        this.setActiveCell(e.target);
    });
  }

  setActiveCell(el) {
    if (this.selectedCell) {
      this.selectedCell.style.backgroundColor =
        this.basicCellSyle.backgroundColor;
      this.selectedCell.style.color = this.basicCellSyle.color;
    }
    if (el) {
      el.style.backgroundColor = this.options.selectedCellColor;
      el.style.color = this.options.selectedCellForeColor;
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

  refresh(dataTable) {
   
   
    
  }
}