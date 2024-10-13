class RenderableComponent {
    char: string
    colorFg: string
    colorBg: string

    constructor(char: string, colorFg: string, colorBg: string) {
        this.char = char
        this.colorFg = colorFg
        this.colorBg = colorBg
    }
}

export default RenderableComponent
