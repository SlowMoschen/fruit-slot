import { DropableComboSize } from "../configs/dropables";

export class Dropable {
  public readonly symbol: string;
  public readonly identifier: string;
  public readonly value: Record<DropableComboSize, number>;
  public row: number = 0;
  public col: number = 0;

  constructor(symbol: string, identifier: string, value: Record<DropableComboSize, number>) {
    this.symbol = symbol;
    this.identifier = identifier;
    this.value = value;
  }

  setPosition(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
}
