import { IConstructor } from "./IConstructor"

/**
 * Конкретная реализация - Конструктор страницы конца игры
 */
export class GameOverConstructor implements IConstructor {

  /**
   * реализация интерфейса
   * рисует текущее состояние игры
   */
  public render(): void {
    const root = document.getElementById("field") as HTMLDivElement
    root.style.opacity = "0"
    root.style.display = "none"

    const gameOver = document.querySelector(".game-over") as HTMLDivElement
    gameOver.style.opacity = "1"
  }
}