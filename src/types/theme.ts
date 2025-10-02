export interface Theme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    cursor: string;
    selection: string;
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    brightBlack: string;
    brightRed: string;
    brightGreen: string;
    brightYellow: string;
    brightBlue: string;
    brightMagenta: string;
    brightCyan: string;
    brightWhite: string;
    window: string;
    windowBorder: string;
    titleBar: string;
    titleBarText: string;
  };
}

export const themes: Record<string, Theme> = {
  ubuntu: {
    name: "Ubuntu",
    colors: {
      background: "#2c001e",
      foreground: "#ffffff",
      cursor: "#ffffff",
      selection: "#b5d5ff",
      black: "#2e3436",
      red: "#ef2929",
      green: "#8ae234",
      yellow: "#fce94f",
      blue: "#729fcf",
      magenta: "#ad7fa8",
      cyan: "#34e2e2",
      white: "#d3d7cf",
      brightBlack: "#555753",
      brightRed: "#ef2929",
      brightGreen: "#8ae234",
      brightYellow: "#fce94f",
      brightBlue: "#729fcf",
      brightMagenta: "#ad7fa8",
      brightCyan: "#34e2e2",
      brightWhite: "#eeeeec",
      window: "#2c001e",
      windowBorder: "#1a0012",
      titleBar: "#e8e8e8",
      titleBarText: "#3c3c3c",
    },
  },
  dracula: {
    name: "Dracula",
    colors: {
      background: "#282a36",
      foreground: "#f8f8f2",
      cursor: "#f8f8f2",
      selection: "#44475a",
      black: "#21222c",
      red: "#ff5555",
      green: "#50fa7b",
      yellow: "#f1fa8c",
      blue: "#bd93f9",
      magenta: "#ff79c6",
      cyan: "#8be9fd",
      white: "#f8f8f2",
      brightBlack: "#6272a4",
      brightRed: "#ff6e6e",
      brightGreen: "#69ff94",
      brightYellow: "#ffffa5",
      brightBlue: "#d6acff",
      brightMagenta: "#ff92df",
      brightCyan: "#a4ffff",
      brightWhite: "#ffffff",
      window: "#282a36",
      windowBorder: "#44475a",
      titleBar: "#44475a",
      titleBarText: "#f8f8f2",
    },
  },
  nord: {
    name: "Nord",
    colors: {
      background: "#2e3440",
      foreground: "#d8dee9",
      cursor: "#d8dee9",
      selection: "#4c566a",
      black: "#3b4252",
      red: "#bf616a",
      green: "#a3be8c",
      yellow: "#ebcb8b",
      blue: "#81a1c1",
      magenta: "#b48ead",
      cyan: "#88c0d0",
      white: "#e5e9f0",
      brightBlack: "#4c566a",
      brightRed: "#bf616a",
      brightGreen: "#a3be8c",
      brightYellow: "#ebcb8b",
      brightBlue: "#81a1c1",
      brightMagenta: "#b48ead",
      brightCyan: "#8fbcbb",
      brightWhite: "#eceff4",
      window: "#2e3440",
      windowBorder: "#3b4252",
      titleBar: "#3b4252",
      titleBarText: "#d8dee9",
    },
  },
  kali: {
    name: "Kali Linux",
    colors: {
      background: "#0d1117",
      foreground: "#00ff00",
      cursor: "#00ff00",
      selection: "#1e3a5f",
      black: "#171421",
      red: "#c01c28",
      green: "#00ff00",
      yellow: "#f6d32d",
      blue: "#0037da",
      magenta: "#881798",
      cyan: "#3a96dd",
      white: "#cccccc",
      brightBlack: "#767676",
      brightRed: "#ee5396",
      brightGreen: "#26a269",
      brightYellow: "#f5c211",
      brightBlue: "#12488b",
      brightMagenta: "#a347ba",
      brightCyan: "#2aa1b3",
      brightWhite: "#f2f2f2",
      window: "#0d1117",
      windowBorder: "#1a1e26",
      titleBar: "#1a1e26",
      titleBarText: "#00ff00",
    },
  },
  monokai: {
    name: "Monokai",
    colors: {
      background: "#272822",
      foreground: "#f8f8f2",
      cursor: "#f8f8f0",
      selection: "#49483e",
      black: "#272822",
      red: "#f92672",
      green: "#a6e22e",
      yellow: "#f4bf75",
      blue: "#66d9ef",
      magenta: "#ae81ff",
      cyan: "#a1efe4",
      white: "#f8f8f2",
      brightBlack: "#75715e",
      brightRed: "#f92672",
      brightGreen: "#a6e22e",
      brightYellow: "#e6db74",
      brightBlue: "#66d9ef",
      brightMagenta: "#ae81ff",
      brightCyan: "#a1efe4",
      brightWhite: "#f9f8f5",
      window: "#272822",
      windowBorder: "#1e1f1c",
      titleBar: "#3e3d32",
      titleBarText: "#f8f8f2",
    },
  },
  solarized: {
    name: "Solarized Dark",
    colors: {
      background: "#002b36",
      foreground: "#839496",
      cursor: "#839496",
      selection: "#073642",
      black: "#073642",
      red: "#dc322f",
      green: "#859900",
      yellow: "#b58900",
      blue: "#268bd2",
      magenta: "#d33682",
      cyan: "#2aa198",
      white: "#eee8d5",
      brightBlack: "#002b36",
      brightRed: "#cb4b16",
      brightGreen: "#586e75",
      brightYellow: "#657b83",
      brightBlue: "#839496",
      brightMagenta: "#6c71c4",
      brightCyan: "#93a1a1",
      brightWhite: "#fdf6e3",
      window: "#002b36",
      windowBorder: "#073642",
      titleBar: "#073642",
      titleBarText: "#839496",
    },
  },
};
