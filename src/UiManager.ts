import { GRID_COLS, GRID_ROWS, STARTING_BET, STARTING_CASH } from "./configs/game";
import { Dropable } from "./entities/Dropable";
import { EventEmitter } from "./tools/EventEmitter";
import { querySelectElemnt } from "./tools/helpers";

export class UiManager {
  private EventEmmiter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.EventEmmiter = eventEmitter;
  }

  private initListeners(): void {
    this.EventEmmiter.on("cashChanged", (cash) => this.renderCash(cash));
    this.EventEmmiter.on("betChanged", (bet) => this.renderBet(bet));
    this.EventEmmiter.on("win", (win) => this.renderWin(win));
  }

  public init(): void {
    this.initListeners();
    this.generateSlotGrid();
    this.renderCash(STARTING_CASH);
    this.renderBet(STARTING_BET);
  }

  public renderFSCount(count: number): void {
    querySelectElemnt(".fs-count").textContent = count === 0 ? "" : count.toString();
  }

  private renderCash(amount: number): void {
    querySelectElemnt("#balance").textContent = amount.toString();
  }

  private renderBet(amount: number): void {
    querySelectElemnt("#bet").textContent = amount.toString();
  }

  private renderWin(amount: number): void {
    const el = querySelectElemnt("#win")
    el.textContent = amount.toString();
    setTimeout(() => el.textContent = "0", 3500);
  }

  private generateSlotGrid(): void {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", row.toString());
        cell.setAttribute("data-col", col.toString());
        const cellInner = document.createElement("div");
        cellInner.classList.add("cell-inner");

        const frontSide = document.createElement("div");
        frontSide.classList.add("front-side");

        const backSide = document.createElement("div");
        backSide.classList.add("back-side");

        cellInner.appendChild(frontSide);
        cellInner.appendChild(backSide);
        cell.appendChild(cellInner);

        document.querySelector(".slot")?.appendChild(cell);
      }
    }
  }

  public async renderDrops(grid: (Dropable | null)[][]): Promise<void> {
    await this.removeFlippedClass();
    this.deleteSymbolElements();

    grid.forEach((row, rowIndex) => {
      row.forEach((dropable, colIndex) => {
        if (dropable) {
          const cell = document.querySelector(
            `.cell[data-row="${rowIndex}"][data-col="${colIndex}"]`
          ) as HTMLElement;
          if (!cell) return;

          cell.setAttribute("data-identifier", dropable.identifier);

          const cellInner = cell.querySelector(".cell-inner");
          if (!cellInner) return;

          setTimeout(() => {
            cellInner.classList.add("flipped");
          }, 100 * (rowIndex + colIndex) + 1000);

          const backSide = cell.querySelector(".back-side");
          if (!backSide) return;

          const symbolElement = document.createElement("span");
          symbolElement.classList.add("symbol");
          symbolElement.textContent = dropable.symbol;

          if (dropable.identifier === "wild" || dropable.identifier === "scatter") {
            const specialSymbol = document.createElement("span");
            specialSymbol.textContent = dropable.identifier === "wild" ? "W" : "FS";
            symbolElement.appendChild(specialSymbol);
          }
          backSide.appendChild(symbolElement);
        }
      });
    });
  }

  private deleteSymbolElements(): void {
    const symbols = document.querySelectorAll(".symbol");
    symbols.forEach((symbol) => symbol.remove());
  }

  private removeFlippedClass(): Promise<void> {
    const cells = document.querySelectorAll(".cell-inner");
    cells.forEach((cell) => cell.classList.remove("flipped"));
    return new Promise((resolve) => setTimeout(resolve, 300));
  }
}
