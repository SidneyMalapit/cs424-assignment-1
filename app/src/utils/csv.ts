export function parseCsv<T extends Record<string, string>>(csv: string): T[] {
  const [headerLine, ...rows] = csv.trim().split(/\r?\n/)
  const headers = headerLine.split(',')

  return rows.map((row) => {
    const values = row.split(',')
    return Object.fromEntries(headers.map((header, index) => [header, values[index]])) as T
  })
}
