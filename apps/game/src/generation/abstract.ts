import { Map } from '../game/game'

interface MapGenerationAlgorithm {
    generate(width: number, height: number): Map
}

export { MapGenerationAlgorithm }
