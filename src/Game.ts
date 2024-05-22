import { CashManager } from "./CashManager";
import { Controls } from "./Controls";
import { SlotGrid } from "./SlotGrid";
import { UiManager } from "./UiManager";
import { EventEmitter } from "./tools/EventEmitter";

export class Game {
  private readonly EventEmitter: EventEmitter = new EventEmitter();
  private readonly SlotGrid: SlotGrid = new SlotGrid(this.EventEmitter);
  private readonly Controls: Controls = new Controls(this.EventEmitter);
  private readonly UiManager: UiManager = new UiManager(this.EventEmitter);
  private readonly CashManager: CashManager = new CashManager(this.EventEmitter);

  constructor() {
    this.init();
  }

  private init() {
    this.EventEmitter.on("spin", this.onSpin.bind(this));
    this.EventEmitter.on("startFreespins", (count) => this.onFreespin(count));
    this.initListeners();
    this.UiManager.init();
    this.Controls.init();
  }

  private initListeners() {
    this.EventEmitter.on("winningLine", (multi) => {
      const win = this.Controls.getCurrentBet() * multi;
      this.EventEmitter.emit("win", win);
      setTimeout(() => {
        this.CashManager.addCash(win);
      }, 3500);
    });
  }

  private onSpin() {
    if (this.CashManager.getCash() < this.Controls.getCurrentBet()) {
      alert("Not enough cash");
      return;
    }
    this.CashManager.removeCash(this.Controls.getCurrentBet());
    this.SlotGrid.generateDrops();
    this.UiManager.renderDrops(this.SlotGrid.getGrid());
  }

  private onFreespin(symbolCount: number) {
    const spins = symbolCount === 3 ? 10 : symbolCount === 4 ? 15 : 20;

    setTimeout(() => {
      alert(`You won ${spins} freespins`);
    }, 3500);

    for (let i = 0; i < spins; i++) {
      setTimeout(() => {
        this.SlotGrid.generateDrops();
        this.UiManager.renderDrops(this.SlotGrid.getGrid());
        this.UiManager.renderFSCount(spins - i);

        if (i === spins - 1) {
            this.EventEmitter.emit("freespinsEnded");
            this.UiManager.renderFSCount(0);
        }
      }, 3500 + (i + 2) * 1000);
    }
  }
}
