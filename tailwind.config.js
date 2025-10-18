/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Orange (Laranja) - Cores principais do Figma
        'orange-base': '#F24D0D',
        'orange-dark': '#C43C08',
        
        // Blue (Azul) - Cores secundárias do Figma
        'blue-light': '#D7EFF9',
        'blue-base': '#5EC5FD',
        'blue-dark': '#009CF0',
        
        // Shape (Forma) - Cores de fundo e elementos
        'white': '#FFFFFF',
        'background': '#FBF4F4',
        'shape': '#F5EAEA',
        
        // Grayscale (Escala de Cinza) - Textos e elementos neutros
        'gray-100': '#ADADAD',
        'gray-200': '#949494',
        'gray-300': '#666666',
        'gray-400': '#3D3D3D',
        'gray-500': '#1D1D1D',
        
        // Semantic (Semântico) - Estados e feedback
        'danger': '#DC3545',
        'success': '#28A745',
        
        // Cores do sistema (manter compatibilidade)
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'dm-sans': ['DM Sans', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      fontSize: {
        // DM Sans - Titles
        'title-lg': ['28px', { lineHeight: '120%', fontWeight: '700' }],
        'title-md': ['24px', { lineHeight: '120%', fontWeight: '700' }],
        'title-sm': ['18px', { lineHeight: '120%', fontWeight: '700' }],
        
        // Poppins - Body e outros
        'subtitle': ['16px', { lineHeight: '120%', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '120%', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '120%', fontWeight: '400' }],
        'body-xs': ['12px', { lineHeight: '120%', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '120%', fontWeight: '500', textTransform: 'uppercase' }],
        'label-sm': ['10px', { lineHeight: '120%', fontWeight: '500', textTransform: 'uppercase' }],
        'action-md': ['16px', { lineHeight: '120%', fontWeight: '500' }],
        'action-sm': ['14px', { lineHeight: '120%', fontWeight: '500' }],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '4px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}