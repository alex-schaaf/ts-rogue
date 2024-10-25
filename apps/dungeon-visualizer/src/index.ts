import * as ROT from 'rot-js'
import { DisplayOptions } from 'rot-js/lib/display/types'
import { registerDisplay } from './init'
import { renderDungeon } from './render'

interface CustomDisplayOptions extends Partial<DisplayOptions> {
    width: number
    height: number
}

function main(options: CustomDisplayOptions) {
    const display = registerDisplay(options)

    const dungeon = Array.from({ length: options.height }, () =>
        Array.from({ length: options.width }, () =>
            Math.floor(Math.random() * 4)
        )
    )

    renderDungeon(display, dungeon)
}

main({
    width: 80,
    height: 25,
})
