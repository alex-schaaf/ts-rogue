import * as ROT from 'rot-js'
import { DisplayOptions } from 'rot-js/lib/display/types'

function registerDisplay(options: Partial<DisplayOptions>): ROT.Display {
    const display = new ROT.Display()
    const displayContainer = display.getContainer()
    if (!displayContainer) {
        throw new Error('Display container not found')
    }
    const mapElement = document.getElementById('map')
    if (!mapElement) {
        throw new Error('Map element not found')
    }
    mapElement.appendChild(displayContainer)
    return display
}

export { registerDisplay }
