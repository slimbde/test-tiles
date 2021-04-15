import { IConstructor } from "./src/ui-models/IConstructor"

declare global {
  interface Window {
    ctor: IConstructor
    render(what: string): void
    tileColors: string[]
    tileSize: number
    attempts: number
    goalPoints: number
  }
}