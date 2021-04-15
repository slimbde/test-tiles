import { IEngine, TileEngine } from "../business-models/IEngine"
import { ITile } from "../business-models/ITile"
import { IConstructor } from "./IConstructor"

/**
 * Конкретная реализация - плиточный конструктор
 */
export class TileConstructor implements IConstructor {
  private engine: IEngine       // игровой движок приложения
  private tileSet: ITile[][]    // активный набор приток
  private root: HTMLDivElement  // поле для отрисовки плиток
  private rootWidth: number     // ширина поля
  private rootHeight: number    // высота поля
  private scores: HTMLDivElement


  constructor() {
    this.rootWidth = parseInt((document.getElementById("width") as HTMLInputElement).value)
    this.rootHeight = parseInt((document.getElementById("height") as HTMLInputElement).value)
    this.scores = document.querySelector(".scores") as HTMLDivElement

    this.engine = new TileEngine(this.rootWidth, this.rootHeight)
    this.tileSet = this.engine.tileSet

    this.root = document.getElementById("field") as HTMLDivElement
    this.root.style.width = `calc(${this.rootWidth}px * ${window.tileSize} + 2rem + 2px)`
    this.root.style.height = `calc(${this.rootHeight}px * ${window.tileSize} + 2rem + 2px)`
  }


  /**
   * реализация интерфейса
   * рисует текущее состояние игры
   */
  public render(): void {
    this.scores.innerHTML = `Попыток: ${this.engine.attempts}&nbsp;&nbsp;&nbsp; Очки: ${this.engine.userPoints} &nbsp;&nbsp;&nbsp; Необходимо набрать: ${this.engine.goalPoints}`

    if (this.engine.gameStatus === "victory") {
      this.scores.classList.add("good-scores")
      window.render("victory")
      return
    }

    if (this.engine.gameStatus === "game-over") {
      this.scores.classList.add("fail-scores")
      window.render("game-over")
      return
    }


    this.root.style.opacity = "1"
    this.root.innerHTML = ""
    const offset = 15;

    for (let left = 0; left < this.rootWidth; ++left) {
      for (let top = 0; top < this.rootHeight; ++top) {
        const current = this.tileSet[left][top]

        const tile = document.createElement("div")
        tile.className = "tile"
        tile.style.width = window.tileSize + "px"
        tile.style.height = window.tileSize + "px"
        tile.style.backgroundColor = current.color
        current.dead && tile.classList.add("dead-tile")

        tile.onclick = _ => {
          this.tileSet = this.engine.burn(left, top)
          setTimeout(_ => {
            this.render()
            this.tileSet = this.engine.fill()
            setTimeout(_ => this.render(), 1000)
          }, 100)
        }

        tile.style.left = left * window.tileSize + offset + "px"
        tile.style.top = top * window.tileSize + offset + "px"
        this.root.appendChild(tile)
      }
    }
  }
}