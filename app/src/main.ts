import './style.css'
import embed from 'vega-embed'
import { loadCourseScheduleOverlay } from './data/course-schedule-overlay'
import { ganttSpec } from './charts/gantt-spec'
import { scheduleSpec } from './charts/schedule-spec'
import { applyCourseStripes } from './styles/course-patterns'

// Embed visualizations when DOM is loaded & inject SVG diagonal stripe pattern definitions
document.addEventListener('DOMContentLoaded', async () => {
  const courseScheduleOverlay = await loadCourseScheduleOverlay()
  const ganttSpecWithOverlay = {
    ...ganttSpec,
    datasets: { courseScheduleOverlay }
  }

  const res = await embed('#vis-gantt', ganttSpecWithOverlay as any, { actions: false })
  applyCourseStripes(res.view)

  await embed('#vis-schedule', scheduleSpec as any, { actions: false })
})
