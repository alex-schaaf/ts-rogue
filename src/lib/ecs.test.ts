import { ECS, System, Component, Entity } from './ecs'
import { EventBus } from './eventing'

class TestComponentA extends Component {}
class TestComponentB extends Component {}

class TestSystem extends System {
    public componentsRequired = new Set<Function>([
        TestComponentA,
        TestComponentB,
    ])

    public update(entities: Set<Entity>): void {
        // Mock update logic
    }

    public registerEventHandlers(): void {
        // Mock event handler registration
    }
}

describe('ECS System', () => {
    let ecs: ECS
    let eventBus: EventBus
    let system: TestSystem
    let entity: Entity

    beforeEach(() => {
        ecs = new ECS()
        eventBus = new EventBus()
        system = new TestSystem()
        ecs.addSystem(system)
        entity = ecs.addEntity()
    })

    test('should add and remove components from entity correctly', () => {
        const componentA = new TestComponentA()
        const componentB = new TestComponentB()

        ecs.addComponent(entity, componentA)
        ecs.addComponent(entity, componentB)

        expect(ecs.getComponents(entity).get(TestComponentA)).toBe(componentA)
        expect(ecs.getComponents(entity).get(TestComponentB)).toBe(componentB)
        
        ecs.removeComponent(entity, TestComponentA)
        expect(ecs.getComponents(entity).get(TestComponentA)).toBeUndefined()
        expect(ecs.getComponents(entity).get(TestComponentB)).toBe(componentB)

    })

    test('adding a system should register event handlers', () => {
        const spy = jest.spyOn(system, 'registerEventHandlers')
        ecs.addSystem(system)
        expect(spy).toHaveBeenCalled()
    })

    test('removing entity will mark it as dead and delete it during update', () => {
        ecs.removeEntity(entity)
        expect(ecs.isEntityDead(entity)).toBe(true)
        // the entity was only soft removed, it should still be in the ECS
        expect(ecs.getComponents(entity)).not.toBe(undefined)
        ecs.update()
        // the entity should now be destroyed
        expect(ecs.getComponents(entity)).toBe(undefined)
    })

    test('adding a component should add the entity to the entitiesWithComponent map', () => {
        ecs.addComponent(entity, new TestComponentA())
        expect(ecs.getEntitiesWithComponent(TestComponentA).has(entity)).toBe(true)
    })

    test('removing a component should remove the entity from the entitiesWithComponent map', () => {
        ecs.addComponent(entity, new TestComponentA())
        ecs.removeComponent(entity, TestComponentA)
        expect(ecs.getEntitiesWithComponent(TestComponentA).has(entity)).toBe(false)
    })

    test('getEntitiesWithComponents should return entities with all specified components', () => {
        const componentA = new TestComponentA()
        const componentB = new TestComponentB()
        const entity1 = ecs.addEntity()
        const entity2 = ecs.addEntity()

        ecs.addComponent(entity1, componentA)
        ecs.addComponent(entity1, componentB)
        ecs.addComponent(entity2, componentA)

        const entities = ecs.getEntitiesWithComponents([TestComponentA, TestComponentB])
        expect(entities.has(entity1)).toBe(true)
        expect(entities.has(entity2)).toBe(false)
    })

    test('getEntitiesWithComponents should return an empty set if no entities have all specified components', () => {
        const componentA = new TestComponentA()
        const entity1 = ecs.addEntity()
        ecs.addComponent(entity1, componentA)

        const entities = ecs.getEntitiesWithComponents([TestComponentA, TestComponentB])
        expect(entities.size).toBe(0)
    })

    test('getEntitiesWithComponents should return an empty set if no entities have any of the specified components', () => {
        const entities = ecs.getEntitiesWithComponents([TestComponentA, TestComponentB])
        expect(entities.size).toBe(0)
    })
})
