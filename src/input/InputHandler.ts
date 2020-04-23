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

interface InputHandler {
  observeKey(key: Key);

  getKeyState(): KeyState;
}

// getBitKeyState --> bject.fromEntries(Object.entries(obj).map(([k, v]) => [k, v ? 1 : 0]))

// not even neccessary: true - false = 1; true - true = 0; false - true = -1;
