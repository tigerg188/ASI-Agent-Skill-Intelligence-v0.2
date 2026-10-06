import React, { useEffect, useState } from 'react';
import {
  X,
  FileText,
  Download,
  Copy,
  Check,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Layers,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { logService } from '../services/logService';
import { LogEntry } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProjectId?: string;
  activeProjectName?: string;
}

export const LogsModal: React.FC<LogsModalProps> = ({
  isOpen,
  onClose,
  activeProjectId,
  activeProjectName,
}) => {
  const { theme, themeConfig } = useTheme();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLogs(logService.getLogs());
      return logService.subscribe(() => {
        setLogs(logService.getLogs());
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    const matchesSearch =
      searchTerm === '' ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.projectName && log.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      JSON.stringify(log.details || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleDownloadTxt = () => {
    const txtContent = logService.exportAsTxt();
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASI_execution_log_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonContent = logService.exportAsJson();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASI_audit_logs_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const txtContent = logService.exportAsTxt();
    navigator.clipboard.writeText(txtContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清空全部运行与审计日志吗？此操作不可恢复。')) {
      logService.clearAll();
      setLogs([]);
    }
  };

  const handleClearCurrent = () => {
    if (activeProjectId) {
      logService.clearByProject(activeProjectId);
      setLogs(logService.getLogs());
    }
  };

  const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'CONTRACT':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">CONTRACT</span>;
      case 'EXECUTION':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">EXEC</span>;
      case 'EVIDENCE':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">EVIDENCE</span>;
      case 'AUDIT':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">AUDIT</span>;
      case 'ERROR':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">ERROR</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-700/60 text-slate-300">INFO</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className={`border rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden ${themeConfig.modalBgClass}`}>
        {/* Header */}
        <div className={`p-4 sm:px-6 border-b flex items-center justify-between ${themeConfig.modalHeaderClass}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center space-x-2">
                <span>底座全方位无死角运行日志</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-mono">
                  {logs.length} 条记录 (长期留存)
                </span>
              </h2>
              <p className={`text-[11px] ${themeConfig.textMutedClass}`}>
                支持 TXT 与 JSON 双语/双格式导出 · 便于 AI 大模型随时查验与全流程审计
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Export TXT */}
            <button
              onClick={handleDownloadTxt}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-colors ${
                theme === 'developer_black'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300 shadow-sm'
              }`}
              title="导出 TXT 纯文本日志格式 (中英双语格式)"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>导出 .TXT</span>
            </button>

            {/* Export JSON */}
            <button
              onClick={handleDownloadJson}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-colors ${
                theme === 'developer_black'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300 shadow-sm'
              }`}
              title="导出 JSON 结构化格式 (供 AI 大模型分析)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>导出 .JSON</span>
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="一键复制全部日志"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Clear options */}
        <div className="p-3 sm:px-6 bg-slate-950/50 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索日志关键字、项目名或执行哈希..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-wrap">
            {/* Level Filter */}
            <div className="flex items-center space-x-1 text-xs">
              <Filter className="w-3 h-3 text-slate-500" />
              {['ALL', 'CONTRACT', 'EXECUTION', 'EVIDENCE', 'AUDIT', 'INFO', 'ERROR'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    selectedLevel === lvl
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Clear Actions */}
            <div className="flex items-center space-x-1 border-l border-slate-800 pl-2">
              {activeProjectId && (
                <button
                  onClick={handleClearCurrent}
                  className="px-2 py-1 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="仅删除当前激活项目的日志"
                >
                  清除当前工程日志
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="清空全部日志"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Logs Stream List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 font-mono text-xs space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Terminal className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p>未找到符合条件的日志记录</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all text-left space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                      {getLevelBadge(log.level)}
                      {log.projectName && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                          {log.projectName}
                        </span>
                      )}
                    </div>

                    {log.details && (
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center space-x-0.5"
                      >
                        <span>{isExpanded ? '收起详情' : '展开详情 (JSON)'}</span>
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                    )}
                  </div>

                  <p className="text-slate-200 text-xs leading-relaxed font-sans">
                    {log.message}
                  </p>

                  {isExpanded && log.details && (
                    <pre className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                      {typeof log.details === 'string'
                        ? log.details
                        : JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:px-6 border-t border-slate-800 flex items-center justify-between bg-slate-950/70 text-xs text-slate-400 font-mono">
          <span>日志已由 LocalStorage 与后端沙箱双重持久化</span>
          <button
            onClick={onClose}
            className="px-4 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            关闭日志
          </button>
        </div>
      </div>
    </div>
  );
};
