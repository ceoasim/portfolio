export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f2ece0',
        surface: '#ece4d2',
        border: '#d9cdb6',
        ink: '#262019',
        muted: '#5c5344',
        accent: '#a8552b',
        // Legacy "Deep Space Mesh" tokens — still referenced by components
        // not yet reskinned. Removed in the final cleanup task of this plan.
        base: '#0d0f1a',
        subtle: '#262a48',
        primary: '#eceef5',
        'accent-violet': '#8b7bff',
        'accent-cyan': '#25c9d0',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(90deg, #8b7bff, #25c9d0)',
      },
    },
  },
  plugins: [],
}
