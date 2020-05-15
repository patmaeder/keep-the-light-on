/**
 * Holds all observed keys and maps them to their pressing state
 */
export type KeyState = {
    [key: string]: boolean;
};

/**
 * Typescript enum for key definitions
 */
export {Key} from "ts-key-enum";

/**
 * Used to track keys and maps their state to an object with boolean values.
 */
export class InputHandler {
    observed: string[];
    state: KeyState;

    constructor() {
        this.observed = [];
        this.state = {};
    }

    attach(element: HTMLElement | Window): Function {
        element.addEventListener("keydown", this.onKeyDown.bind(this));
        element.addEventListener("keyup", this.onKeyUp.bind(this));

        // returns detach function
        return () => {
            element.removeEventListener("keydown", this.onKeyDown.bind(this));
            element.removeEventListener("keyup", this.onKeyUp.bind(this));
        };
    }

    observeKey(key: string) {
        this.observed.push(key);

        this.updateKeyInState(key, false);
    }

    observeKeys(keys: string[]) {
        keys.forEach(this.observeKey.bind(this));
    }

    getKeyState(): KeyState {
        return Object.assign({}, this.state);
    }

    isTracked(key: string) {
        return this.observed.some(
            (property) => property.toUpperCase() === key.toUpperCase()
        );
    }

    /**
     * Used to check if a tracked key is pressed. Can also check if at least one of multiple given keys are pressed.
     * @param checkable keys to check if any of these are pressed
     */
    isPressed(checkable: string | string[]) {
        let keysToTest = checkable;
        if (!Array.isArray(keysToTest)) {
            keysToTest = [keysToTest];
        }
        const pressedKeys = keysToTest.map((key) => this.state[key.toUpperCase()]);

        return pressedKeys.includes(true);
    }

    private updateKeyInState(key: string, state: boolean) {
        this.state = Object.assign({}, this.state, {
            [key.toUpperCase()]: state,
        });
    }

    private onKeyDown(event: KeyboardEvent) {
        if (!this.isTracked(event.key)) return;

        this.updateKeyInState(event.key, true);
    }

    private onKeyUp(event: KeyboardEvent) {
        if (!this.isTracked(event.key)) return;

        this.updateKeyInState(event.key, false);
    }
}
