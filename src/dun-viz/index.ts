import { DungeonGenerator1 } from "@dun-gen/index";
import { Renderer } from "./render";

interface Options {
  tilesX: number;
  tilesY: number;
}

function renderDungeon(renderer: Renderer, dungeon: number[][]) {
  renderer.clear();
  for (let y = 0; y < dungeon.length; y++) {
    for (let x = 0; x < dungeon[y].length; x++) {
      renderer.draw(
        x * renderer.tileWidth,
        y * renderer.tileHeight,
        dungeon[y][x]
      );
    }
  }
}

function registerCanvas(): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.getElementById("display") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error("Canvas not found");
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Context not found");
  }
  canvas.width = window.innerHeight;
  canvas.height = window.innerHeight;

  return { canvas, ctx };
}

function main(options: Options): void {
  const { canvas, ctx } = registerCanvas();

  const renderer = new Renderer(ctx, options);

  const generator = new DungeonGenerator1(options.tilesX, options.tilesY);
  const dungeon: Generator<number[][], number[][], void> = generator.generate();

  function step() {
    const { value, done } = dungeon.next();
    if (!done) {
      renderDungeon(renderer, value);
        // requestAnimationFrame(step);
      setTimeout(step, 50);
    } else {
      console.log("done");
    }
  }

  step();
}

main({
  tilesX: 80,
  tilesY: 80,
});
