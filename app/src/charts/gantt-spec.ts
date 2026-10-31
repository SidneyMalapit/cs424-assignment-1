import { courseColors, type CourseName } from '../constants/course-colors'

const courseKeys = Object.keys(courseColors) as CourseName[]
const courseValues = Object.values(courseColors)

export const ganttSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "params": [
    {
      "name": "showOverlay",
      "value": true,
      "bind": { "input": "checkbox", "name": "Show Course Schedule Overlay: " }
    }
  ],
  "description": "Daily commute intervals with course schedule overlay",
  "data": { "url": "./data/timestamps.csv" },
  "transform": [
    {
      "calculate": "toNumber(substring(datum['leave home'], 0, 2)) * 60 + toNumber(substring(datum['leave home'], 3, 5))",
      "as": "leave_home_min"
    },
    {
      "calculate": "toNumber(substring(datum['arrive school'], 0, 2)) * 60 + toNumber(substring(datum['arrive school'], 3, 5))",
      "as": "arrive_school_min"
    },
    {
      "calculate": "toNumber(substring(datum['leave school'], 0, 2)) * 60 + toNumber(substring(datum['leave school'], 3, 5))",
      "as": "leave_school_min"
    },
    {
      "calculate": "toNumber(substring(datum['arrive home'], 0, 2)) * 60 + toNumber(substring(datum['arrive home'], 3, 5))",
      "as": "arrive_home_min"
    },
    {
      "calculate": "timeFormat(timeParse(datum.day, '%Y-%m-%d'), '%a, %b %e')",
      "as": "formatted_date"
    },
    {
      "calculate": "timeFormat(timeParse(datum.day, '%Y-%m-%d'), '%A, %B %d, %Y')",
      "as": "full_date"
    },
    {
      "calculate": "timeFormat(timeParse(datum.day, '%Y-%m-%d'), '%A')",
      "as": "weekday"
    }
  ],
  "layer": [
    // Layer A: Course Schedule Overlay with Diagonal Stripe Pattern Fill & Dashed Border
    {
      "data": { "name": "courseScheduleOverlay" },
      "transform": [
        { "filter": "showOverlay" },
        {
          "calculate": "timeFormat(timeParse(datum.day, '%Y-%m-%d'), '%a, %b %e')",
          "as": "formatted_date"
        },
        {
          "calculate": "timeFormat(timeParse(datum.day, '%Y-%m-%d'), '%A, %B %d, %Y')",
          "as": "full_date"
        },
        {
          "calculate": "toNumber(substring(datum.start, 0, 2)) * 60 + toNumber(substring(datum.start, 3, 5))",
          "as": "course_start_min"
        },
        {
          "calculate": "toNumber(substring(datum.end, 0, 2)) * 60 + toNumber(substring(datum.end, 3, 5))",
          "as": "course_end_min"
        }
      ],
      "mark": {
        "type": "bar",
        "fill": "#ffffff",
        "strokeWidth": 1.5,
        "strokeDash": [4, 2],
        "opacity": 0.85
      },
      "encoding": {
        "y": {
          "field": "formatted_date",
          "type": "nominal",
          "sort": {
            "field": "day",
            "op": "min",
            "order": "descending"
          },
          "title": "Date",
          "axis": {
            "titlePadding": 15,
            "grid": true,
            "gridDash": [3, 3],
            "gridColor": "#cbd5e1",
            "bandPosition": 0.5
          }
        },
        "x": {
          "field": "course_start_min",
          "type": "quantitative",
          "title": "Time of day",
          "scale": {
            "domain": [420, 1260]
          },
          "axis": {
            "orient": "top",
            "format": ".0f",
            "values": [420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260],
            "labelExpr": "floor(datum.value / 60) + ':' + pad(datum.value % 60, 2, '0')"
          }
        },
        "x2": {
          "field": "course_end_min"
        },
        "stroke": {
          "field": "course",
          "type": "nominal",
          "scale": {
            "domain": courseKeys,
            "range": courseValues
          },
          "title": "Course / Commute"
        },
        "tooltip": [
          { "field": "full_date", "type": "nominal", "title": "Date" },
          { "field": "course", "type": "nominal", "title": "Class" },
          { "field": "start", "type": "nominal", "title": "Class Start" },
          { "field": "end", "type": "nominal", "title": "Class End" }
        ]
      }
    },
    // Layer B: Commute - To Campus (Rich Blue)
    {
      "data": { "url": "./data/timestamps.csv" },
      "transform": [
        {
          "calculate": "toNumber(substring(datum['leave home'], 0, 2)) * 60 + toNumber(substring(datum['leave home'], 3, 5))",
          "as": "leave_home_min"
        },
        {
          "calculate": "toNumber(substring(datum['arrive school'], 0, 2)) * 60 + toNumber(substring(datum['arrive school'], 3, 5))",
          "as": "arrive_school_min"
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
        "y": {
          "field": "formatted_date",
          "type": "nominal",
          "sort": {
            "field": "day",
            "op": "min",
            "order": "descending"
          }
        },
        "x": {
          "field": "leave_home_min",
          "type": "quantitative"
        },
        "x2": {
          "field": "arrive_school_min"
        },
        "color": {
          "value": "#2563eb"
        },
        "tooltip": [
          { "field": "full_date", "type": "nominal", "title": "Date" },
          { "field": "leave home", "type": "nominal", "title": "Leave Home" },
          { "field": "arrive school", "type": "nominal", "title": "Arrive School" }
        ]
      }
    },
    // Layer C: Commute - To Home (Rich Red)
    {
      "data": { "url": "./data/timestamps.csv" },
      "transform": [
        {
          "calculate": "toNumber(substring(datum['leave school'], 0, 2)) * 60 + toNumber(substring(datum['leave school'], 3, 5))",
          "as": "leave_school_min"
        },
        {
          "calculate": "toNumber(substring(datum['arrive home'], 0, 2)) * 60 + toNumber(substring(datum['arrive home'], 3, 5))",
          "as": "arrive_home_min"
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
        "y": {
          "field": "formatted_date",
          "type": "nominal",
          "sort": {
            "field": "day",
            "op": "min",
            "order": "descending"
          }
        },
        "x": {
          "field": "leave_school_min",
          "type": "quantitative"
        },
        "x2": {
          "field": "arrive_home_min"
        },
        "color": {
          "value": "#dc2626"
        },
        "tooltip": [
          { "field": "full_date", "type": "nominal", "title": "Date" },
          { "field": "leave home", "type": "nominal", "title": "Leave Home" },
          { "field": "arrive school", "type": "nominal", "title": "Arrive School" }
        ]
      }
    }
  ],
  "width": "container",
  "height": 580,
  "config": {
    "scale": {
      "bandPaddingInner": 0.22
    }
  }
} as const
