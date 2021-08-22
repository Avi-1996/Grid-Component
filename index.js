import { Grid } from "./basicgrid";

// create some random data
var countries = "US,Germany,UK,Japan,Italy,Greece".split(",");
var data = [];
for (var i = 0; i < 200; i++) {
  data.push({
    id: i,
    country: countries[i % countries.length],
    sales: parseInt(Math.random() * 10000),
    expenses: parseInt(Math.random() * 5000),
    hell: "lksjdf",
  });
}
// bind a grid to the raw data
var theGrid = new Grid("#theGrid", {
  columns: [
    { binding: "country", header: "Country", width: "2*" },
    { binding: "sales", header: "Sales", width: "*", format: "n2" },
    { binding: "expenses", header: "Expenses", width: "*", format: "n2" },
    { binding: "hell", header: "Expenses2", width: "*", format: "n2" },
  ],
  dataSource: data,
});
