// Stacked bar chart: duration of first two commute legs to campus per day
export const commuteLegsSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "description": "Duration of first two commute legs to campus per day (stacked)",
  "data": { "url": "./data/vehicles.csv" },
  "transform": [
    { "filter": "datum.returning === 'FALSE' && (datum.order == '1' || datum.order == '2')" },
    {
      "calculate": "datum.order == '1' ? 'First Leg' : 'Second Leg'",
      "as": "leg"
    },
    {
      "lookup": "day",
      "from": {
        "data": { "url": "./data/timestamps.csv" },
        "key": "day",
        "fields": ["leave home", "arrive school"]
      }
    },
    {
      "calculate": "(toNumber(substring(datum['arrive school'], 0, 2)) * 60 + toNumber(substring(datum['arrive school'], 3, 5))) - (toNumber(substring(datum['leave home'], 0, 2)) * 60 + toNumber(substring(datum['leave home'], 3, 5)))",
      "as": "total_duration_min"
    },
    {
      "calculate": "datum.total_duration_min / 2",
      "as": "leg_duration_min"
    }
  ],
  "mark": { "type": "bar" },
  "encoding": {
    "x": {
      "field": "day",
      "type": "nominal",
      "title": "Date",
      "sort": { "order": "descending" },
      "axis": { "titlePadding": 15, "labelAngle": -45 }
    },
    "y": {
      "field": "leg_duration_min",
      "type": "quantitative",
      "title": "Duration (minutes)",
      "axis": { "titlePadding": 15 },
      "stack": true
    },
    "color": {
      "field": "leg",
      "type": "nominal",
      "title": "Commute Leg",
      "scale": {
        "domain": ["First Leg", "Second Leg"],
        "range": ["#2563eb", "#dc2626"]
      },
      "sort": ["First Leg", "Second Leg"]
    },
    "tooltip": [
      { "field": "day", "title": "Date" },
      { "field": "leg", "title": "Leg" },
      { "field": "name", "title": "Line" },
      { "field": "vehicle destination", "title": "Destination" },
      { "field": "leg_duration_min", "title": "Duration (min)", "format": ".1f" }
    ]
  },
  "width": "container",
  "height": 400,
  "autosize": { "type": "fit", "contains": "padding" },
  "padding": { "right": 20 },
  "config": {
    "scale": {
      "bandPaddingInner": 0.2
    }
  }
} as const