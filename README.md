# Quadrant Chart

ES6 d3.js quadrant (xy) visualization.


## Style

Style is expected to be addressed via css. The top-level svg is assigned a class `lgv-quadrant-chart`. Any style not met by the visualization module is expected to be added by the importing component.

## Environment Variables

The following values can be set via environment or passed into the class.

| Name | Type | Description |
| :-- | :-- | :-- |
| `DIMENSION_HEIGHT` | integer | height of artboard |
| `DIMENSION_WIDTH` | integer | width of artboard |
| `LAYOUT_MAX` | integer | maximum value |
| `LAYOUT_MIN` | integer | minimum value |

## Install

```bash
# install package
npm install @lgv/quadrant-chart
```

## Data Format

The following values are the expected input data structure.

```json
[
    {
        "id": 1,
        "label": "this is a title",
        "description": "this is a description",
        "x": 3,
        "y": 5
    },
    {
        "id": 2,
        "label": "this is a title",
        "description": "this is a description",
        "x": 1,
        "y": 2
    },
    ...
]
```

## Use Module

```bash
import { QuadrantChart } from "@lgv/quadrant-chart";

// initialize
const qc = new QuadrantChart(data);

// render visualization
qc.render(document.body);
```
