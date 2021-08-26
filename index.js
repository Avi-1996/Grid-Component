import { Grid } from "./basicgrid";

// create some random data
var countries = "US,Germany,UK,Japan,Italy,Greece".split(",");
var data = [];
for (var i = 0; i < 50000; i++) {
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
    { binding: "id", header: "ID", width: 60 },
    { binding: "country", header: "Country", width: 60 },
    { binding: "sales", header: "Sales", width: 70 },
    { binding: "expenses", header: "Expenses", width: 60 },
    { binding: "hell", header: "Expenses2", width: 60 },
  ],
  dataSource: data,
});
