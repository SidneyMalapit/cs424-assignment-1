// Model number distribution (where available)
export const modelDistributionSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "description": "Vehicle model numbers observed",
  "data": { "url": "./data/vehicles.csv" },
  "transform": [
    { "filter": "datum['model number'] != ''" }
  ],
  "mark": { "type": "bar" },
  "encoding": {
    "x": {
      "field": "model number",
      "type": "nominal",
      "title": "Model Number",
      "sort": { "op": "count", "order": "descending" },
      "axis": { "labelAngle": 0 }
    },
    "y": {
      "aggregate": "count",
      "type": "quantitative",
      "title": "Observations",
      "axis": { "titlePadding": 15 }
    },
    "color": {
      "field": "name",
      "type": "nominal",
      "title": "Line"
    },
    "tooltip": [
      { "field": "model number", "title": "Model" },
      { "field": "name", "title": "Line" },
      { "aggregate": "count", "title": "Count" }
    ]
  },
  "width": "container",
  "height": 350
} as const
