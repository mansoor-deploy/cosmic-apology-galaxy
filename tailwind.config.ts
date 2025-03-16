
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Design specific colors
				bloom: {
					primary: '#FDE1D3',
					secondary: '#E5DEFF',
					accent: '#FFDEE2',
					text: '#4A3C31'
				},
				cosmic: {
					primary: '#1A1F2C',
					secondary: '#7E69AB',
					accent: '#9F9EA1',
					text: '#F0F0F7'
				},
				puzzle: {
					primary: '#33C3F0',
					secondary: '#FEF7CD',
					accent: '#F2FCE2',
					text: '#2E3A59'
				},
				rainy: {
					primary: '#8E9196',
					secondary: '#0EA5E9',
					accent: '#EEEEEE',
					text: '#2C3E50'
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['Playfair Display', 'serif'],
				handwriting: ['Dancing Script', 'cursive'],
				montserrat: ['Montserrat', 'sans-serif'],
				lato: ['Lato', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
				'neo': '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
				'soft': '0 10px 50px -12px rgba(0, 0, 0, 0.25)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-slow': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.6' }
				},
				'petal-fall': {
					'0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '0' },
					'10%': { opacity: '1' },
					'100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' }
				},
				'breathe': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'ripple': {
					'0%': { transform: 'scale(0)', opacity: '1' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				},
				'typing': {
					'from': { width: '0' },
					'to': { width: '100%' }
				},
				'blink': {
					'0%, 100%': { borderColor: 'transparent' },
					'50%': { borderColor: 'hsl(var(--foreground))' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.7s ease-out',
				'fade-in-slow': 'fade-in-slow 2s ease-out',
				'slide-up': 'slide-up 0.5s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'petal-fall': 'petal-fall 10s linear forwards',
				'breathe': 'breathe 8s ease-in-out infinite',
				'ripple': 'ripple 3s linear forwards',
				'typing': 'typing 3.5s steps(40, end), blink .75s step-end infinite'
			},
			backgroundImage: {
				'bloom-gradient': 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
				'cosmic-gradient': 'linear-gradient(to right, #243949 0%, #517fa4 100%)',
				'puzzle-gradient': 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)',
				'rainy-gradient': 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
