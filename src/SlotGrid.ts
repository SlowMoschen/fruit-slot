import { DropableComboSize, possibleDrops } from "./configs/dropables";
import { FREESPIN_THRESHOLD, GRID_COLS, GRID_ROWS, winningPatterns } from "./configs/game";
import { Dropable } from "./entities/Dropable";
import { EventEmitter } from "./tools/EventEmitter";
import { isDropableAllowedBasedOnDropChance } from "./tools/helpers";

export class SlotGrid {
  public areFreespinsActive: boolean = false;
  private readonly grid: (Dropable | null)[][] = new Array(GRID_ROWS)
    .fill(null)
    .map(() => new Array(GRID_COLS).fill(null));
  private readonly EventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.EventEmitter = eventEmitter;
    this.initListeners();
  }

  public generateDrops() {
    this.clearGrid();
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        this.setDropable(row, col, this.generateDropable(row, col));
      }
    }
    this.EventEmitter.emit("dropsGenerated");
  }

  public getGrid(): (Dropable | null)[][] {
    return this.grid;
  }

  private initListeners() {
    this.EventEmitter.on("dropsGenerated", () => {
      this.checkForWinningLines();
      this.checkForScatters();
    });
    this.EventEmitter.on("winningLines", (winningLines) => this.handleWinningLines(winningLines));
  }

  private generateDropable(row: number, col: number): Dropable {
    const randomDrop = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];

    if (isDropableAllowedBasedOnDropChance(randomDrop.dropChance)) {
      const drop = new Dropable(randomDrop.symbol, randomDrop.identifier, randomDrop.value);
      drop.setPosition(row, col);
      return drop;
    }

    return this.generateDropable(row, col);
  }

  private setDropable(row: number, col: number, dropable: Dropable) {
    this.grid[row][col] = dropable;
  }

  private clearGrid() {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        this.grid[row][col] = null;
      }
    }
  }

  private checkForWinningLines() {
    const getPatternIndexes = (pattern: number[][]) => {
      let indexes: Record<string, number>[] = [];
      for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
          if (pattern[i][j] === 1) {
            indexes.push({ row: i, col: j });
          }
        }
      }

      // sort the indexes by column
      indexes.sort((a, b) => a.col - b.col);
      return indexes;
    };

    const getPatternValues = (indicies: Record<string, number>[]) => {
      let values: string[] = [];

      for (const index of indicies) {
        const identifier = this.grid[index.row][index.col]?.identifier || ""; // Provide a default value if the identifier is undefined
        values.push(identifier);
      }

      return values;
    };

    const countSymbolsOnLine = (line: string[]) => {
      const count = new Map<string, number>();
      const firstSymbol = line[0];

      for (let i = 0; i < line.length; i++) {
        const currentSymbol = line[i];

        if (currentSymbol !== "wild" && currentSymbol !== firstSymbol) break;

        if (count.has(currentSymbol)) {
          count.set(currentSymbol, count.get(currentSymbol)! + 1);
        } else {
          count.set(currentSymbol, 1);
        }
      }

      if (count.has("wild")) {
        const wildCount = count.get("wild")!;
        if (wildCount < 3) {
          // If there are less than 3 wilds, replace them with the first symbol
          count.set(firstSymbol, count.get(firstSymbol)! + wildCount);
          count.delete("wild");
        }
      }

      return Object.fromEntries(count);
    };

    let winningLinesWithSymbolCount: Map<string, Record<string, string | number>> = new Map();

    for (const [index, pattern] of winningPatterns.entries()) {
      const patternIndexes = getPatternIndexes(pattern);
      const patternIdentifier = getPatternValues(patternIndexes);

      const firstIdentifier = patternIdentifier[0];

      if (
        (patternIdentifier[1] === firstIdentifier || patternIdentifier[1] === "wild") &&
        (patternIdentifier[2] === firstIdentifier || patternIdentifier[2] === "wild")
      ) {
        console.log("winning line", patternIdentifier);
        const count = countSymbolsOnLine(patternIdentifier);
        winningLinesWithSymbolCount.set(`line-${index + 1}`, {
          identifier: firstIdentifier,
          count: count[firstIdentifier],
        });
      }
    }

    if (winningLinesWithSymbolCount.size > 0) {
      this.EventEmitter.emit("winningLines", Object.fromEntries(winningLinesWithSymbolCount));
    }
  }

  private checkForScatters() {
    let scatterCounter = 0;
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (this.grid[row][col]?.identifier === "scatter") {
          scatterCounter++;
        }
      }
    }

    if (scatterCounter >= FREESPIN_THRESHOLD) {
      console.log("scatterCounter", scatterCounter);
      this.EventEmitter.emit("startFreespins", scatterCounter);
    }
  }

  private handleWinningLines(winningLines: Record<string, Record<string, string | number>>) {
    console.log("winning lines", winningLines);
    for (const [line, data] of Object.entries(winningLines)) {
      const multiplier =
        possibleDrops.find((drop) => drop.identifier === data.identifier)?.value[
          data.count as DropableComboSize
        ] || 0;

      console.log(`You won ${multiplier}x on ${line}!`);
      this.EventEmitter.emit("winningLine", multiplier);
    }
  }
}
