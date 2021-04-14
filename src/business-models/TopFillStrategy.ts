import { IFactory, TileFactory } from "./IFactory"
import { IFillStrategy } from "./IFillStrategy"
import { ITile } from "./ITile"


/**
 * Конкретная реализация интерфейса стратегии заполнения плиток
 * заполнение сверху
 */
export class TopFillStrategy implements IFillStrategy {
  factory: IFactory<ITile> = new TileFactory()            // фабрика плиток


  /**
   * конкретная реализация метода заполнения пустых плиток
   * заполнение сверху
   * @param tiles двумерный массив плиток
   */
  fill(tiles: ITile[][]): ITile[][] {
    // создание каркаса результирующего массива
    const result = []
    for (let left = 0; left < tiles.length; ++left)
      result[left] = []

    // проход по каждому элементу массива начиная с нижнего ряда
    for (let left = 0; left < tiles.length; ++left) {
      for (let top = tiles[0].length - 1; top >= 0; --top) {
        const current = tiles[left][top]

        // механизм замены мертвой плитки
        if (current.dead && top > 0) {  // если это мертвая ячейка не в нулевом ряде
          let vacantTop = current.top   // запоминаем номер первой нижней мертвой при проходе вверх

          for (let i = top - 1; i >= 0; --i) {  // идем вверх от мертвой
            const upper = tiles[left][i]

            if (upper.dead) // если проверяемая мертвая - завершаем итерацию
              continue

            const clone = this.factory.create(upper)              // нашли живую. клонируем ее
            clone.top = vacantTop                                 // и обновляем координату верха
            result[left][vacantTop] = clone                       // ставим на свое место в результирующем массиве
            upper.dead = true                                     // убиваем найденную живую

            --vacantTop                                           // передвигаем указатель первой нижней мертвой вверх
          }

          // идем вниз от вершины ряда и создаем живые
          for (let i = 0; i <= vacantTop; ++i) {
            if (!result[left][i] || result[left][i] && (result[left][i] as ITile).dead) { // если ячейки нет либо она мертвая
              const newTile = this.factory.create()
              newTile.left = left
              newTile.top = i

              result[left][i] = newTile
            }
          }
        }
        else if (current.dead) {    // если это мертвая ячейка на нулевом ряде заменяем ее новой
          const newTile = this.factory.create()
          newTile.left = left
          newTile.top = top

          result[left][top] = newTile
        }
        else
          result[left][top] = tiles[left][top]
      }
    }

    return result
  }
}