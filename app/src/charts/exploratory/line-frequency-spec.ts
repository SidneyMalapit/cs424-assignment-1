// Line frequency — how often each transit line appears in the commute
export const lineFrequencySpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "description": "Frequency of transit lines used",
  "data": { "url": "./data/vehicles.csv" },
  "mark": { "type": "bar" },
  "encoding": {
    "x": {
      "field": "name",
      "type": "nominal",
      "title": "Transit Line",
      "sort": { "op": "count", "order": "descending" },
      "axis": { "labelAngle": 0 }
    },
    "y": {
      "aggregate": "count",
      "type": "quantitative",
      "title": "Number of Observations",
      "axis": { "titlePadding": 15 }
    },
    "color": {
      "field": "name",
      "type": "nominal",
      "legend": null
    },
    "tooltip": [
      { "field": "name", "title": "Line" },
      { "aggregate": "count", "title": "Count" }
    ]
  },
  "width": "container",
  "height": 350
} as const
