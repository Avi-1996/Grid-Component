import "reflect-metadata";
import "./basicSheetStyle.css";
import { publish, subscribe } from "./eventBus";
export function WorkSheet(host, options) {
  if (!host) return;
  this.options = options;
  host.appendChild(createTable(options));

  this.addEvents(host);
  host.style.font = "12px Calbri";
}

WorkSheet.prototype.startEdit = function (el) {
  el.contentEditable = true;
};
WorkSheet.prototype.endEdit = function (el) {
  el.contentEditable = false;
};
WorkSheet.prototype.setValue = function (row, col, value) {
  this.host
    .querySelector(`tr[role='${row}']`)
    .querySelector(`td[role='${col}']`).textContent = value;
};
WorkSheet.prototype.getValue = function (row, col) {
  return this.host
    .querySelector(`tr[role='${row}']`)
    .querySelector(`td[role='${col}']`).textContent;
};

function createTable(options) {
  let { rowCount, colCount } = options;
  let table = document.createElement("table");
  let tr = null;
  let td = null;
  for (let i = 0; i < rowCount + 1; i++) {
    tr = document.createElement("tr");
    tr.role = i;
    tr.setAttribute("role", i.toString());
    for (let j = 0; j < colCount + 1; j++) {
      if (i == 0) {
        td = document.createElement("th");
        td.textContent = getExcelColHead(j, "");
        td.classList.add("colH");

        let border = document.createElement("div");
        // border.style.width = "0px";
        // border.style.height = "0px";
        // border.classList.add("bs-border");

        // border.style.border = "solid 2px cyan";
        td.appendChild(border);
      } else if (j == 0) {
        td = document.createElement("td");
        td.textContent = i;
        td.classList.add("rowH");
      } else {
        td = document.createElement("td");
        td.contentEditable = false;
      }
      td.setAttribute("role", j.toString());
      preventEvents(td);
      tr.appendChild(td);
    }

    table.appendChild(tr);
  }
  return table;
}

function preventEvents(td) {}

function getExcelColHead(index, text) {
  if (index === 0) {
    return text;
  }
  if (index / 26 >= 1) {
    text += String.fromCharCode(65 + (index % 26));
    return getExcelColHead(Math.floor(index / 26), text);
    //text += text += String.fromCharCode(65 + (index % 26));
  } else if (index % 26 > 0) {
    text = String.fromCharCode(64 + (index % 26)) + text;
    return text;
  }
}

WorkSheet.prototype.addEvents = function (host) {
  host.addEventListener("mousedown", (e) => {
    if (
      !e.target.classList.contains("colH") &&
      !e.target.classList.contains("rowH")
    ) {
      this.startEdit(e.target);
    }
  });
  host.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      this.endEdit(e.target);
    }
  });
  host.addEventListener("focusout", (e) => {
    e.target.contentEditable = false;
  });
  host.addEventListener("mousemove", (e) => {
    // console.log(e);
  });
  //   host.addEventListener("change", (e) => {
  //     this.startEdit(e.target);
  //   });
};
/*
"A"
*/
