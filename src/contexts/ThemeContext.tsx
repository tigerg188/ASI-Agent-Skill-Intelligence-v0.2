import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  themeConfig: {
    id: AppTheme;
    name: string;
    description: string;
    bgClass: string;
    headerBgClass: string;
    cardBgClass: string;
    sidebarBgClass: string;
    subBarBgClass: string;
    borderClass: string;
    textPrimaryClass: string;
    textSecondaryClass: string;
    textMutedClass: string;
    inputBgClass: string;
    modalBgClass: string;
    modalHeaderClass: string;
    accentBtnClass: string;
  };
}

const THEME_STORAGE_KEY = 'asi_app_theme_v03';

export const THEME_CONFIGS: Record<AppTheme, ThemeContextType['themeConfig']> = {
  developer_black: {
    id: 'developer_black',
    name: '程序员纯黑',
    description: '深邃纯黑与极客暗色调，适合极客开发者与长时间沉浸调试',
    bgClass: 'bg-slate-950 text-slate-100',
    headerBgClass: 'bg-slate-900 border-slate-800 text-slate-100',
    cardBgClass: 'bg-slate-900/90 border-slate-800 text-slate-100',
    sidebarBgClass: 'bg-slate-900/95 border-slate-800 text-slate-100',
    subBarBgClass: 'bg-slate-950 border-slate-800 text-slate-300',
    borderClass: 'border-slate-800',
    textPrimaryClass: 'text-white',
    textSecondaryClass: 'text-slate-300',
    textMutedClass: 'text-slate-400',
    inputBgClass: 'bg-slate-950 border-slate-700 text-white',
    modalBgClass: 'bg-slate-900 border-slate-700 text-slate-100',
    modalHeaderClass: 'bg-slate-950/80 border-slate-800',
    accentBtnClass: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20',
  },
  office_gray: {
    id: 'office_gray',
    name: '办公浅灰 (Google网页标准色)',
    description: '标准 Google 白底与浅灰 (#f8f9fa) 极简风格，温和清爽，适合企业办公与长时间阅读',
    bgClass: 'bg-[#f8f9fa] text-[#202124]',
    headerBgClass: 'bg-white border-[#dadce0] text-[#202124] shadow-sm',
    cardBgClass: 'bg-white border-[#dadce0] text-[#202124] shadow-sm',
    sidebarBgClass: 'bg-white border-[#dadce0] text-[#202124]',
    subBarBgClass: 'bg-[#f1f3f4] border-[#dadce0] text-[#3c4043]',
    borderClass: 'border-[#dadce0]',
    textPrimaryClass: 'text-[#202124]',
    textSecondaryClass: 'text-[#3c4043]',
    textMutedClass: 'text-[#5f6368]',
    inputBgClass: 'bg-white border-[#dadce0] text-[#202124]',
    modalBgClass: 'bg-white border-[#dadce0] text-[#202124]',
    modalHeaderClass: 'bg-[#f8f9fa] border-[#dadce0]',
    accentBtnClass: 'bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-sm',
  },
  soft_pink: {
    id: 'soft_pink',
    name: '女性柔和粉红',
    description: '温润雅致的柔和暖粉调 (#fff5f7)，搭配低饱和玫瑰金与深酒红文字，视觉温和不刺眼',
    bgClass: 'bg-[#fff5f7] text-[#4c1d24]',
    headerBgClass: 'bg-white border-[#fecdd3] text-[#4c1d24] shadow-sm',
    cardBgClass: 'bg-white border-[#fecdd3] text-[#4c1d24] shadow-sm',
    sidebarBgClass: 'bg-[#fffbfd] border-[#fecdd3] text-[#4c1d24]',
    subBarBgClass: 'bg-[#ffeef2] border-[#fecdd3] text-[#881337]',
    borderClass: 'border-[#fecdd3]',
    textPrimaryClass: 'text-[#4c1d24]',
    textSecondaryClass: 'text-[#701a28]',
    textMutedClass: 'text-[#9f1239]',
    inputBgClass: 'bg-white border-[#fecdd3] text-[#4c1d24]',
    modalBgClass: 'bg-[#fffbfd] border-[#fecdd3] text-[#4c1d24]',
    modalHeaderClass: 'bg-[#fff0f4] border-[#fecdd3]',
    accentBtnClass: 'bg-[#e11d48] hover:bg-[#be123c] text-white shadow-rose-500/20',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'office_gray',
  setTheme: () => {},
  themeConfig: THEME_CONFIGS.office_gray,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
      if (stored && THEME_CONFIGS[stored]) {
        return stored;
      }
    } catch (e) {
      console.error(e);
    }
    // Default to office_gray (办公浅灰) as requested by user's preference for Google web standard
    return 'office_gray';
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      // update document body class
      document.body.className = `theme-${newTheme}`;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    themeConfig: THEME_CONFIGS[theme] || THEME_CONFIGS.office_gray,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
