declare module 'use-keyboard-shortcut' {
  export default function useKeyboardShortcut(
    shortcutKeys: string[],
    callback: (keys: string[]) => void,
    options?: { overrideSystem: boolean },
  ): void;
}
