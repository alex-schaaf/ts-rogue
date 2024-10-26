import TileType from "./TileType";

interface RendererOptions {
  tilesX: number;
  tilesY: number;
}

export class Renderer {
  public tileWidth: number;
  public tileHeight: number;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public options: RendererOptions
  ) {
    this.ctx = ctx;
    this.options = options;

    // scale size of tiles to fit canvas
    this.tileWidth = Math.floor(this.ctx.canvas.width / this.options.tilesX);
    this.tileHeight = Math.floor(this.ctx.canvas.height / this.options.tilesY);
  }

  public draw(x: number, y: number, tile: TileType) {
    switch (tile) {
      case TileType.Wall:
        this.drawRect(x, y, "#000");
        break;
      case TileType.Floor:
        this.drawRect(x, y, "#fff");
        break;
      case TileType.Door:
        this.drawRect(x, y, "#00f");
        break;
      case TileType.Corridor:
        this.drawRect(x, y, "#f00");
        break;
    }
  }

  private drawRect(x: number, y: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, this.tileWidth, this.tileHeight);
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}
