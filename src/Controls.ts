import { EventEmitter } from "./tools/EventEmitter";
import { querySelectElemnt } from "./tools/helpers";

export class Controls {
    private readonly EventEmitter: EventEmitter;
    private currentBet: number = 20;

    constructor(eventEmitter: EventEmitter) {
        this.EventEmitter = eventEmitter;
    }

    public init() {
        querySelectElemnt('.spin-btn').addEventListener('click', () => this.EventEmitter.emit('spin'));
        querySelectElemnt('.increase-bet-btn').addEventListener('click', () => this.increaseBet());
        querySelectElemnt('.decrease-bet-btn').addEventListener('click', () => this.decreaseBet());
        querySelectElemnt('.max-bet').addEventListener('click', () => {
            this.currentBet = 100;
            this.EventEmitter.emit('betChanged', this.currentBet);
            this.disableButton(querySelectElemnt('.increase-bet-btn') as HTMLButtonElement);
            this.enableButton(querySelectElemnt('.decrease-bet-btn') as HTMLButtonElement);
        });
        this.disableButton(querySelectElemnt('.decrease-bet-btn') as HTMLButtonElement);
    }

    public getCurrentBet(): number {
        return this.currentBet;
    }

    private increaseBet() {
        if (this.currentBet < 100) {
            this.currentBet += 20;
            this.EventEmitter.emit('betChanged', this.currentBet);
            if (this.currentBet === 100) {
                this.disableButton(querySelectElemnt('.increase-bet-btn') as HTMLButtonElement);
            } else {
                this.enableButton(querySelectElemnt('.decrease-bet-btn') as HTMLButtonElement);
            }
        }
    }

    private decreaseBet() {
        if (this.currentBet > 20) {
            this.currentBet -= 20;
            this.EventEmitter.emit('betChanged', this.currentBet);

            if (this.currentBet === 20) {
                this.disableButton(querySelectElemnt('.decrease-bet-btn') as HTMLButtonElement);
            } else {
                this.enableButton(querySelectElemnt('.increase-bet-btn') as HTMLButtonElement);
            }
        }
    }

    private disableButton(button: HTMLButtonElement) {
        button.disabled = true;
    }

    private enableButton(button: HTMLButtonElement) {
        button.disabled = false;
    }
}