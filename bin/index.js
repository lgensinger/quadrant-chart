#!/usr/bin/node --experimental-specifier-resolution=node

import { DOMParser, parseHTML } from "linkedom";
import sharp from "sharp";

import { QuadrantChart } from "../src/visualization/index.js";

let args = {};

// pull arguements from cli
process.argv.forEach((val, index, array)  => {

    // skip bin strings and correlate odd/even to value/--flag
    if (index > 1 && index % 2) {

        // determine if json
        let isValidJson = /^[\],:{}\s]*$/.test(val.replace(/\\["\\\/bfnrtu]/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''));

        // correlate params to values
        args[process.argv[index - 1].replace("--", "")] = isValidJson ? JSON.parse(val) : val;

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
let qc = new QuadrantChart(args.data, parseInt(args.width), parseInt(args.height), parseInt(args.min), parseInt(args.max), args.labels);

// generate in basic dom
let a = qc.render(document.body);

// strip off body tag from string
let component = document.body.toString()
    .replace("<body>", "")
    .replace("</body>", "")
    .replace("</svg>", `<style>${args.css}</style></svg>`);

// render svg to png
let img = await sharp(Buffer.from(component));
await img.toFile(`${args.filename}.png`);

// surface data
console.log(component);
