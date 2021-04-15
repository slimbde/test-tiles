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
  numShuffles: number                           // доступное число перемешиваний

  burn(left: number, top: number): ITile[][]    // сжечь прилежащие плитки в точке
  fill(): ITile[][]                             // заполнить пустые плитки
  alterStrategy(name: string): void             // метод изменения стратегии заполнения плиток
  shuffle(): ITile[][]                          // перемешивает текущий набор плиток на поле
}
