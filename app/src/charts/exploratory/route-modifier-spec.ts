// Route modifier frequency
export const routeModifierSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "description": "Route modifiers observed (e.g., Express, L)",
  "data": { "url": "./data/vehicles.csv" },
  "transform": [
    { "filter": "datum['route modifier'] != ''" }
  ],
  "mark": { "type": "bar" },
  "encoding": {
    "x": {
      "field": "route modifier",
      "type": "nominal",
      "title": "Route Modifier",
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
      { "field": "route modifier", "title": "Modifier" },
      { "field": "name", "title": "Line" },
      { "aggregate": "count", "title": "Count" }
    ]
  },
  "width": "container",
  "height": 350
} as const
