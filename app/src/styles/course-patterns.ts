import { courseColors } from '../constants/course-colors'
import type { View } from 'vega'

export function applyCourseStripes(view?: View): void {
  const applyStripes = () => {
    const container = document.querySelector('#vis-gantt')
    if (container) {
      const svgEl = container.querySelector('svg')
      if (svgEl) {
        let defs = svgEl.querySelector('defs')
        if (!defs) {
          defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
          svgEl.insertBefore(defs, svgEl.firstChild)
        }
        Object.entries(courseColors).forEach(([course, color]) => {
          const safeId = course.replace(/[^a-zA-Z0-9]/g, '_')
          if (!defs.querySelector('#stripe_' + safeId)) {
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
          }
        })

        setTimeout(() => {
          Object.keys(courseColors).forEach((course) => {
            const safeId = course.replace(/[^a-zA-Z0-9]/g, '_')
            const targetColor = courseColors[course as keyof typeof courseColors]
            const paths = svgEl.querySelectorAll(`path[stroke="${targetColor}"]`)
            paths.forEach((p) => {
              p.setAttribute('fill', `url(#stripe_${safeId})`)
            })
          })
        }, 40)
      }
    }
  }

  applyStripes()
  if (view) {
    view.addSignalListener('showOverlay', () => {
      setTimeout(applyStripes, 60)
    })
  }
}
