import React, { useState } from 'react';
import {
  FolderKanban,
  ChevronDown,
  ChevronRight,
  Bot,
  Sparkles,
  PlusCircle,
  FileCheck2,
  Trash2,
  CheckCircle,
  Clock,
  PlayCircle,
} from 'lucide-react';
import { ProjectCategory, ProjectItem, SkillLevel } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface ProjectManagerProps {
  projects: ProjectItem[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onOpenImport: () => void;
  onOpenProjectManagement: () => void;
  onOpenContract: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
}

const LEVEL_COLORS_DARK: Record<SkillLevel, { bg: string; text: string; border: string }> = {
  L1: { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  L2: { bg: 'bg-teal-950/60', text: 'text-teal-400', border: 'border-teal-500/30' },
  L3: { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-500/30' },
  L4: { bg: 'bg-indigo-950/60', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  L5: { bg: 'bg-purple-950/60', text: 'text-purple-400', border: 'border-purple-500/30' },
  L6: { bg: 'bg-fuchsia-950/60', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
  L7: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-500/30' },
  L8: { bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-500/30' },
};

const LEVEL_COLORS_LIGHT: Record<SkillLevel, { bg: string; text: string; border: string }> = {
  L1: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  L2: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  L3: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  L4: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  L5: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  L6: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200' },
  L7: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  L8: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onOpenImport,
  onOpenProjectManagement,
  onOpenContract,
  onDeleteProject,
}) => {
  const { theme, themeConfig } = useTheme();
  const [agentOpen, setAgentOpen] = useState(true);
  const [skillOpen, setSkillOpen] = useState(true);

  const agentProjects = projects.filter((p) => p.category === 'Agent');
  const skillProjects = projects.filter((p) => p.category === 'Skill');

  const levelColorMap = theme === 'developer_black' ? LEVEL_COLORS_DARK : LEVEL_COLORS_LIGHT;

  const renderProjectCard = (p: ProjectItem) => {
    const isActive = p.id === activeProjectId;
    const levelStyle = levelColorMap[p.level] || levelColorMap.L1;

    let cardClasses = '';
    if (theme === 'developer_black') {
      cardClasses = isActive
        ? 'bg-slate-800/90 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/40 text-white'
        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300';
    } else if (theme === 'soft_pink') {
      cardClasses = isActive
        ? 'bg-white border-rose-400 shadow-md shadow-rose-200/50 ring-2 ring-rose-400/40 text-rose-950 font-medium'
        : 'bg-white/80 border-rose-200 hover:bg-white hover:border-rose-300 text-rose-900 shadow-sm';
    } else {
      // office_gray
      cardClasses = isActive
        ? 'bg-white border-[#1a73e8] shadow-md ring-2 ring-[#1a73e8]/20 text-[#202124] font-medium'
        : 'bg-white border-[#dadce0] hover:border-gray-400 text-[#202124] shadow-sm';
    }

    return (
      <div
        key={p.id}
        onClick={() => onSelectProject(p.id)}
        className={`group relative p-3 rounded-xl border transition-all cursor-pointer text-left ${cardClasses}`}
      >
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center space-x-1.5 flex-1 min-w-0">
            <span
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded border font-mono ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}
              title={`等级: ${p.level}`}
            >
              {p.level}
            </span>
            <h4 className="text-xs font-semibold truncate">
              {p.name}
            </h4>
          </div>

          {/* Status Indicator */}
          <div className="flex-shrink-0">
            {p.status === 'completed' && (
              <span className="flex items-center text-[10px] text-emerald-600 font-mono font-medium" title="已完成全部节点与核验">
                <CheckCircle className="w-3 h-3 mr-0.5" />
                已终验
              </span>
            )}
            {p.status === 'running' && (
              <span className="flex items-center text-[10px] text-amber-600 font-mono animate-pulse font-medium" title="节点执行中">
                <PlayCircle className="w-3 h-3 mr-0.5" />
                运行中
              </span>
            )}
            {p.status === 'idle' && (
              <span className={`flex items-center text-[10px] font-mono ${themeConfig.textMutedClass}`} title="待命中">
                <Clock className="w-3 h-3 mr-0.5" />
                待命中
              </span>
            )}
          </div>
        </div>

        <p className={`text-[11px] line-clamp-2 leading-relaxed mb-2 ${themeConfig.textMutedClass}`}>
          {p.description}
        </p>

        {/* Business Job Badge if present */}
        {p.businessJobs && p.businessJobs.length > 0 && (
          <div className="mb-2">
            <div className={`px-2 py-1 rounded-md text-[10px] flex items-center justify-between border ${
              p.activeJobId
                ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 font-medium'
                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-400'
            }`}>
              <span className="truncate max-w-[190px]">
                ⚡ 业务: {p.businessJobs.find((j) => j.id === p.activeJobId)?.title || p.businessJobs[0].title}
              </span>
              <span className="text-[9px] opacity-80 font-mono">
                {p.businessJobs.find((j) => j.id === p.activeJobId)?.attachments?.length || p.businessJobs[0].attachments?.length || 0}附件
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] border-t border-black/5 pt-2">
          <span className={`truncate max-w-[120px] font-mono ${themeConfig.textMutedClass}`}>
            {p.targetRole}
          </span>

          <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onOpenProjectManagement()}
              className={`px-1.5 py-0.5 rounded text-[10px] border flex items-center space-x-1 transition-colors ${
                theme === 'developer_black'
                  ? 'bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border-indigo-700/50'
                  : theme === 'soft_pink'
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}
              title="打开项目管理与单项业务工作台"
            >
              <FolderKanban className="w-3 h-3 text-indigo-500" />
              <span>管理</span>
            </button>

            <button
              onClick={() => onOpenContract(p)}
              className={`px-1.5 py-0.5 rounded text-[10px] border flex items-center space-x-1 transition-colors ${
                theme === 'developer_black'
                  ? 'bg-slate-800 hover:bg-slate-700 text-blue-300 border-slate-700'
                  : theme === 'soft_pink'
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-blue-700 border-gray-300'
              }`}
              title="查看第2层运行契约与节点拓扑"
            >
              <FileCheck2 className="w-3 h-3" />
              <span>契约</span>
            </button>

            {projects.length > 1 && (
              <button
                onClick={() => onDeleteProject(p.id)}
                className="p-1 rounded opacity-60 hover:opacity-100 hover:text-rose-500 transition-colors"
                title="删除项目"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className={`w-full lg:w-80 xl:w-96 flex flex-col border-r h-full flex-shrink-0 transition-colors duration-200 ${themeConfig.sidebarBgClass}`}>
      {/* Section Header */}
      <div className={`p-3 border-b flex items-center justify-between ${themeConfig.modalHeaderClass}`}>
        <div className="flex items-center space-x-2">
          <FolderKanban className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider">
            项目管理区 (第1层)
          </h2>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenProjectManagement}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-all active:scale-95 ${
              theme === 'developer_black'
                ? 'bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/80'
                : theme === 'soft_pink'
                ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}
            title="打开项目统一管理与单项业务工作台"
          >
            <FolderKanban className="w-3 h-3 text-indigo-500" />
            <span>管理</span>
          </button>

          <button
            onClick={onOpenImport}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-all active:scale-95 ${
              theme === 'developer_black'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30'
                : theme === 'soft_pink'
                ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
            title="新建或导入 Skill / Agent"
          >
            <PlusCircle className="w-3 h-3" />
            <span>导入</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Agent（下弹出） */}
        <div className="space-y-2">
          <button
            onClick={() => setAgentOpen(!agentOpen)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              theme === 'developer_black'
                ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                : theme === 'soft_pink'
                ? 'bg-white hover:bg-rose-50 text-rose-900 border-rose-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bot className="w-3.5 h-3.5 text-indigo-500" />
              <span>Agent 综合体 ({agentProjects.length})</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-[10px] ${themeConfig.textMutedClass}`}>下弹出</span>
              {agentOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
          </button>

          {agentOpen && (
            <div className="space-y-2 pl-1">
              {agentProjects.length === 0 ? (
                <div className={`text-center py-4 text-xs ${themeConfig.textMutedClass}`}>
                  暂无 Agent 项目，点击右上角新建/导入
                </div>
              ) : (
                agentProjects.map(renderProjectCard)
              )}
            </div>
          )}
        </div>

        {/* Skill（下弹出） */}
        <div className="space-y-2">
          <button
            onClick={() => setSkillOpen(!skillOpen)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              theme === 'developer_black'
                ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                : theme === 'soft_pink'
                ? 'bg-white hover:bg-rose-50 text-rose-900 border-rose-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Skill 专业技能与组件 ({skillProjects.length})</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-[10px] ${themeConfig.textMutedClass}`}>下弹出</span>
              {skillOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
          </button>

          {skillOpen && (
            <div className="space-y-2 pl-1">
              {skillProjects.length === 0 ? (
                <div className={`text-center py-4 text-xs ${themeConfig.textMutedClass}`}>
                  暂无 Skill 项目，点击右上角新建/导入
                </div>
              ) : (
                skillProjects.map(renderProjectCard)
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
