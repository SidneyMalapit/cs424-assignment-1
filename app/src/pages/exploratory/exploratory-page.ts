import '../../../style.css'
import embed from 'vega-embed'
import { vehicleSequenceSpec } from '../../charts/exploratory/vehicle-sequence-spec'
import { lineFrequencySpec } from '../../charts/exploratory/line-frequency-spec'
import { commuteLegsSpec } from '../../charts/exploratory/commute-legs-spec'

const charts = [
  { id: 'vis-vehicle-sequence', spec: vehicleSequenceSpec, title: 'Vehicle Sequence per Day' },
  { id: 'vis-line-frequency', spec: lineFrequencySpec, title: 'Line Frequency' },
  { id: 'vis-commute-legs', spec: commuteLegsSpec, title: 'Commute Legs to Campus' }
]

export async function renderExploratoryPage(): Promise<void> {
  await Promise.all(
    charts.map(({ id, spec, title }) =>
      embed(`#${id}`, spec as any, { actions: false })
        .then(() => console.log(`Rendered: ${title}`))
        .catch(console.error)
    )
  )
}

// Auto-invoke when DOM is loaded (like main.ts does)
document.addEventListener('DOMContentLoaded', renderExploratoryPage)
