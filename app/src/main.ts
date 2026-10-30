import './style.css'
import embed from 'vega-embed'

// 1. Gantt-like Commute Timestamps Spec
const ganttSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Commute departure and arrival times across days.",
  "data": { "url": "./data/final-timestamps.csv" },
  "mark": "bar",
  "encoding": {
    "y": {
      "field": "day",
      "type": "nominal",
      "sort": "ascending",
      "title": "Date"
    },
    "x": {
      "field": "leave_home",
      "type": "nominal",
      "title": "Time of Day"
    },
    "x2": {
      "field": "arrive_school"
    },
    "color": {
      "value": "#3b82f6"
    },
    "tooltip": [
      { "field": "day", "type": "nominal" },
      { "field": "leave_home", "type": "nominal" },
      { "field": "arrive_school", "type": "nominal" }
    ]
  },
  "width": 600,
  "height": 300
} as const

// 2. Vehicles Bar Chart Spec
const vehiclesSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Frequency of transit lines taken.",
  "data": { "url": "./data/final-vehicles.csv" },
  "mark": "bar",
  "encoding": {
    "y": {
      "field": "name",
      "type": "nominal",
      "sort": "-x",
      "title": "Vehicle / Line Name"
    },
    "x": {
      "aggregate": "count",
      "type": "quantitative",
      "title": "Number of Trips"
    },
    "color": {
      "field": "returning",
      "type": "nominal",
      "title": "Returning Trip"
    },
    "tooltip": [
      { "field": "name", "type": "nominal" },
      { "aggregate": "count", "title": "Trips" }
    ]
  },
  "width": 600,
  "height": 200
} as const

// Embed visualizations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  embed('#vis-gantt', ganttSpec as any, { actions: false }).catch(console.error)
  embed('#vis-vehicles', vehiclesSpec as any, { actions: false }).catch(console.error)
})
