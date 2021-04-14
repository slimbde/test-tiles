import { IFactory, TileFactory } from "./IFactory";
import { TopFillStrategy } from "./TopFillStrategy";
import { IFillStrategy } from "./IFillStrategy";
import { ITile } from "./ITile";


/**
 * интерфейс игрового плиточного движка
 * набор необходимых методов
 */
export interface IEngine {
  tileSet: ITile[][]                            // текущий набор плиток
  burn(left: number, top: number): ITile[][]    // сжечь прилежащие плитки в точке
  fill(): ITile[][]                             // заполнить пустые плитки
}



/**
 * конкретная реализация игрового движка
 * вариант
 */
export class TileEngine implements IEngine {
  private tileFactory: IFactory<ITile> = new TileFactory()    // плиточная фабрика
  private strategy: IFillStrategy = new TopFillStrategy()     // стратегия смещения плиток
  private currentColor: string                                // текущий сжигаемый цвет

  public tileSet: ITile[][]                                   // текущий набор плиток


  // инициализация набора плиток
  constructor(width: number, height: number) {
    this.tileSet = []

    for (let left = 0; left < width; ++left) {
      this.tileSet[left] = []

      for (let top = 0; top < height; ++top) {
        const newOne = this.tileFactory.create()
        newOne.left = left;
        newOne.top = top;
        this.tileSet[left][top] = newOne
      }
    }
  }


  /**
   * сжигает смежные плитки и возвращает набор
   * @param left координата Х
   * @param top координата Y
   */
  burn(left: number, top: number): ITile[][] {
    this.currentColor = this.tileSet[left][top].color
    this.killAdjacent(left, top)
    return this.tileSet
  }

  /**
   * заполнить пустые плитки
   */
  fill(): ITile[][] {
    this.tileSet = this.strategy.fill(this.tileSet)
    return this.tileSet
  }



  /////////////////////////////// PRIVATE SECTION
  /**
   * сжигает смежние плитки (нужна для рекурсивного сжигания)
   * @param left координата Х
   * @param top координата Y
   */
  private killAdjacent(left: number, top: number): void {
    const baseCell = this.tileSet[left][top]
    baseCell.dead = true

    //this.tryKill(left - 1, top - 1)
    //this.tryKill(left + 1, top - 1)
    //this.tryKill(left + 1, top + 1)
    //this.tryKill(left - 1, top + 1)
    this.tryKill(left, top - 1)
    this.tryKill(left, top + 1)
    this.tryKill(left + 1, top)
    this.tryKill(left - 1, top)
  }


  /**
   * сжигает смежные плитки выбранной точки (нужна для рекурсивного сжигания)
   * @param left координата Х
   * @param top координата Y 
   */
  private tryKill(left: number, top: number): void {
    if (this.validPoint(left, top)) {
      const current = this.tileSet[left][top]

      if (current.dead)
        return

      if (current.color === this.currentColor) {
        current.dead = true
        this.killAdjacent(current.left, current.top)
      }
    }
  }


  /**
   * проверяет валидность координат точки (есть ли индексы в массиве)
   * @param left координата Х
   * @param top координата Y 
   */
  private validPoint(left: number, top: number): boolean {
    return left < this.tileSet.length
      && left >= 0
      && top >= 0
      && top < this.tileSet[0].length
  }
}