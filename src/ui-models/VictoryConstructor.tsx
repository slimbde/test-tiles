import { IConstructor } from "./IConstructor"

/**
 * Конкретная реализация - Конструктор победной страницы
 */
export class VictoryConstructor implements IConstructor {

  /**
   * реализация интерфейса
   * рисует текущее состояние игры
   */
  public render(): void {
    const root = document.getElementById("field") as HTMLDivElement
    root.style.opacity = "0"
    setTimeout(_ => root.style.display = "none")

    const victory = document.querySelector(".victory") as HTMLDivElement
    victory.style.opacity = "1"
  }
}