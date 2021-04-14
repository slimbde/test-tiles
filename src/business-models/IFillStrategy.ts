import { ITile } from "./ITile";

/**
 * Интерфейс стратегии заполнения плиток
 */
export interface IFillStrategy {

  /**
   * Заполнить пустые плитки особым образом
   * @param tiles двумерный массив плиток
   */
  fill(tiles: ITile[][]): ITile[][]
}
