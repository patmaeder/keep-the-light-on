import { Key } from "ts-key-enum";

/**
 * Holds all observed keys and maps them to their pressing state
 */
type KeyState = {
  [key in Key]?: boolean;
};

const demonstrationalState: KeyState = {
  Enter: true,
};

class InputHandler {
  observed: Key[];
  state: KeyState;

  attach(element: HTMLElement) {
    element.addEventListener("keydown", () => {});
    element.addEventListener("keyup", () => {});
  }

  observeKey(key: Key) {
    this.observed.push(key);
  }

  getKeyState(): KeyState {
    return this.state;
  }
}
