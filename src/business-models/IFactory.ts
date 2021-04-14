import { ITile, SimpleTile } from "./ITile";


/**
 * интерфейс шаблонной фабрики
 */
export interface IFactory<T> {

  /**
   * создать новую сущность
   * @param template параметр для клонирования
   */
  create(template?: T): T;
}




/**
 * конкретная реализация фабрики
 * разделяет абстракцию ITile и реализацию Tile
 */
export class TileFactory implements IFactory<ITile> {

  /**
   * создает новую сущность типа ITile либо клонирует по шаблону
   * @param template шаблон для клонирования
   */
  create(template?: ITile): ITile {
    if (template)
      return template.clone()

    const color = window.tileColors[Math.floor(window.tileColors.length * Math.random())]
    return new SimpleTile(0, 0, color, false)
  }
}