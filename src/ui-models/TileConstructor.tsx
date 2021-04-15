import { IEngine } from "../business-models/IEngine"
import { ITile } from "../business-models/ITile"
import { TileEngine } from "../business-models/TileEngine"
import { IConstructor } from "./IConstructor"

/**
 * Конкретная реализация - плиточный конструктор
 */
export class TileConstructor implements IConstructor {
  private engine: IEngine           // игровой движок приложения
  private tileSet: ITile[][]        // активный набор приток
  private root: HTMLDivElement      // поле для отрисовки плиток
  private rootWidth: number         // ширина поля
  private rootHeight: number        // высота поля
  private scores: HTMLDivElement


  constructor() {
    // скрываем картинки конца игры и победы
    (document.querySelector(".game-over") as HTMLDivElement).style.opacity = "0";
    (document.querySelector(".victory") as HTMLDivElement).style.opacity = "0"

    this.scores = document.querySelector(".scores") as HTMLDivElement
    this.scores.classList.remove("good-scores")
    this.scores.classList.remove("fail-scores")

    // инициализация поля для плиток
    this.rootWidth = parseInt((document.getElementById("width") as HTMLInputElement).value)
    this.rootHeight = parseInt((document.getElementById("height") as HTMLInputElement).value)
    this.root = document.getElementById("field") as HTMLDivElement
    this.root.style.width = `calc(${this.rootWidth}px * ${window.tileSize} + 2rem + 2px)`
    this.root.style.height = `calc(${this.rootHeight}px * ${window.tileSize} + 2rem + 2px)`

    this.root.style.opacity = "0"

    setTimeout(_ => {
      this.root.style.opacity = "1"
      this.root.style.display = "flex"
    }, 500)

    // инициализация селекта с выбором стратегий
    const strategySelect = document.getElementById("strategy") as HTMLSelectElement
    strategySelect.onchange = (e: any) => this.engine.alterStrategy(e.target.value)
    strategySelect.style.cursor = "pointer"

    // инициализация движка 
    this.engine = new TileEngine(this.rootWidth, this.rootHeight)
    this.engine.alterStrategy(strategySelect.value)
    this.tileSet = this.engine.tileSet

    // добавление кнопки перемешивания поля
    let btn = document.getElementById("shuffle") as HTMLButtonElement
    !btn && (btn = document.createElement("button"))
    btn.style.display = "flex"
    btn.id = "shuffle"
    btn.className = "btn"
    btn.textContent = `Перемешать: ${this.engine.numShuffles}`
    btn.onclick = _ => {
      this.tileSet = this.engine.shuffle()
      btn.textContent = `Перемешать: ${this.engine.numShuffles}`
      this.engine.numShuffles == 0 && (btn.style.display = "none")
      this.render()
    }
    const menu = document.querySelector(".menu") as HTMLDivElement
    menu.appendChild(btn)
  }


  /**
   * реализация интерфейса
   * рисует текущее состояние игры
   */
  public render(): void {
    this.scores.innerHTML = `Попыток: ${this.engine.attempts}&nbsp;&nbsp;&nbsp; Очки: ${this.engine.userPoints} &nbsp;&nbsp;&nbsp; Необходимо набрать: ${this.engine.goalPoints}`

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

            setTimeout(_ => {
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

              this.render()
            }, 1000)
          }, 100)
        }

        tile.style.left = left * window.tileSize + offset + "px"
        tile.style.top = top * window.tileSize + offset + "px"
        this.root.appendChild(tile)
      }
    }
  }
}