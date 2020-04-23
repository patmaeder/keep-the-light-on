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
