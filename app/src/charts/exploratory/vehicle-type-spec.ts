// Vehicle type distribution by authority (joined with lines.csv)
export const vehicleTypeSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "description": "Vehicle types by transit authority",
  "data": { "url": "./data/vehicles.csv" },
  "transform": [
    {
      "lookup": "name",
      "from": {
        "data": { "url": "./data/lines.csv" },
        "key": "name",
        "fields": ["authority", "vehicle type"]
      }
    }
  ],
  "mark": { "type": "bar" },
  "encoding": {
    "x": {
      "field": "authority",
      "type": "nominal",
      "title": "Transit Authority",
      "axis": { "labelAngle": 0 }
    },
    "y": {
      "aggregate": "count",
      "type": "quantitative",
      "title": "Observations",
      "axis": { "titlePadding": 15 }
    },
    "color": {
      "field": "vehicle type",
      "type": "nominal",
      "title": "Vehicle Type",
      "scale": {
        "domain": ["train", "bus"],
        "range": ["#2563eb", "#f59e0b"]
      }
    },
    "tooltip": [
      { "field": "authority", "title": "Authority" },
      { "field": "vehicle type", "title": "Vehicle Type" },
      { "aggregate": "count", "title": "Count" }
    ]
  },
  "width": "container",
  "height": 350,
  "autosize": { "type": "fit", "contains": "padding" },
  "padding": { "right": 20 }
} as const
