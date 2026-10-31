import { parseCsv } from '../utils/csv'
import { getWeekday } from '../utils/time'
import type { CommuteTimestamp, CourseScheduleEntry, CourseScheduleOverlay } from '../types/data'

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

export async function loadCourseScheduleOverlay(): Promise<CourseScheduleOverlay[]> {
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
