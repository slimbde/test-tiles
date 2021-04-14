/**
 * интерфейс плитки
 */
export interface ITile {
  top: number         // координата Y
  left: number        // координата Х
  color: string       // цвет
  dead: boolean       // флаг мертвая - 1 или живая - 0
  clone(): ITile      // метод клонирования плитки
}



/**
 * конкретная реализация интерфейса
 */
export class SimpleTile implements ITile {
  top: number
  left: number
  color: string
  dead: boolean

  constructor(top?: number, left?: number, color?: string, dead?: boolean, other: ITile = null) {
    if (other) {
      this.top = other.top
      this.left = other.left
      this.color = other.color
      this.dead = other.dead
      return
    }

    this.top = top
    this.left = left
    this.color = color
    this.dead = dead
  }


  /**
   * метод для клонирования текущей плитки
   */
  clone(): ITile {
    return new SimpleTile(this.top, this.left, this.color, this.dead)
  }
}