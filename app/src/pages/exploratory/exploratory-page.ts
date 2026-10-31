import '../../../style.css'
import embed from 'vega-embed'
import { vehicleSequenceSpec } from '../../charts/exploratory/vehicle-sequence-spec'
import { lineFrequencySpec } from '../../charts/exploratory/line-frequency-spec'
import { vehicleTypeSpec } from '../../charts/exploratory/vehicle-type-spec'
import { modelDistributionSpec } from '../../charts/exploratory/model-distribution-spec'
import { routeModifierSpec } from '../../charts/exploratory/route-modifier-spec'

const charts = [
  { id: 'vis-vehicle-sequence', spec: vehicleSequenceSpec, title: 'Vehicle Sequence per Day' },
  { id: 'vis-line-frequency', spec: lineFrequencySpec, title: 'Line Frequency' },
  { id: 'vis-vehicle-type', spec: vehicleTypeSpec, title: 'Vehicle Type by Authority' },
  { id: 'vis-model-distribution', spec: modelDistributionSpec, title: 'Model Number Distribution' },
  { id: 'vis-route-modifier', spec: routeModifierSpec, title: 'Route Modifier Frequency' }
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
