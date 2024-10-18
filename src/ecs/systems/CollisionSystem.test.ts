import { CollisionSystem } from './CollisionSystem'
import { GameMap } from '@lib/gameMap'
import { Position } from '@components/Position'
import { MoveIntent, Moved } from '@events/movement'
import { Tile } from '@game/tile'
import { ECS } from '@lib/ecs'
import { EventBus } from '@lib/eventing'
import { BlockMovement } from '@components/BlockMovement'

function fillGameMap(gameMap: GameMap<Tile>, width: number, height: number) {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            gameMap.set(x, y, {
                char: '.',
                colorFg: 'white',
                colorBg: 'black',
                isWalkable: true,
                isTransparent: true,
                isExplored: false
            })
        }
    }
}

describe('CollisionSystem', () => {
    let collisionSystem: CollisionSystem
    let gameMap: GameMap<Tile>
    let eventBus: EventBus
    let ecs: ECS

    beforeEach(() => {
        gameMap = new GameMap<Tile>()
        fillGameMap(gameMap, 2, 2)
        eventBus = new EventBus()
        ecs = new ECS()
        ecs.eventBus = eventBus
        collisionSystem = new CollisionSystem(gameMap)
        collisionSystem.ecs = ecs
        collisionSystem.eventBus = eventBus
        collisionSystem.registerEventHandlers()
    })

    it('should emit Moved event if movement is not blocked', () => {
        const entityId = ecs.addEntity()
        const position = new Position(0, 0)
        const moveIntent = new MoveIntent(entityId, 1, 0)

        ecs.addComponent(entityId, position)
        ecs.addComponent(entityId, new BlockMovement())

        const spy = jest.spyOn(eventBus, 'emit')
        
        eventBus.emit(MoveIntent, moveIntent)
        
        expect(spy).toHaveBeenNthCalledWith(1, MoveIntent, new MoveIntent(entityId, 1, 0))
        expect(spy).toHaveBeenNthCalledWith(2, Moved, new Moved(entityId, 1, 0))
    })

    it('should not emit Moved event if movement is blocked by map', () => {
        let tile = gameMap.get(1, 0)!
        gameMap.set(1, 0, { ...tile, isWalkable: false})
        const entityId = ecs.addEntity()
        ecs.addComponent(entityId, new Position(0, 0))

        const spy = jest.spyOn(eventBus, 'emit')
        
        eventBus.emit(MoveIntent, new MoveIntent(entityId, 1, 0))
        expect(spy).toHaveBeenCalledTimes(1)
    })
})