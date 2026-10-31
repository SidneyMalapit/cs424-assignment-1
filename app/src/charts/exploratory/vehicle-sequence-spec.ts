// Vehicle sequence per day — shows the ordered legs of each commute
export const vehicleSequenceSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "description": "Vehicle sequence per commute day",
  "data": { "url": "./data/vehicles.csv" },
  "transform": [
    {
      "calculate": "datum.order",
      "as": "sequence_order"
    },
    {
      "calculate": "datum.returning === 'TRUE'",
      "as": "is_return"
    }
  ],
  "mark": { "type": "point", "filled": true, "size": 100 },
  "encoding": {
    "x": {
      "field": "order",
      "type": "ordinal",
      "title": "Sequence Order",
      "axis": { "labelAngle": 0 }
    },
    "y": {
      "field": "day",
      "type": "nominal",
      "title": "Date",
      "sort": { "order": "descending" },
      "axis": { "titlePadding": 15 }
    },
    "color": {
      "field": "is_return",
      "type": "nominal",
      "scale": {
        "domain": [true, false],
        "range": ["#dc2626", "#2563eb"]
      },
      "title": "Direction",
      "legend": { "labelExpr": "datum.value ? 'Return' : 'Outbound'" }
    },
    "shape": {
      "field": "name",
      "type": "nominal",
      "title": "Line/Vehicle"
    },
    "tooltip": [
      { "field": "day", "title": "Date" },
      { "field": "order", "title": "Order" },
      { "field": "name", "title": "Line" },
      { "field": "returning", "title": "Returning" },
      { "field": "vehicle destination", "title": "Destination" },
      { "field": "model number", "title": "Model" },
      { "field": "route modifier", "title": "Route Modifier" }
    ]
  },
  "width": "container",
  "height": 500,
  "autosize": { "type": "fit", "contains": "padding" },
  "padding": { "right": 20 }
} as const
