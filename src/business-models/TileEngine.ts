import { IEngine } from "./IEngine"
import { IFactory, TileFactory } from "./IFactory"
import { IFillStrategy } from "./IFillStrategy"
import { ITile } from "./ITile"
import { RightFillStrategy } from "./RightFillStrategy"
import { TopFillStrategy } from "./TopFillStrategy"

/**
 * конкретная реализация игрового движка
 * вариант
 */
export class TileEngine implements IEngine {
  private tileFactory: IFactory<ITile> = new TileFactory()    // плиточная фабрика
  private strategy: IFillStrategy                             // стратегия смещения плиток
  private currentColor: string                                // текущий сжигаемый цвет

  public attempts: number                                     // счетчик доступных ходов
  public goalPoints: number                                   // необходимое количество очков
  public userPoints: number                                   // набранное количество очков
  public tileSet: ITile[][]                                   // текущий набор плиток
  public gameStatus: string                                   // статус игрового процесса
  public numShuffles: number                                  // количество перемешиваний


  // инициализация класса
  constructor(width: number, height: number) {
    // инициализация стратегии заполнения плиток
    this.strategy = new TopFillStrategy()

    // инициализация игровых переменных
    this.attempts = window.attempts
    this.goalPoints = window.goalPoints
    this.userPoints = 0
    this.gameStatus = "playing"
    this.numShuffles = window.shuffles

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


  /**
   * изменить стратегию заполнения
   * @param name имя выбранной стратегии заполнения плиток
   */
  alterStrategy(name: string): void {
    switch (name) {
      case "Сверху": this.strategy = new TopFillStrategy(); break
      case "Справа": this.strategy = new RightFillStrategy(); break

      default: break
    }
  }


  /**
   * перемешать плитки на поле
   */
  shuffle(): ITile[][] {
    const expand = this.tileSet.reduce((acc, val) => acc.concat(...val), []) as ITile[]

    for (let i = expand.length - 1; i > 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1));
      [expand[i], expand[rand]] = [expand[rand], expand[i]]
    }

    let i = 0
    for (let left = 0; left < this.tileSet.length; ++left) {
      for (let top = 0; top < this.tileSet[0].length; ++top) {
        this.tileSet[left][top] = expand[i]
        expand[i].left = left
        expand[i].top = top
        ++i
      }
    }

    --this.numShuffles
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
    else if (this.userPoints >= this.goalPoints)
      this.gameStatus = "victory"
    else
      this.gameStatus = "game-over"
  }
}