import { AiControlled } from '@components/AiControlled'
import { Position } from '@components/Position'
import { MoveIntent } from '@events/movement'
import { PlayerTookTurn } from '@events/turn'
import { Tile } from '@game/tile'
import { Entity, System } from '@lib/ecs'
import { GameMap } from '@lib/gameMap'
import * as ROT from 'rot-js'

class AiSystem extends System {
    componentsRequired = new Set<Function>([AiControlled])
    private playerEntity: Entity
    public gameMap: GameMap<Tile>

    constructor(playerEntity: Entity, gameMap: GameMap<Tile>) {
        super()
        this.playerEntity = playerEntity
        this.gameMap = gameMap
    }

    public update(entities: Set<Entity>): void {}

    public registerEventHandlers(): void {
        this.eventBus.on(PlayerTookTurn, this.handlePlayerTookTurn.bind(this))
    }

    private handlePlayerTookTurn(event: PlayerTookTurn): void {
        const isPassableCallback = (x: number, y: number): boolean => {
            return this.gameMap.get(x, y).isWalkable
        }

        this.ecs.getEntitiesForSystem(this).forEach((entity) => {
            if (this.ecs.isEntityDead(entity)) {
                return
            }

            const container = this.ecs.getComponents(entity)
            const position = container.get(Position)
            if (!position) {
                return
            }

            const playerComponents = this.ecs.getComponents(this.playerEntity)
            const playerPosition = playerComponents.get(Position)

            const astar = new ROT.Path.AStar(
                playerPosition.x,
                playerPosition.y,
                isPassableCallback.bind(this)
            )

            const path = []
            astar.compute(position.x, position.y, (x, y) => {
                path.push({ x, y })
            })
            this.eventBus.emit(MoveIntent, new MoveIntent(entity, path[1].x - position.x, path[1].y - position.y))
        })
    }
}

export { AiSystem }
