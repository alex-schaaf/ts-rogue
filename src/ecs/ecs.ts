// https://maxwellforbes.com/posts/typescript-ecs-implementation/

import { EventBus } from './eventing'

/**
 * Entity is a unique identifier for an entity in the ECS, used to look up its
 * components.
 */
type Entity = number

/**
 * Component is a base class for all Components in the ECS. It's sole purpose is
 * to hold state. Every component instance is associated with an entity.
 */
abstract class Component {}

/**
 * A system cares about a specific set of Components.
 */
abstract class System {
    public abstract componentsRequired: Set<Function>

    /**
     * update() is called every frame with a set of entities.
     */
    public abstract update(entities: Set<Entity>): void

    public abstract registerEventHandlers(): void

    public ecs: ECS
    public eventBus: EventBus
}

type ComponentClass<T extends Component> = new (...args: any[]) => T

class ComponentContainer {
    private map = new Map<Function, Component>()

    public add(component: Component): void {
        this.map.set(component.constructor, component)
    }

    public get<T extends Component>(componentClass: ComponentClass<T>): T {
        return this.map.get(componentClass) as T
    }

    public has(componentClass: Function): boolean {
        return this.map.has(componentClass)
    }

    public hasAll(componentClasses: Iterable<Function>): boolean {
        for (const cls of componentClasses) {
            if (!this.map.has(cls)) {
                return false
            }
        }
        return true
    }

    public delete(componentClass: Function): void {
        this.map.delete(componentClass)
    }
}

class ECS {
    // Main state
    private entities = new Map<Entity, ComponentContainer>()
    private systems = new Map<System, Set<Entity>>()

    // Entity management
    private nextEntityId = 0
    private entitiesToDestroy = new Array<Entity>()

    // Eventing
    public eventBus = new EventBus()

    // API: Entities
    public addEntity(): Entity {
        let entity = this.nextEntityId
        this.nextEntityId++
        this.entities.set(entity, new ComponentContainer())
        console.debug('ECS.entities', this.entities)
        return entity
    }

    public getEntitiesForSystem(system: System): Set<Entity> {
        return this.systems.get(system) || new Set()
    }

    /**
     * Store entities that are to be destroyed at the end of the frame. This way
     * we avoid removing entities that might still be processed by a system.
     */
    public removeEntity(entity: Entity): void {
        this.entitiesToDestroy.push(entity)
    }

    // API: Components
    public addComponent(entity: Entity, component: Component): void {
        this.entities.get(entity).add(component)
        this.checkE(entity)
    }

    public getComponents(entity: Entity): ComponentContainer {
        return this.entities.get(entity)
    }

    public removeComponent(entity: Entity, componentClass: Function): void {
        this.entities.get(entity).delete(componentClass)
        this.checkE(entity)
    }

    // API: Systems
    public addSystem(system: System): void {
        // Systems should not have an empty set of Components, otherwise they'd
        // run on every entity in the ECS.
        if (system.componentsRequired.size === 0) {
            console.warn('System not added: empty Components list.')
            console.warn(system)
            return
        }

        // Give the system a reference to the ECS.
        system.ecs = this
        system.eventBus = this.eventBus

        system.registerEventHandlers()

        // Add the system to the list of systems and add any existing Entities
        // that it needs to track.
        this.systems.set(system, new Set())
        for (const entity of this.entities.keys()) {
            this.checkES(entity, system)
        }
    }

    /**
     * Update all systems. Usually called once per ticks.
     */
    public update(): void {
        // Update all systems.
        for (const [system, entities] of this.systems.entries()) {
            system.update(entities)
        }

        // Remove entities that were marked for destruction during the update.
        while (this.entitiesToDestroy.length > 0) {
            const entity = this.entitiesToDestroy.pop()
            if (entity !== undefined) {
                this.destroyEntity(entity)
            }
        }
    }

    // Internal
    private destroyEntity(entity: Entity): void {
        this.entities.delete(entity)
        for (const system of this.systems.keys()) {
            this.entities.delete(entity)
        }
    }

    private checkE(entity: Entity): void {
        for (const system of this.systems.keys()) {
            this.checkES(entity, system)
        }
    }

    private checkES(entity: Entity, system: System): void {
        let have = this.entities.get(entity)
        let need = system.componentsRequired
        if (have && have.hasAll(need)) {
            this.systems.get(system)?.add(entity)
        } else {
            this.systems.get(system)?.delete(entity)
        }
    }
}

export { Component, System, ECS, Entity, ComponentClass }
