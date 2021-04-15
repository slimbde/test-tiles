import './styles.css'
import { GameOverConstructor } from "./ui-models/GameOverConstructor";
import { TileConstructor } from "./ui-models/TileConstructor";
import { VictoryConstructor } from "./ui-models/VictoryConstructor";


// глобальная функция отрисовки
window.render = (what: string): void => {

  // если несколько представлений, сюда можно разные реализации конструктора записать
  // и обращаться к глобальной функции отрисовки по разному рисуя представление (полиморфизм)
  switch (what) {
    case "home": window.ctor = new TileConstructor(); break
    case "game-over": window.ctor = new GameOverConstructor(); break
    case "victory": window.ctor = new VictoryConstructor(); break

    default: throw new Error(`Can't find apt constructor`)
  }

  window.ctor.render()
}

window.render("home")