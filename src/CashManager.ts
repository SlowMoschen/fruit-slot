import { EventEmitter } from "./tools/EventEmitter";

export class CashManager {
  private EventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.EventEmitter = eventEmitter;
  }

  private cash: number = 1000;

  public addCash(amount: number) {
    this.cash += amount;
    this.EventEmitter.emit("cashChanged", this.cash);
  }

  public removeCash(amount: number) {
    this.cash -= amount;
    this.EventEmitter.emit("cashChanged", this.cash);
  }

  public getCash(): number {
    return this.cash;
  }
}
