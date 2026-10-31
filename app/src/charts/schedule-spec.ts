import { courseColors, type CourseName } from '../constants/course-colors'

const courseKeys = Object.keys(courseColors) as CourseName[]
const courseValues = Object.values(courseColors)

export const scheduleSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "description": "Weekly Course Schedule",
  "data": { "url": "./data/course-schedule.csv" },
  "transform": [
    {
      "calculate": "toNumber(substring(datum.start, 0, 2)) * 60 + toNumber(substring(datum.start, 3, 5))",
      "as": "start_min"
    },
    {
      "calculate": "toNumber(substring(datum.end, 0, 2)) * 60 + toNumber(substring(datum.end, 3, 5))",
      "as": "end_min"
    }
  ],
  "mark": { "type": "bar" },
  "encoding": {
    "x": {
      "field": "day",
      "type": "nominal",
      "sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "title": "Weekday",
      "axis": { "orient": "top", "labelAngle": 0 }
    },
    "y": {
      "field": "start_min",
      "type": "quantitative",
      "scale": {
        "domain": [480, 1140],
        "reverse": true
      },
      "axis": {
        "titlePadding": 15,
        "format": ".0f",
        "values": [480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140],
        "labelExpr": "floor(datum.value / 60) + ':' + pad(datum.value % 60, 2, '0')"
      },
      "title": "Time of day"
    },
    "y2": {
      "field": "end_min"
    },
    "color": {
      "field": "course",
      "type": "nominal",
      "scale": {
        "domain": courseKeys,
        "range": courseValues
      },
      "title": "Course"
    },
    "tooltip": [
      { "field": "course", "type": "nominal", "title": "Course" },
      { "field": "day", "type": "nominal", "title": "Day" },
      { "field": "start", "type": "nominal", "title": "Start" },
      { "field": "end", "type": "nominal", "title": "End" }
    ]
  },
  "width": "container",
  "height": 450
} as const
