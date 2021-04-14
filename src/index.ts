import './styles.css'
import { TileConstructor } from "./ui-models/TileConstructor";



/////////////////// инициализация глобальной функции отрисовки (для использования в меню)
window.render = (what: string): void => {

  // если несколько представлений, сюда можно разные реализации конструктора записать
  // и обращаться к глобальной функции отрисовки по разному рисуя представление (полиморфизм)
  switch (what) {
    case "home": window.ctor = new TileConstructor; break

    default: throw new Error(`Can't find apt constructor`)
  }

  window.ctor.render()
}