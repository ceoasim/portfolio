export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0d0f1a',
        surface: '#15172a',
        subtle: '#262a48',
        primary: '#eceef5',
        muted: '#9497bd',
        accent: {
          violet: '#8b7bff',
          cyan: '#25c9d0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(90deg, #8b7bff, #25c9d0)',
      },
    },
  },
  plugins: [],
}
