import { IFactory, TileFactory } from "./IFactory"
import { IFillStrategy } from "./IFillStrategy"
import { ITile } from "./ITile"


/**
 * Конкретная реализация интерфейса стратегии заполнения плиток
 * заполнение сбоку
 */
export class RightFillStrategy implements IFillStrategy {
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

    // проход по каждому элементу массива
    for (let left = 0; left < tiles.length; ++left) {
      for (let top = 0; top < tiles[0].length; ++top) {
        const current = tiles[left][top]

        // механизм замены мертвой плитки
        if (current.dead && left < tiles.length) {          // если это мертвая ячейка не в крайнем правом столбце
          let vacantLeft = current.left                     // запоминаем номер первой левой мертвой при проходе справа налево

          for (let i = left + 1; i < tiles.length; ++i) {   // идем вправо от мертвой
            const rightOne = tiles[i][top]

            if (rightOne.dead)                              // если проверяемая мертвая - завершаем итерацию
              continue

            const clone = this.factory.create(rightOne)            // нашли живую. клонируем ее
            clone.left = vacantLeft                                // и обновляем координату X
            result[vacantLeft][top] = clone                        // ставим на свое место в результирующем массиве
            rightOne.dead = true                                   // убиваем найденную живую

            ++vacantLeft                                           // передвигаем указатель первой левой мертвой вправо
          }

          // идем влево от последней правой ряда и создаем живые
          for (let i = tiles.length - 1; i >= vacantLeft; --i) {
            if (!result[i][top] || result[i][top] && (result[i][top] as ITile).dead) { // если ячейки нет либо она мертвая
              const newTile = this.factory.create()
              newTile.left = i
              newTile.top = top

              result[i][top] = newTile
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