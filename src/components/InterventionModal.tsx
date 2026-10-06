import React, { useState } from 'react';
import { X, Edit3, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { WorkflowNode } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepIndex: number;
  node: WorkflowNode | null;
  onSubmitIntervention: (stepIndex: number, note: string) => void;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  isOpen,
  onClose,
  stepIndex,
  node,
  onSubmitIntervention,
}) => {
  const { theme, themeConfig } = useTheme();
  const [note, setNote] = useState('');

  if (!isOpen || !node) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    onSubmitIntervention(stepIndex, note.trim());
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className={`border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden ${themeConfig.modalBgClass}`}>
        {/* Header */}
        <div className={`p-4 sm:px-6 border-b flex items-center justify-between ${themeConfig.modalHeaderClass}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">
                步骤 {stepIndex}：实时纠偏与人工干预
              </h2>
              <p className={`text-[11px] ${themeConfig.textMutedClass}`}>{node.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          <div className={`p-3 rounded-lg border space-y-1 ${themeConfig.inputBgClass}`}>
            <span className={themeConfig.textMutedClass}>当前节点执行意图与依据：</span>
            <p className="text-slate-200 text-xs">{node.description}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              专业纠偏指令 / 调整依据 / 修正参数：
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例如：请强制将受限物项的判定门槛收紧为 0.05%，并增加对欧盟新规《外资补贴条例》(FSR) 的专门附录对标..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <p className="text-[10px] text-slate-400 mt-1">
              纠偏指令将实时注入底座执行沙箱，该步骤将根据您的指示重新推演并更新证据链。
            </p>
          </div>

          {/* Quick preset intervention tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-slate-500 text-[10px] self-center">快捷指令：</span>
            <button
              type="button"
              onClick={() => setNote('要求提供更高颗粒度的法规原文溯源与页码')}
              className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white border border-slate-700"
            >
              严格法条溯源
            </button>
            <button
              type="button"
              onClick={() => setNote('排除一般性次要瑕疵，仅聚焦致命性废标/否决项')}
              className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white border border-slate-700"
            >
              聚焦致命否决项
            </button>
            <button
              type="button"
              onClick={() => setNote('增加防范第三方长臂管辖的资产横向隔离方案')}
              className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white border border-slate-700"
            >
              长臂管辖规避
            </button>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!note.trim()}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center space-x-1.5"
            >
              <span>确认纠偏并重算本步</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
