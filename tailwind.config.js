// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // Custom border color (for border-border)
//         border: '#dedbd0',

//         // Primary brand — deep saffron
//         brand: {
//           50: '#fff8f0',
//           100: '#ffecd6',
//           200: '#ffd4a8',
//           300: '#ffb570',
//           400: '#ff8c38',
//           500: '#f97010',
//           600: '#ea5506',
//           700: '#c23d07',
//           800: '#9a310e',
//           900: '#7c2a0f',
//           950: '#431206',
//         },

//         // Secondary — saree/maroon
//         saree: {
//           50: '#fdf2f4',
//           100: '#fbe8ec',
//           200: '#f8d4db',
//           300: '#f2b0bc',
//           400: '#e87d93',
//           500: '#db506b',
//           600: '#c73255',
//           700: '#a72347',
//           800: '#8d2042',
//           900: '#791e3d',
//           950: '#430c1f',
//         },

//         // Warm neutrals
//         warm: {
//           50: '#fafaf8',
//           100: '#f5f4f0',
//           200: '#eceae3',
//           300: '#dedbd0',
//           400: '#c8c3b4',
//           500: '#b0a99a',
//           600: '#958c7c',
//           700: '#7a7266',
//           800: '#655f56',
//           900: '#544f47',
//         },
//       },

//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//         display: ['Playfair Display', 'Georgia', 'serif'],
//       },

//       boxShadow: {
//         card: '0 2px 8px 0 rgba(0,0,0,0.08)',
//         'card-hover': '0 8px 24px 0 rgba(0,0,0,0.12)',
//         modal: '0 20px 60px 0 rgba(0,0,0,0.2)',
//       },

//       animation: {
//         'fade-in': 'fadeIn 0.3s ease-in-out',
//         'slide-up': 'slideUp 0.3s ease-out',
//         'slide-in-right': 'slideInRight 0.3s ease-out',
//       },

//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         slideUp: {
//           '0%': { opacity: '0', transform: 'translateY(16px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//         slideInRight: {
//           '0%': { opacity: '0', transform: 'translateX(100%)' },
//           '100%': { opacity: '1', transform: 'translateX(0)' },
//         },
//       },
//     },
//   },
//   plugins: [],
// }



/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom border color (for border-border)
        border: '#e5e5e5',

        // Primary brand — now a true black/gray ramp instead of saffron
        brand: {
          50: '#fafafa',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#c2c2c2',
          400: '#9a9a9a',
          500: '#717171',
          600: '#4a4a4a',
          700: '#2e2e2e',
          800: '#1a1a1a',
          900: '#0d0d0d',
          950: '#000000',
        },

        // Secondary — charcoal, for subtle accent/differentiation from brand
        saree: {
          50: '#f7f7f7',
          100: '#eeeeee',
          200: '#d9d9d9',
          300: '#b8b8b8',
          400: '#8f8f8f',
          500: '#6b6b6b',
          600: '#4d4d4d',
          700: '#383838',
          800: '#232323',
          900: '#171717',
          950: '#000000',
        },

        // Neutrals — true grays instead of warm cream tones
        warm: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px 0 rgba(0,0,0,0.08)',
        modal: '0 12px 40px 0 rgba(0,0,0,0.14)',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}