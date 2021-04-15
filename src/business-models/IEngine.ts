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
  attempts: number                              // счетчик доступных ходов
  goalPoints: number                            // необходимое количество очков
  userPoints: number                            // набранное количество очков       
  gameStatus: string                            // статус игрового процесса

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

  public attempts: number                                     // счетчик доступных ходов
  public goalPoints: number                                   // необходимое количество очков
  public userPoints: number                                   // набранное количество очков
  public tileSet: ITile[][]                                   // текущий набор плиток
  public gameStatus: string                                   // статус игрового процесса


  // инициализация класса
  constructor(width: number, height: number) {
    // инициализация игровых переменных
    this.attempts = window.attempts
    this.goalPoints = window.goalPoints
    this.userPoints = 0
    this.gameStatus = "playing"

    this.tileSet = []

    // генерация нового массива плиток
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
    --this.attempts           // уменьшаем счетчик доступных ходов

    this.currentColor = this.tileSet[left][top].color
    this.killAdjacent(left, top)

    // выставляем текущий статус игрового процесса
    // тут может быть логика. Для упрощения вынесено в функцию
    this.calculateGameStatus()

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
    baseCell.dead = true    // убиваем нажатую плитку
    this.userPoints += 100  // начисляем очки за убитую плитку

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

      if (current.dead) // если плитка уже мертва - выходим
        return

      // если текущая нужного цвета - убиваем плитку и рекурсивно проверяем смежные
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


  /**
   * рассчет статуса игрового процесса
   */
  calculateGameStatus(): void {
    if (this.attempts > 0) {
      if (this.userPoints >= this.goalPoints)
        this.gameStatus = "victory"
    }
    else
      this.gameStatus = "game-over"
  }
}