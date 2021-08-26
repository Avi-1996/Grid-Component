export class CellFactory {
    constructor(dataSource, columns) {
        this.dataSource = dataSource
        this.columns = columns
        this.rowHeaderPanelCount = this.options.rowHeaderCount || 1;
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

        for (let data of this.dataTable) {
            rowDiv = createEl("div", { classList: "bs bsRow" });
            this.addRowHeader(rowDiv);
            for (const col of columns) {
                cellDiv = createEl("div", {
                    classList: "bs bsCell",
                    textContent: data[col.binding],
                });
                this.defineStyle(cellDiv, { width: col.width, height: data.height });
                rowDiv.appendChild(cellDiv);
            }

            dataTableGrid.appendChild(rowDiv);
        }

        outerDiv.appendChild(dataTableGrid);
        this.host.appendChild(outerDiv);
        this.refresh(dataTableGrid);
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
  
}