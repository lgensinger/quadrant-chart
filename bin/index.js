#!/usr/bin/node --experimental-specifier-resolution=node

import { DOMParser, parseHTML } from "linkedom";

import { QuadrantChart } from "../src/visualization/index.js";

let args = {};

// pull arguements from cli
process.argv.forEach((val, index, array)  => {

    // skip bin strings and correlate odd/even to value/--flag
    if (index > 1 && index % 2) {

        // correlate params to values
        args[process.argv[index - 1].replace("--", "")] = JSON.parse(val);

    }

});

// generate basic html
const { document } = parseHTML(`
  <!doctype html>
  <html lang="en">
    <body>
    </body>
  </html>
`);

// initialize chart
let qc = new QuadrantChart(args.data, args.width, args.height, args.min, arg.max, args.labels);

// generate in basic dom
qc.render(document.body);

// strip off body tag from string
let component = document.body.toString().replace("<body>", "").replace("</body>", "");

// surface data
console.log(component);
