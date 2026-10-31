const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  timeZone: 'UTC'
})

export function getWeekday(day: string): string {
  return weekdayFormatter.format(new Date(`${day}T00:00:00Z`))
}
