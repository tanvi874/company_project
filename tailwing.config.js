/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Enable dark mode based on class (e.g., <html class="dark">)
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          /* Add your custom colors here, mapping them to the CSS variables */
          background: "hsl(var(--background))",
          border: "hsl(var(--border))",
          foreground: "hsl(var(--foreground))",
          card: "hsl(var(--card))",
          cardforeground: "hsl(var(--card-foreground))",
          popover: "hsl(var(--popover))",
          popoverforeground: "hsl(var(--popover-foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
        },
      },
    },
    plugins: [],
  }