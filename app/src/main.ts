import './style.css'
import embed from 'vega-embed'

// Shared identical course color palette for both charts
const courseColors = {
  "CS 480": "#10b981",  // Emerald
  "DES 420": "#8b5cf6", // Purple
  "CS 424": "#f59e0b",  // Amber
  "DES 357": "#ec4899", // Pink
  "DES 355": "#06b6d4"  // Cyan
}

type CommuteTimestamp = {
  day: string
}

type CourseScheduleEntry = {
  course: string
  day: string
  start: string
  end: string
}

type CourseScheduleOverlay = {
  day: string
  course: string
  start: string
  end: string
}

function parseCsv<T extends Record<string, string>>(csv: string): T[] {
  const [headerLine, ...rows] = csv.trim().split(/\r?\n/)
  const headers = headerLine.split(',')

  return rows.map((row) => {
    const values = row.split(',')
    return Object.fromEntries(headers.map((header, index) => [header, values[index]])) as T
  })
}

const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  timeZone: 'UTC'
})

function getWeekday(day: string): string {
  return weekdayFormatter.format(new Date(`${day}T00:00:00Z`))
}

function buildCourseScheduleOverlay(
  commutes: CommuteTimestamp[],
  schedule: CourseScheduleEntry[]
): CourseScheduleOverlay[] {
  return commutes.flatMap(({ day }) =>
    schedule
      .filter((course) => course.day === getWeekday(day))
      .map(({ course, start, end }) => ({ day, course, start, end }))
  )
}

async function loadCourseScheduleOverlay(): Promise<CourseScheduleOverlay[]> {
  const [timestampsResponse, scheduleResponse] = await Promise.all([
    fetch('./data/timestamps.csv'),
    fetch('./data/course-schedule.csv')
  ])

  if (!timestampsResponse.ok || !scheduleResponse.ok) {
    throw new Error('Unable to load the commute timestamps or course schedule data.')
  }

  const [timestampsCsv, scheduleCsv] = await Promise.all([
    timestampsResponse.text(),
    scheduleResponse.text()
  ])

  return buildCourseScheduleOverlay(
    parseCsv<CommuteTimestamp>(timestampsCsv),
    parseCsv<CourseScheduleEntry>(scheduleCsv)
  )
}

// 1. Refined Gantt-like Commute Timestamps Chart with Course Schedule Overlay
const ganttSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
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
    },
  ],
  "layer": [
    // Layer A: Course Schedule Overlay with Diagonal Stripe Pattern Fill & Dashed Border
    {
      "data": { "name": "courseScheduleOverlay" },
      "transform": [
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
            "grid": true,
            "gridDash": [3, 3],
            "gridColor": "#cbd5e1",
            "bandPosition": 0.5
          }
        },
        "x": {
          "field": "course_start_min",
          "type": "quantitative",
          "title": "Time of Day",
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
            "domain": Object.keys(courseColors),
            "range": Object.values(courseColors)
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

// 2. Course Schedule Chart Spec (Matching Colors)
const scheduleSpec = {
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
      "title": "Day of the Week",
      "axis": { "orient": "top" }
    },
    "y": {
      "field": "start_min",
      "type": "quantitative",
      "scale": {
        "domain": [480, 1140],
        "reverse": true
      },
      "axis": {
        "format": ".0f",
        "values": [480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140],
        "labelExpr": "floor(datum.value / 60) + ':' + pad(datum.value % 60, 2, '0')"
      },
      "title": "Time of Day (Vertical Timeline)"
    },
    "y2": {
      "field": "end_min"
    },
    "color": {
      "field": "course",
      "type": "nominal",
      "scale": {
        "domain": Object.keys(courseColors),
        "range": Object.values(courseColors)
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

// Embed visualizations when DOM is loaded & inject SVG diagonal stripe pattern definitions
document.addEventListener('DOMContentLoaded', () => {
  loadCourseScheduleOverlay().then((courseScheduleOverlay) => {
    const ganttSpecWithOverlay = {
      ...ganttSpec,
      datasets: { courseScheduleOverlay }
    }

    return embed('#vis-gantt', ganttSpecWithOverlay as any, { actions: false })
  }).then(() => {
    const container = document.querySelector('#vis-gantt')
    if (container) {
      const svgEl = container.querySelector('svg')
      if (svgEl) {
        let defs = svgEl.querySelector('defs')
        if (!defs) {
          defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
          svgEl.insertBefore(defs, svgEl.firstChild)
        }
        // Create course-colored diagonal stripe patterns
        Object.entries(courseColors).forEach(([course, color]) => {
          const safeId = course.replace(/[^a-zA-Z0-9]/g, '_')
          const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
          pattern.setAttribute('id', `stripe_${safeId}`)
          pattern.setAttribute('width', '10')
          pattern.setAttribute('height', '10')
          pattern.setAttribute('patternUnits', 'userSpaceOnUse')
          pattern.setAttribute('patternTransform', 'rotate(45)')

          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
          line.setAttribute('x1', '0')
          line.setAttribute('y1', '0')
          line.setAttribute('x2', '0')
          line.setAttribute('y2', '10')
          line.setAttribute('stroke', color)
          line.setAttribute('stroke-width', '2')

          pattern.appendChild(line)
          defs.appendChild(pattern)
        })

        // Apply pattern fill to Layer A paths matching course stroke colors
        setTimeout(() => {
          Object.keys(courseColors).forEach((course) => {
            const safeId = course.replace(/[^a-zA-Z0-9]/g, '_')
            const targetColor = courseColors[course as keyof typeof courseColors]
            const paths = svgEl.querySelectorAll(`path[stroke="${targetColor}"]`)
            paths.forEach((p) => {
              p.setAttribute('fill', `url(#stripe_${safeId})`)
            })
          })
        }, 50)
      }
    }
  }).catch(console.error)

  embed('#vis-schedule', scheduleSpec as any, { actions: false }).catch(console.error)
})
