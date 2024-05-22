type DropableType = "common" | "wild" | "scatter";
export type DropableComboSize = 3 | 4 | 5;

interface Dropable {
  type: DropableType;
  symbol: string;
  identifier: string;
  value: Record<DropableComboSize, number>;
  dropChance: number;
}

export const possibleDrops: Dropable[] = [
  {
    type: "common",
    symbol: "🍎",
    identifier: "apple",
    value: {
      3: 1,
      4: 2,
      5: 5,
    },
    dropChance: 0.65,
  },
  {
    type: "common",
    symbol: "🍌",
    identifier: "banana",
    value: {
      3: 1,
      4: 2,
      5: 5,
    },
    dropChance: 0.65,
  },
  {
    type: "common",
    symbol: "🍒",
    identifier: "cherry",
    value: {
      3: 1,
      4: 2,
      5: 5,
    },
    dropChance: 0.65,
  },
  {
    type: "common",
    symbol: "🍋",
    identifier: "lemon",
    value: {
      3: 1,
      4: 3,
      5: 10,
    },
    dropChance: 0.4,
  },
  {
    type: "common",
    symbol: "🍓",
    identifier: "strawberry",
    value: {
      3: 1,
      4: 3,
      5: 10,
    },
    dropChance: 0.4,
  },
  {
    type: "common",
    symbol: "🍇",
    identifier: "grapes",
    value: {
      3: 2,
      4: 4,
      5: 20,
    },
    dropChance: 0.2,
  },
  {
    type: "common",
    symbol: "🍉",
    identifier: "watermelon",
    value: {
      3: 2,
      4: 4,
      5: 20,
    },
    dropChance: 0.2,
  },
  {
    type: "common",
    symbol: "🍍",
    identifier: "pineapple",
    value: {
      3: 2,
      4: 8,
      5: 30,
    },
    dropChance: 0.15,
  },
  {
    type: "common",
    symbol: "🍈",
    identifier: "melon",
    value: {
      3: 2,
      4: 8,
      5: 30,
    },
    dropChance: 0.15,
  },
  {
    type: "common",
    symbol: "🍑",
    identifier: "peach",
    value: {
      3: 5,
      4: 10,
      5: 50,
    },
    dropChance: 0.1,
  },
  {
    type: "wild",
    symbol: "🌟",
    identifier: "wild",
    value: {
      3: 5,
      4: 10,
      5: 50,
    },
    dropChance: 0.1,
  },
  {
    type: "scatter",
    symbol: "💎",
    identifier: "scatter",
    value: {
      3: 10,
      4: 20,
      5: 50,
    },
    dropChance: 0.2,
  },
];
