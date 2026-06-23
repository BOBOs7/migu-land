/**
 * Design tokens 与根目录 DESIGN.md 保持一致（唯一可信源）。
 * 改 token 先改 DESIGN.md，再同步到这里。
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F4F0EC',
        surface: '#FBF9F6',
        ink: '#1A1A1A',
        'ink-muted': '#5F5F5A',
        // 重点色：鲜橘，用于填充/下划线/焦点环等点缀
        accent: '#EA580C',
        // 深橘：用于米色上的小字文本与链接（对比度达 AA）
        'accent-strong': '#C2410C',
        'accent-soft': '#FBE6D6',
        // 浅一档橘：环形图辅助色、次级强调
        'accent-dim': '#F6A668',
        line: '#E3DED7',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '"Noto Sans SC"', '"HarmonyOS Sans SC"', 'system-ui', 'sans-serif'],
        display: ['Geist', 'Inter', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // 文本 5 级（DESIGN.md 第 2 节）
        display: ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        h2: ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        lead: ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        'lead-lg': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        caption: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.06em', fontWeight: '500' }],
      },
      borderRadius: {
        // 圆角制度（DESIGN.md 第 4 节）：卡片 12px / 按钮 8px / TAG pill
        card: '12px',
        btn: '8px',
      },
      boxShadow: {
        // 暖色调悬浮阴影（DESIGN.md 第 4 节）
        float: '0 8px 24px rgb(26 26 26 / 0.08)',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}
