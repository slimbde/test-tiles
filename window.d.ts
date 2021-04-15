import { IConstructor } from "./src/ui-models/IConstructor"

declare global {
  interface Window {
    ctor: IConstructor            // экземпляр текущего конструктора
    render(what: string): void    // функция отрисовки представления
    tileSize: number              // размер плиток
    attempts: number              // количество ходов
    goalPoints: number            // количество необходимых очков
    shuffles: number              // доступное количество перемешиваний по умолчанию
  }
}