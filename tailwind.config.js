/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Ubuntu Mono', 'Droid Sans Mono', 'Liberation Mono', 'Consolas', 'monospace'],
      },
      colors: {
        ubuntu: {
          bg: '#300a24',
          titlebar: '#2c001e',
          window: '#300a24',
          border: '#4a1539',
          terminal: '#300a24',
          text: '#ffffff',
          title: '#dfdbd2',
          close: '#ff5f56',
          'close-hover': '#ff3b30',
          minimize: '#ffbd2e',
          'minimize-hover': '#ffaa00',
          maximize: '#27ca3f',
          'maximize-hover': '#00ca51',
        },
        colors: {
          ubuntu: {
            bg: '#300a24',
            text: '#ffffff',
            green: '#4e9a06',
            blue: '#3465a4',
            purple: '#75507b',
            cyan: '#06989a',
            yellow: '#c4a000',
            red: '#cc0000',
            orange: '#f57c00',
            gray: '#d3d7cf',
            darkGray: '#555753',
            titlebar: '#2c001e',
            border: '#5d4037',
            close: '#f44336',
            minimize: '#ff9800',
            maximize: '#4caf50',
          },
          terminal: {
            bg: '#300a24',
            text: '#ffffff',
            green: '#4e9a06',
            blue: '#3465a4',
            yellow: '#c4a000',
            red: '#cc0000',
            cyan: '#06989a',
            purple: '#75507b',
            gray: '#d3d7cf',
            dim: '#555753',
          }
        },
      },
      animation: {
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      }
    },
  },
  plugins: [],
}

