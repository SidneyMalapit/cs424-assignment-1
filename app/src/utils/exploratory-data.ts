import { parseCsv } from '../utils/csv'
import type { VehicleObservation, LineInfo } from '../types/exploratory'

export async function loadVehicles(): Promise<VehicleObservation[]> {
  const response = await fetch('./data/vehicles.csv')
  if (!response.ok) throw new Error('Failed to load vehicles.csv')
  const csv = await response.text()
  return parseCsv<VehicleObservation>(csv)
}

export async function loadLines(): Promise<LineInfo[]> {
  const response = await fetch('./data/lines.csv')
  if (!response.ok) throw new Error('Failed to load lines.csv')
  const csv = await response.text()
  return parseCsv<LineInfo>(csv)
}
