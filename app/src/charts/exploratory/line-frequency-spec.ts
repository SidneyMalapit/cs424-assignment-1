// Line frequency — how often each transit line appears in the commute
export const lineFrequencySpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "description": "Frequency of transit lines used",
  "data": { "url": "./data/vehicles.csv" },
  "mark": { "type": "arc", "innerRadius": 0 },
  "encoding": {
    "theta": {
      "aggregate": "count",
      "type": "quantitative",
      "title": "Number of Observations"
    },
    "color": {
      "field": "name",
      "type": "nominal",
      "title": "Transit Line",
      "legend": { "orient": "right" },
      "sort": { "op": "count", "order": "descending" }
    },
    "tooltip": [
      { "field": "name", "title": "Line" },
      { "aggregate": "count", "title": "Count" }
    ]
  },
  "width": "container",
  "height": 350
} as const