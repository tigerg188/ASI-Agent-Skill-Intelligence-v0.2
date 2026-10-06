import React, { useEffect, useState } from 'react';
import {
  Layers,
  UploadCloud,
  FolderKanban,
  Cpu,
  BookOpen,
  Settings as SettingsIcon,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Palette,
  ChevronDown,
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { AgentConfig, AppTheme } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onOpenImport: () => void;
  onOpenProjectManagement: () => void;
  onOpenAgentConfig: () => void;
  onOpenSoftwareDocs: () => void;
  onOpenSettings: () => void;
  onOpenLogs: () => void;
  activeProjectName?: string;
  isExecuting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenImport,
  onOpenProjectManagement,
  onOpenAgentConfig,
  onOpenSoftwareDocs,
  onOpenSettings,
  onOpenLogs,
  activeProjectName,
  isExecuting,
}) => {
  const [config, setConfig] = useState<AgentConfig>(apiService.getConfig());
  const { theme, setTheme, themeConfig } = useTheme();
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  useEffect(() => {
    return apiService.subscribe(() => {
      setConfig(apiService.getConfig());
    });
  }, []);

  const formatTokens = (num: number) => {
    return num.toLocaleString();
  };

  const THEME_OPTIONS: Array<{ id: AppTheme; name: string; tag: string }> = [
    { id: 'developer_black', name: '程序员纯黑', tag: '暗黑极客' },
    { id: 'office_gray', name: '办公浅灰', tag: 'Google网页标准色' },
    { id: 'soft_pink', name: '女性柔和粉红', tag: '温润雅致' },
  ];

  return (
    <header className={`border-b sticky top-0 z-30 transition-colors duration-200 ${themeConfig.headerBgClass}`}>
      {/* Top Main Navigation */}
      <div className="max-w-[1920px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Core Positioning */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md ring-1 ring-black/10">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base md:text-lg tracking-tight">
                ASI — Agent-Skill Intelligence
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                theme === 'developer_black'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : theme === 'soft_pink'
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                通用智能底座 V0.3
              </span>
            </div>
            <p className={`text-[11px] font-mono hidden sm:block ${themeConfig.textMutedClass}`}>
              不改变外部Skill，理解它 · 不规定Skill环境，适配它 · 不相信模型声称完成，验证它
            </p>
          </div>
        </div>

        {/* Action Buttons: 任务书指定 5 大功能 + 主题切换 */}
        <div className="flex items-center space-x-1.5 md:space-x-2 flex-wrap">
          {/* Quick Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
                theme === 'developer_black'
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : theme === 'soft_pink'
                  ? 'bg-white text-rose-800 border-rose-200 hover:bg-rose-50 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm'
              }`}
              title="切换界面主题颜色"
            >
              <Palette className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">
                {theme === 'developer_black' ? '程序员纯黑' : theme === 'soft_pink' ? '女性柔和粉红' : '办公浅灰'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {themeDropdownOpen && (
              <div
                className={`absolute right-0 mt-1 w-52 rounded-xl border shadow-xl p-1.5 z-50 text-xs ${
                  theme === 'developer_black'
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : theme === 'soft_pink'
                    ? 'bg-white border-rose-200 text-rose-900'
                    : 'bg-white border-gray-200 text-gray-800'
                }`}
              >
                <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  界面风格主题选择
                </div>
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTheme(opt.id);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      theme === opt.id
                        ? theme === 'developer_black'
                          ? 'bg-blue-600 text-white font-semibold'
                          : theme === 'soft_pink'
                          ? 'bg-rose-500 text-white font-semibold'
                          : 'bg-blue-600 text-white font-semibold'
                        : theme === 'developer_black'
                        ? 'hover:bg-slate-800 text-slate-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{opt.name}</span>
                    <span className="text-[10px] opacity-75">{opt.tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenImport}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 ${themeConfig.accentBtnClass}`}
            title="导入 GitHub 链接、用户自建或本地文件夹完整上传"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>项目导入</span>
          </button>

          <button
            onClick={onOpenProjectManagement}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all active:scale-95 ${
              theme === 'developer_black'
                ? 'bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border-indigo-700/80 shadow-sm shadow-indigo-500/10'
                : theme === 'soft_pink'
                ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-300 shadow-sm'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm'
            }`}
            title="统一管理已导入的 Agent 与 Skill 项目，包括重置、删除、名称与提示词修改、完整项目包导出及建立单项业务研究"
          >
            <FolderKanban className="w-3.5 h-3.5 text-indigo-500" />
            <span>项目管理</span>
          </button>

          <button
            onClick={onOpenAgentConfig}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all active:scale-95 ${
              theme === 'developer_black'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm'
            }`}
            title="配置专用平台自适应 (Gemini) 或通用 OpenAI API"
          >
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>智能体配置</span>
          </button>

          <button
            onClick={onOpenSoftwareDocs}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all active:scale-95 ${
              theme === 'developer_black'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm'
            }`}
            title="查看软件说明 README、全栈技术方案、文件目录树与开发者说明"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>软件说明</span>
          </button>

          <button
            onClick={onOpenSettings}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all active:scale-95 ${
              theme === 'developer_black'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm'
            }`}
            title="底座沙箱安全边界、主题选择、验证严格度等级与系统配置"
          >
            <SettingsIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>设置</span>
          </button>

          <button
            onClick={onOpenLogs}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all active:scale-95 ${
              theme === 'developer_black'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm'
            }`}
            title="查看全方位无死角运行日志 (支持 TXT / JSON 长期留存与导出)"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>运行日志</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: 任务书指定“运行状态：智能体**，调用次数**，token消耗量**” */}
      <div className={`border-t px-4 py-1.5 text-xs font-mono flex flex-wrap items-center justify-between gap-3 ${themeConfig.subBarBgClass}`}>
        <div className="flex items-center space-x-4 flex-wrap">
          {/* 智能体状态 */}
          <div className="flex items-center space-x-1.5">
            <span className={themeConfig.textMutedClass}>运行状态：</span>
            <span className="flex items-center space-x-1 font-semibold text-emerald-600">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isExecuting ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isExecuting ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              <span>
                {config.mode === 'google_ai_studio_native'
                  ? `Google AI Studio 平台自适应 (${config.googleModel})`
                  : `OpenAI 兼容智能体 (${config.openaiModel})`}
              </span>
            </span>
          </div>

          <span className="opacity-30">|</span>

          {/* 调用次数 */}
          <div className="flex items-center space-x-1">
            <span className={themeConfig.textMutedClass}>调用次数：</span>
            <span className="font-semibold text-blue-600">{config.totalCalls} 次</span>
          </div>

          <span className="opacity-30">|</span>

          {/* Token 消耗量 */}
          <div className="flex items-center space-x-1">
            <span className={themeConfig.textMutedClass}>Token 消耗量：</span>
            <span className="font-semibold text-indigo-600">{formatTokens(config.totalTokens)} tokens</span>
          </div>

          {activeProjectName && (
            <>
              <span className="opacity-30 hidden lg:inline">|</span>
              <div className="items-center space-x-1 hidden lg:flex">
                <span className={themeConfig.textMutedClass}>当前激活工程：</span>
                <span className="font-semibold text-amber-600 truncate max-w-xs">{activeProjectName}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center space-x-1 text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>沙箱隔离已就绪</span>
          </span>
          <span className="flex items-center space-x-1 text-blue-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>证据链验真引擎在线</span>
          </span>
        </div>
      </div>
    </header>
  );
};
