import React from 'react';
import {
  Award,
  FileCheck,
  ShieldCheck,
  ExternalLink,
  Download,
  Hash,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Table as TableIcon,
  Code2,
} from 'lucide-react';
import { Deliverable } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface ExecutionDeliverablesProps {
  deliverables: Deliverable[];
  projectName: string;
  onViewDeliverable: (d: Deliverable) => void;
  onJumpToStep?: (stepIndex: number) => void;
  onTriggerVerify?: (d: Deliverable) => void;
}

export const ExecutionDeliverables: React.FC<ExecutionDeliverablesProps> = ({
  deliverables,
  projectName,
  onViewDeliverable,
  onJumpToStep,
}) => {
  const { theme, themeConfig } = useTheme();

  const getTypeBadge = (type: Deliverable['type']) => {
    switch (type) {
      case 'table':
        return (
          <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-600 border border-blue-500/20 font-medium">
            <TableIcon className="w-3 h-3" />
            <span>结构化报表</span>
          </span>
        );
      case 'report':
        return (
          <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
            <FileText className="w-3 h-3" />
            <span>专业意见书</span>
          </span>
        );
      case 'verification_proof':
        return (
          <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-600 border border-purple-500/20 font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>合规签字单</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-500/10 text-slate-600 font-medium">
            <Code2 className="w-3 h-3" />
            <span>证据资产</span>
          </span>
        );
    }
  };

  const handleDownload = (d: Deliverable) => {
    const content = `# ${d.title}\n\n所属项目: ${projectName}\n生成时间: ${d.createdAt}\n证据哈希 (SHA256): ${d.evidenceHash}\n验证评分: ${d.verificationScore}%\n\n---\n\n## 成果摘要\n${d.summary}\n\n---\n\n## 详细内容\n${d.content}\n\n---\n\n## 证据链条\n${(d.evidenceChain || []).map((e) => `- [${e.status}] ${e.item} (来源: ${e.source})`).join('\n')}\n`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${d.title.replace(/[\/\s]/g, '_')}_evidence.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <aside className={`w-full lg:w-80 xl:w-96 flex flex-col border-l h-full flex-shrink-0 transition-colors duration-200 ${themeConfig.sidebarBgClass}`}>
      {/* Section Header */}
      <div className={`p-3 border-b flex items-center justify-between ${themeConfig.modalHeaderClass}`}>
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider">
            项目执行成果 (第1层)
          </h2>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-mono font-medium">
          已沉淀 {deliverables.length} 项成果
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {deliverables.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed rounded-xl border-black/10">
            <FileCheck className="w-8 h-8 opacity-40 mx-auto mb-2 text-slate-500" />
            <p className="text-xs font-medium">暂无项目执行成果</p>
            <p className={`text-[11px] mt-1 leading-relaxed ${themeConfig.textMutedClass}`}>
              请在中间「项目运行区」启动任务节点，产出的专业意见、量化报表与证据底稿将自动独立存放于此。
            </p>
          </div>
        ) : (
          deliverables.map((d, index) => {
            const resultIndex = deliverables.length - index;

            let cardStyle = '';
            let hashBoxStyle = '';
            if (theme === 'developer_black') {
              cardStyle = 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 text-slate-100 hover:bg-slate-900/80';
              hashBoxStyle = 'bg-slate-900/90 border-slate-800 text-slate-300';
            } else if (theme === 'soft_pink') {
              cardStyle = 'bg-white border-rose-200 hover:border-rose-300 text-rose-950 shadow-sm';
              hashBoxStyle = 'bg-rose-50/60 border-rose-200 text-rose-900';
            } else {
              // office_gray
              cardStyle = 'bg-white border-[#dadce0] hover:border-gray-400 text-[#202124] shadow-sm';
              hashBoxStyle = 'bg-[#f8f9fa] border-[#e8eaed] text-[#3c4043]';
            }

            return (
              <div
                key={d.id}
                className={`group relative border rounded-xl p-3 transition-all ${cardStyle}`}
              >
                {/* Top Badge & Index */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold font-mono">
                      {resultIndex}
                    </span>
                    <span className="text-xs font-semibold">
                      成果 {resultIndex}
                    </span>
                  </div>
                  {getTypeBadge(d.type)}
                </div>

                {/* Title */}
                <h4 className="text-xs font-medium leading-snug line-clamp-2 mb-1.5">
                  {d.title}
                </h4>

                {/* Summary */}
                <p className={`text-[11px] line-clamp-2 leading-relaxed mb-2.5 ${themeConfig.textMutedClass}`}>
                  {d.summary}
                </p>

                {/* Evidence Hash & Verification */}
                <div className={`rounded-lg p-2 mb-2.5 border space-y-1 ${hashBoxStyle}`}>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="opacity-75 flex items-center space-x-1">
                      <Hash className="w-3 h-3" />
                      <span>证据哈希:</span>
                    </span>
                    <span className="text-blue-600 font-semibold truncate max-w-[130px]" title={d.evidenceHash}>
                      {d.evidenceHash.slice(0, 16)}...
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="opacity-75">防幻觉验真：</span>
                    {d.verified ? (
                      <span className="flex items-center space-x-0.5 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>审计通过 ({d.verificationScore}分)</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-0.5 text-amber-600 font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        <span>待验真</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-black/5">
                  {onJumpToStep && d.stepIndex && (
                    <button
                      onClick={() => onJumpToStep(d.stepIndex)}
                      className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors font-medium"
                      title="定位到项目运行区对应的执行节点"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>步骤 {d.stepIndex} 节点</span>
                    </button>
                  )}

                  <div className="flex items-center space-x-1 ml-auto">
                    <button
                      onClick={() => onViewDeliverable(d)}
                      className={`px-2 py-1 rounded text-[10px] border flex items-center space-x-1 transition-colors ${
                        theme === 'developer_black'
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          : theme === 'soft_pink'
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
                      }`}
                      title="打开全屏检视抽屉"
                    >
                      <Eye className="w-3 h-3 text-blue-600" />
                      <span>查看</span>
                    </button>

                    <button
                      onClick={() => handleDownload(d)}
                      className={`p-1 rounded text-[10px] border transition-colors ${
                        theme === 'developer_black'
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          : theme === 'soft_pink'
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
                      }`}
                      title="导出 Markdown/证据底稿"
                    >
                      <Download className="w-3 h-3 text-emerald-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
