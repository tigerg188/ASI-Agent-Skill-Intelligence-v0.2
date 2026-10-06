import React, { useState } from 'react';
import {
  X,
  Settings as SettingsIcon,
  ShieldCheck,
  HardDrive,
  Clock,
  CheckCircle2,
  Palette,
  Check,
} from 'lucide-react';
import { AppTheme, SystemSettings } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, themeConfig } = useTheme();

  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const stored = localStorage.getItem('asi_system_settings_v03');
      if (stored) {
        return { theme, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      theme,
      sandboxIsolation: 'strict',
      verificationLevel: 'financial_grade',
      autoBreakpointIntervalSec: 60,
      persistentLogDays: 365,
      telemetryDisabled: true,
    };
  });

  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSelectTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    setSettings((prev) => ({ ...prev, theme: newTheme }));
  };

  const handleSave = () => {
    localStorage.setItem('asi_system_settings_v03', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  const THEMES: Array<{
    id: AppTheme;
    name: string;
    tag: string;
    desc: string;
    colors: string;
  }> = [
    {
      id: 'developer_black',
      name: '程序员纯黑',
      tag: '暗黑极客',
      desc: '深邃高对比黑底与代码高亮，适合夜间与极客开发者',
      colors: 'bg-slate-950 border-slate-700 text-white',
    },
    {
      id: 'office_gray',
      name: '办公浅灰',
      tag: 'Google网页标准色',
      desc: '经典 Google 白底浅灰 (#f8f9fa)，护眼清爽，适合企业商务与长文核阅',
      colors: 'bg-[#f8f9fa] border-gray-300 text-gray-900',
    },
    {
      id: 'soft_pink',
      name: '女性柔和粉红',
      tag: '温润雅致',
      desc: '柔和舒缓的暖色系浅粉 (#fff5f7) 与深玫瑰酒红文字，温润细腻',
      colors: 'bg-[#fff5f7] border-rose-200 text-rose-900',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className={`rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden border ${themeConfig.modalBgClass}`}>
        {/* Header */}
        <div className={`p-4 sm:px-6 border-b flex items-center justify-between ${themeConfig.modalHeaderClass}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">底座系统与页面外观设置</h2>
              <p className={`text-[11px] ${themeConfig.textMutedClass}`}>
                支持多主题页面切换、沙箱隔离层级、验真标准与快照周期
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 text-xs overflow-y-auto max-h-[75vh]">
          {/* 用户反馈 1 核心要求：页面主题选项 */}
          <div className="space-y-2">
            <label className="font-semibold block flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span>页面视觉主题风格 (Page Theme Option)</span>
            </label>
            <p className={`text-[11px] ${themeConfig.textMutedClass}`}>
              根据不同工作场景与个人偏好自由切换全局底色与文字层级：
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {THEMES.map((item) => {
                const isSelected = theme === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTheme(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      item.colors
                    } ${
                      isSelected
                        ? 'ring-2 ring-blue-500 shadow-md font-medium'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">{item.name}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <span className="inline-block text-[9px] px-1.5 py-0.2 rounded bg-black/5 border border-black/10 mb-1.5 font-mono">
                        {item.tag}
                      </span>
                      <p className="text-[10px] opacity-80 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. 沙箱隔离策略 */}
          <div className="space-y-2 pt-2 border-t border-black/5">
            <label className="font-semibold block flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Skill 执行沙箱安全隔离等级</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'strict', label: '金融军工级 (严格隔离)', desc: '完全只读挂载，断绝外部非授权请求' },
                { id: 'standard', label: '标准安全容器 (推荐)', desc: '受限网络白名单，内存配额防护' },
                { id: 'relaxed', label: '极速开发模式', desc: '开放本地端口与调试日志' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, sandboxIsolation: item.id as any })}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    settings.sandboxIsolation === item.id
                      ? 'border-blue-500 bg-blue-50/30 font-semibold'
                      : 'border-black/10 hover:border-black/20 opacity-80'
                  }`}
                >
                  <div className="font-bold text-[11px] mb-0.5">{item.label}</div>
                  <div className={`text-[10px] ${themeConfig.textMutedClass} leading-tight`}>{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. 防幻觉与可信验证严格度 */}
          <div className="space-y-2">
            <label className="font-semibold block flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>成果防幻觉验真严格度 (Verification Rigor)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'financial_grade', label: '穿透式双重审计 (推荐)', desc: '强制校验每个数字的原始文件行号' },
                { id: 'standard', label: '行业标准核验', desc: '核查逻辑一致性与核心指标' },
                { id: 'relaxed', label: '宽松模式', desc: '仅进行语法与输出完整性检查' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, verificationLevel: item.id as any })}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    settings.verificationLevel === item.id
                      ? 'border-emerald-500 bg-emerald-50/30 font-semibold'
                      : 'border-black/10 hover:border-black/20 opacity-80'
                  }`}
                >
                  <div className="font-bold text-[11px] mb-0.5">{item.label}</div>
                  <div className={`text-[10px] ${themeConfig.textMutedClass} leading-tight`}>{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. 自动断点快照周期 */}
          <div className="space-y-2">
            <label className="font-semibold block flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-600" />
              <span>执行断点快照保存频率 (确保中断时断点续传)</span>
            </label>
            <select
              value={settings.autoBreakpointIntervalSec}
              onChange={(e) => setSettings({ ...settings, autoBreakpointIntervalSec: Number(e.target.value) })}
              className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:border-blue-500 ${themeConfig.inputBgClass}`}
            >
              <option value={30}>每 30 秒自动快照 (高频)</option>
              <option value={60}>每 60 秒自动快照 (推荐)</option>
              <option value={180}>每 3 分钟自动快照</option>
              <option value={0}>仅在关键步骤完成时快照</option>
            </select>
          </div>

          {/* 4. 运行日志保留 */}
          <div className="space-y-2">
            <label className="font-semibold block flex items-center space-x-1.5">
              <HardDrive className="w-3.5 h-3.5 text-purple-600" />
              <span>全流程日志长期留存策略 (任务书要求不可自动清除)</span>
            </label>
            <div className={`p-3 rounded-lg border text-xs space-y-1 ${themeConfig.inputBgClass}`}>
              <p>
                当前策略：<strong>永久保留在本地沙箱存储</strong>。
              </p>
              <p className={`text-[11px] ${themeConfig.textMutedClass}`}>
                全流程无死角记录底座每一次推理、工具调用、SHA256哈希。只有用户在日志面板手动选择时才会清除。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 sm:px-6 border-t flex items-center justify-between ${themeConfig.modalHeaderClass}`}>
          <span className={`text-[11px] ${themeConfig.textMutedClass}`}>
            {saved ? '✓ 设置与主题已保存生效' : '配置将持久化保存在底座环境'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-medium opacity-70 hover:opacity-100 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${themeConfig.accentBtnClass}`}
            >
              应用并保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
