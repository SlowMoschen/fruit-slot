
export const isDropableAllowedBasedOnDropChance = (dropChance: number): boolean => Math.random() < dropChance;

export function querySelectElemnt(selector: string): HTMLElement {
    const element = document.querySelector(selector);

    if (!element) {
        throw new Error(`Element with selector "${selector}" not found`);
    }

    return element as HTMLElement;
}