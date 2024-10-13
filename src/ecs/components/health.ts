class HealthComponent {
    public current: number
    public max: number

    constructor(current: number, max: number) {
        this.current = current
        this.max = max
    }
}

export default HealthComponent
