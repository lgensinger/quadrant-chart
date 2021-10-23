import test from "ava";

import { configuration, configurationDimension, configurationLayout } from "../src/configuration.js";
import { QuadrantChart } from "../src/index.js";

/******************** EMPTY VARIABLES ********************/

// initialize
let qc = new QuadrantChart();

// TEST INIT //
test("init", t => {

    t.true(qc.max === configurationLayout.max);
    t.true(qc.min === configurationLayout.min);

});

// TEST get DATA //
test("get_data", t => {

    t.true(typeof(qc.data) == "object");

});

// TEST get XAXIS //
test("get_xAxis", t => {

    t.true(typeof(qc.xAxis) == "function");

});

// TEST get YAXIS //
test("get_yAxis", t => {

    t.true(typeof(qc.yAxis) == "function");

});

// TEST get XSCALE //
test("get_xScale", t => {

    t.true(typeof(qc.xScale) == "function");

});

// TEST get YSCALE //
test("get_yScale", t => {

    t.true(typeof(qc.yScale) == "function");

});

// TEST RENDER //
test("render", t => {

    // clear document
    document.body.innerHTML = "";

    // render to dom
    qc.render(document.body);

    // get generated element
    let artboard = document.querySelector(`.${configuration.name}`);

    t.true(artboard !== undefined);
    t.true(artboard.nodeName == "svg");

});

/******************** DECLARED PARAMS ********************/

let testWidth = 300;
let testHeight = 500;
let testMin = 1;
let testMax = 6;
let testData = Array.from(Array(10)).map((d,i) => ({
    id: i,
    x: Math.floor(Math.random() * (Math.floor(testMax) - Math.ceil(testMin) + 1) + Math.ceil(testMin)),
    y: Math.floor(Math.random() * (Math.floor(testMax) - Math.ceil(testMin) + 1) + Math.ceil(testMin))
}))

// initialize
let qcp = new QuadrantChart(testData, testWidth, testHeight, testMin, testMax);

// TEST INIT //
test("init_params", t => {

    t.true(qcp.max === testMax);
    t.true(qcp.min === testMin);

});

// TEST get DATA //
test("get_data_params", t => {

    t.true(typeof(qcp.data) == "object");

});

// TEST get XAXIS //
test("get_xAxis_params", t => {

    t.true(typeof(qcp.xAxis) == "function");

});

// TEST get YAXIS //
test("get_yAxis_params", t => {

    t.true(typeof(qcp.yAxis) == "function");

});

// TEST get XSCALE //
test("get_xScale_params", t => {

    t.true(typeof(qcp.xScale) == "function");

});

// TEST get YSCALE //
test("get_yScale_params", t => {

    t.true(typeof(qcp.yScale) == "function");

});

// TEST RENDER //
test("render_params", t => {

    // clear document
    document.body.innerHTML = "";

    // render to dom
    qcp.render(document.body);

    // get generated element
    let artboard = document.querySelector(`.${configuration.name}`);

    t.true(artboard !== undefined);
    t.true(artboard.nodeName == "svg");

});
