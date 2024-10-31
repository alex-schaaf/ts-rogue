class Camera {
    constructor(
        public width: number,
        public height: number,
        public centerX: number,
        public centerY: number
    ) {}

    public moveBy(x: number, y: number): void {
        this.centerX += x
        this.centerY += y
    }

    public moveTo(x: number, y: number): void {
        this.centerX = x
        this.centerY = y
    }

    public getBounds(): { x0: number; y0: number; x1: number; y1: number } {
        return {
            x0: this.centerX - Math.floor(this.width / 2),
            y0: this.centerY - Math.floor(this.height / 2),
            x1: this.centerX + Math.floor(this.width / 2),
            y1: this.centerY + Math.floor(this.height / 2),
        }
    }

    public isVisible(x: number, y: number): boolean {
        const bounds = this.getBounds()
        return (
            x >= bounds.x0 && x <= bounds.x1 && y >= bounds.y0 && y <= bounds.y1
        )
    }

    public getVisibleCoords(): [number, number][] {
        const bounds = this.getBounds()
        const coords: [number, number][] = []
        for (let x = bounds.x0; x <= bounds.x1; x++) {
            for (let y = bounds.y0; y <= bounds.y1; y++) {
                coords.push([x, y])
            }
        }
        return coords
    }
}

export { Camera }
