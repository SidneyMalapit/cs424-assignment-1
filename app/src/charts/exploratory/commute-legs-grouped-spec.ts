// Grouped bar chart: compare to-campus vs to-home commute duration per day
export const commuteLegsGroupedSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "description": "Commute duration comparison: to campus vs to home per day",
  "data": { "url": "./data/timestamps.csv" },
  "transform": [
    {
      "calculate": "(toNumber(substring(datum['arrive school'], 0, 2)) * 60 + toNumber(substring(datum['arrive school'], 3, 5))) - (toNumber(substring(datum['leave home'], 0, 2)) * 60 + toNumber(substring(datum['leave home'], 3, 5)))",
      "as": "to_campus_min"
    },
    {
      "calculate": "(toNumber(substring(datum['arrive home'], 0, 2)) * 60 + toNumber(substring(datum['arrive home'], 3, 5))) - (toNumber(substring(datum['leave school'], 0, 2)) * 60 + toNumber(substring(datum['leave school'], 3, 5)))",
      "as": "to_home_min"
    },
    {
      "fold": ["to_campus_min", "to_home_min"],
      "as": ["leg", "duration_min"]
    },
    {
      "calculate": "datum.leg == 'to_campus_min' ? 'To campus' : 'To home'",
      "as": "leg"
    },
    {
      "calculate": "timeFormat(timeParse(datum.day, '%Y-%m-%d'), '%a, %b %e')",
      "as": "formatted_date"
    },
    {
      "calculate": "timeFormat(timeParse(datum.day, '%Y-%m-%d'), '%A, %B %d, %Y')",
      "as": "full_date"
    }
  ],
  "mark": { "type": "bar", "opacity": 0.9 },
  "encoding": {
    "x": {
      "field": "formatted_date",
      "type": "nominal",
      "title": "Date",
      "sort": { "field": "day", "op": "min", "order": "descending" },
      "axis": { "titlePadding": 15, "labelAngle": -45 }
    },
    "xOffset": {
      "field": "leg",
      "type": "nominal",
      "sort": ["To campus", "To home"]
    },
    "y": {
      "field": "duration_min",
      "type": "quantitative",
      "title": "Duration (minutes)",
      "axis": { "titlePadding": 15 }
    },
    "color": {
      "field": "leg",
      "type": "nominal",
      "title": "Commute Leg",
      "scale": {
        "domain": ["To campus", "To home"],
        "range": ["#2563eb", "#dc2626"]
      },
      "sort": ["To campus", "To home"]
    },
    "tooltip": [
      { "field": "full_date", "title": "Date" },
      { "field": "leg", "title": "Leg" },
      { "field": "duration_min", "title": "Duration (min)", "format": ".1f" }
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