import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";

import { configuration, configurationDimension, configurationLayout } from "../configuration.js";

/**
 * QuadrantChart is an xy scatterplot stylized as a business matrix.
 * @param {array} data - objects where each represents a path in the hierarchy
 * @param {integer} height - artboard height
 * @param {integer} width - artboard width
 */
class QuadrantChart {
    constructor(data, width=configurationDimension.width, height=configurationDimension.height, min=configurationLayout.min, max=configurationLayout.max, labels=null, name=configuration.name) {

        // update self
        this.artboard = null;
        this.container = null;
        this.content = null;
        this.dataSource = data;
        this.height = height;
        this.max = max;
        this.min = min;
        this.name = name;
        this.node = null;
        this.width = width;
        this.x = labels ? labels.x : "x";
        this.y = labels ? labels.y : "y";

        // using font size as the base unit of measure make responsiveness easier to manage across devices
        this.artboardUnit = typeof window === "undefined" ? 16 : parseFloat(getComputedStyle(document.body).fontSize);

        this.padding = this.artboardUnit * 3;
        this.annotations = [
            [
                [this.padding / 2, this.padding * 0.35],
                [`low ${this.x}`, `high ${this.y}`],
                "start"
            ],
            [
                [this.padding / 2, this.height + (this.padding * 0.85)],
                [`low ${this.x}`, `low ${this.y}`],
                "start"
            ],
            [
                [this.width + (this.padding / 2), this.height + (this.padding * 0.85)],
                [`high ${this.x}`, `low ${this.y}`],
                "end"
            ],
            [
                [this.width + (this.padding / 2), this.padding * 0.35],
                [`high ${this.x}`, `high ${this.y}`],
                "end"
            ]
        ];

    }

    /**
     * Condition data for visualization requirements.
     * @returns An object where keys are series' set label and corresponding values are a object where keys are series' labels and values are each series value.
     */
    get data() {
        return this.dataSource ? this.dataSource : {};
    }

    /**
     * Construct x axis.
     * @returns A d3 axis function.
     */
     get xAxis() {
         return axisBottom(this.xScale)
             .ticks(this.max)
             .tickSizeInner(this.artboardUnit / 2);
     }

    /**
     * Construct y axis.
     * @returns A d3 axis function.
     */
     get yAxis() {
         return axisLeft(this.yScale)
             .ticks(this.max)
             .tickSizeInner(this.artboardUnit / 2);
     }

    /**
     * Construct x scale.
     * @returns A d3 scale function.
     */
    get xScale() {
        return scaleLinear()
            .domain([this.min, this.max])
            .range([0, this.width]);
    }

    /**
     * Construct y scale.
     * @returns A d3 scale function.
     */
    get yScale() {
        return scaleLinear()
            .domain([this.min, this.max])
            .range([this.height, 0]);
    }

    /**
     * Add event callbacks to nodes.
     */
    attachNodeCallbacks() {
        this.node
            .on("mouseover", (e,d) => {

                // update class
                select(e.target).attr("class", "lgv-node active");

                // set output object
                let detail = {
                    id: d.id,
                    label: d.label,
                    description: d.description,
                    xy: [e.clientX + (this.artboardUnit / 2), e.clientY + (this.artboardUnit / 2)]
                };

                // add xy label/values
                detail[this.x] = d.x;
                detail[this.y] = d.y;

                // send event to parent
                this.artboard.dispatch("nodemouseover", {
                    bubbles: true,
                    detail: detail
                });

            })
            .on("mouseout", (e,d) => {

                // update class
                select(e.target).attr("class", "lgv-node");

                // send event to parent
                this.artboard.dispatch("nodemouseout", {
                    bubbles: true
                });

            });
    }

    /**
     * Position and minimally style nodes in SVG dom element.
     */
    configureNodes() {
        this.node
            .attr("r", this.artboardUnit)
            .attr("cx", d => this.xScale(d.x))
            .attr("cy", d => this.yScale(d.y));
    }

    /**
     * Generate business annotations.
     * @param {selection} domNode - d3 selection
     * @returns A d3.js selection.
     */
    generateAnnotations(domNode) {
        domNode
            .selectAll(".lgv-annotation")
            .data(this.annotations)
            .join(
                enter => enter.append("text"),
                update => update,
                exit => exit.remove()
            )
            .attr("class", "lgv-annotation")
            .attr("transform", d => `translate(${d[0][0]},${d[0][1]})`)
            .attr("text-anchor", d => d[2])
            .text(d => d[1].join("/"));
    }

    /**
     * Generate SVG artboard in the HTML DOM.
     * @param {selection} domNode - d3 selection
     * @returns A d3.js selection.
     */
    generateArtboard(domNode) {
        return domNode
            .selectAll("svg")
            .data([{height: this.height, width: this.width}])
            .join(
                enter => enter.append("svg"),
                update => update,
                exit => exit.remove()
            )
            .attr("viewBox", d => `0 0 ${d.width + this.padding} ${d.height + this.padding}`)
            .attr("class", this.name);
    }

    /**
     * Generate SVG group to hold content that can not be trimmed by artboard.
     * @param {selection} domNode - d3 selection
     * @returns A d3.js selection.
     */
    generateContainer(domNode) {
        return domNode
            .selectAll(".lgv-container")
            .data(d => [d])
            .join(
                enter => enter.append("g"),
                update => update,
                exit => exit.remove()
            )
            .attr("class", "lgv-container")
            .attr("transform", `translate(${this.padding / 2},${this.padding / 2})`);
    }

    /**
     * Construct circle selection in HTML DOM.
     * @param {node} domNode - HTML node
     * @returns A d3.js selection.
     */
    generateNodes(domNode) {
        return domNode
            .selectAll(".lgv-node")
            .data(this.data)
            .join(
                enter => enter.append("circle"),
                update => update,
                exit => exit.remove()
            )
            .attr("class", "lgv-node")
    }

    /**
     * Construct background grid.
     * @param {node} domNode - d3 selection
     * @returns A d3.js selection.
     */
    generateGrid(domNode) {
        domNode
            .selectAll(".lgv-grid")
            .data(d => [d])
            .join(
                enter => enter.append("rect"),
                update => update,
                exit => exit.remove()
            )
            .attr("class", "lgv-grid")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.width)
            .attr("height", this.height);
    }

    /**
     * Construct x axis.
     * @param {node} domNode - d3.js selection
     * @returns A d3.js selection.
     */
    generateXaxis(domNode) {
        domNode
            .selectAll(".lgv-x-axis")
            .data(d => [d])
            .join(
                enter => enter.append("g"),
                update => update,
                exit => exit.remove()
            )
            .attr("class", "lgv-x-axis")
            .attr("transform", `translate(0,${this.yScale.range()[0] / 2})`)
            .call(this.xAxis);
    }

    /**
     * Construct y axis.
     * @param {node} domNode - d3.js selection
     * @returns A d3.js selection.
     */
    generateYaxis(domNode) {
        domNode
            .selectAll(".lgv-y-axis")
            .data(d => [d])
            .join(
                enter => enter.append("g"),
                update => update,
                exit => exit.remove()
            )
            .attr("class", "lgv-y-axis")
            .attr("transform", `translate(${this.xScale.range()[1] / 2},0)`)
            .call(this.yAxis);
    }

    /**
     * Generate visualization.
     */
    generateVisualization() {

        // generate svg artboard
        this.artboard = this.generateArtboard(this.container);

        // wrap for content to ensure nodes render within artboard
        this.content = this.generateContainer(this.artboard);

        // generate grid background
        this.generateGrid(this.content);

        // generate nodes
        this.node = this.generateNodes(this.content);

        // position/style nodes
        this.configureNodes();

        // generate y axis
        this.generateYaxis(this.content)

        // generate x axis
        this.generateXaxis(this.content);

        // generate annotation labels
        this.generateAnnotations(this.artboard);

        // attach event callbacks
        this.attachNodeCallbacks();

    }

    /**
     * Render visualization.
     * @param {node} domNode - HTML node
     */
    render(domNode) {

        // update self
        this.container = select(domNode);

        // generate visualization
        this.generateVisualization();

    }

    /**
     * Update visualization.
     * @param {object} data - key/values where each key is a series label and corresponding value is an array of values
     * @param {integer} height - height of artboard
     * @param {integer} width - width of artboard
     */
    update(data, width, height) {

        // update self
        this.dataSource = data;
        this.height = height;
        this.width = width;

        // generate visualization
        this.generateVisualization();

    }

};

export { QuadrantChart };
export default QuadrantChart;
