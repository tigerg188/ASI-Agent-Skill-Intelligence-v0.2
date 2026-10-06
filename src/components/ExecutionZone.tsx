import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Edit3,
  BookmarkCheck,
  Cpu,
  Layers,
  Sparkles,
  UserCheck,
  Clock,
  ArrowRight,
  Database,
  SlidersHorizontal,
  Paperclip,
  FolderKanban,
  PlusCircle,
} from 'lucide-react';
import { Deliverable, ExecutionStepRecord, ProjectItem, WorkflowNode } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { ExecutionDashboard } from './ExecutionDashboard';

interface ExecutionZoneProps {
  project: ProjectItem;
  isExecuting: boolean;
  onStartExecution: () => void;
  onPauseExecution: () => void;
  onResumeExecution: () => void;
  onRollbackStep: (stepIndex: number) => void;
  onResetProject: () => void;
  onUserConfirmStep: (stepIndex: number) => void;
  onOpenIntervention: (stepIndex: number, node: WorkflowNode) => void;
  onViewDeliverable: (d: Deliverable) => void;
  onRestoreBreakpoint: () => void;
  onSaveBreakpointManual: () => void;
  onOpenContract: () => void;
  onOpenProjectManagement: () => void;
}

export const ExecutionZone: React.FC<ExecutionZoneProps> = ({
  project,
  isExecuting,
  onStartExecution,
  onPauseExecution,
  onResumeExecution,
  onRollbackStep,
  onResetProject,
  onUserConfirmStep,
  onOpenIntervention,
  onViewDeliverable,
  onRestoreBreakpoint,
  onSaveBreakpointManual,
  onOpenContract,
  onOpenProjectManagement,
}) => {
  const { theme, themeConfig } = useTheme();

  // Map step index to expanded state
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const toggleStepExpand = (stepIndex: number) => {
    setExpandedSteps((prev) => ({ ...prev, [stepIndex]: !prev[stepIndex] }));
  };

  const steps = project.executionSteps;
  const nodes = project.contract.topology.nodes;

  const getStatusBadge = (status: ExecutionStepRecord['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>已完成并验真</span>
          </span>
        );
      case 'running':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-300 flex items-center space-x-1 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
            <span>正在执行与推演</span>
          </span>
        );
      case 'waiting_approval':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-300 flex items-center space-x-1 animate-bounce">
            <UserCheck className="w-3 h-3 text-purple-600" />
            <span>等待人类专家确认</span>
          </span>
        );
      case 'paused':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-300 flex items-center space-x-1">
            <Pause className="w-3 h-3 text-blue-600" />
            <span>已暂停</span>
          </span>
        );
      default:
        return (
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center space-x-1 ${
            theme === 'developer_black' ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-gray-100 text-gray-600 border-gray-300'
          }`}>
            <Clock className="w-3 h-3 opacity-60" />
            <span>待触发</span>
          </span>
        );
    }
  };

  return (
    <main className={`flex-1 flex flex-col overflow-hidden min-w-0 transition-colors duration-200 ${themeConfig.bgClass}`}>
      {/* Execution Control Header / Toolbar */}
      <div className={`border-b p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-sm ${themeConfig.headerBgClass}`}>
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider">
              项目运行区 (第3层)
            </span>
          </div>

          <span className="opacity-30 hidden sm:inline">/</span>

          <div className="flex items-center space-x-2 min-w-0">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/30 font-mono">
              {project.level}
            </span>
            <h3 className="text-xs sm:text-sm font-semibold truncate max-w-xs sm:max-w-md">
              {project.name}
            </h3>
          </div>
        </div>

        {/* 6 大核心运行控制按钮群: 任务书指定 */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
          {/* Start / Pause / Resume */}
          {project.status === 'running' || isExecuting ? (
            <button
              onClick={onPauseExecution}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-amber-600 hover:bg-amber-500 text-white shadow transition-all active:scale-95"
              title="中途暂停：任意步骤可暂停，等待用户"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>中途暂停</span>
            </button>
          ) : project.status === 'paused' ? (
            <button
              onClick={onResumeExecution}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all active:scale-95"
              title="从暂停点继续执行"
            >
              <Play className="w-3.5 h-3.5" />
              <span>继续执行</span>
            </button>
          ) : (
            <button
              onClick={onStartExecution}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow shadow-blue-500/20 transition-all active:scale-95"
              title="按契约一键启动全流程执行"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>启动流水线</span>
            </button>
          )}

          {/* Reset / Clear */}
          <button
            onClick={onResetProject}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95"
            title="清除重置：清空运行实例，重新开始"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>清除重置</span>
          </button>

          {/* Breakpoint Recovery / Save */}
          <div className="flex items-center space-x-1 bg-slate-800/80 p-0.5 rounded-md border border-slate-700/80">
            <button
              onClick={onSaveBreakpointManual}
              className="px-2 py-1 rounded text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors flex items-center space-x-1"
              title="保存当前执行快照为安全断点"
            >
              <BookmarkCheck className="w-3 h-3 text-cyan-400" />
              <span>快照断点</span>
            </button>
            {project.lastBreakpoint && (
              <button
                onClick={onRestoreBreakpoint}
                className="px-2 py-1 rounded text-[11px] font-medium text-cyan-300 hover:text-cyan-200 hover:bg-slate-700/80 transition-colors flex items-center space-x-1"
                title={`从断点恢复 (步骤 ${project.lastBreakpoint.stepIndex})`}
              >
                <Database className="w-3 h-3 text-emerald-400" />
                <span>断点续传</span>
              </button>
            )}
          </div>

          {/* View Contract */}
          <button
            onClick={onOpenContract}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-blue-200 border border-slate-700 transition-all"
            title="查看完整运行契约与节点拓扑"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">运行契约</span>
          </button>
        </div>
      </div>

      {/* Contract & Environment Snapshot Notice */}
      <div className="bg-slate-900/40 border-b border-slate-800/60 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="text-slate-400">主入口:</span>
            <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">
              {project.contract.entrypoint}
            </code>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center space-x-1">
            <span className="text-slate-400">适配环境:</span>
            <span className="text-slate-300">{project.contract.environment.runtime}</span>
          </span>
          <span className="text-slate-700 hidden md:inline">|</span>
          <span className="text-slate-300 hidden md:inline">
            节点数: {project.contract.topology.nodes.length} (分支触发与成果移交已对齐)
          </span>
        </div>

        {project.lastBreakpoint && (
          <span className="text-[11px] text-cyan-400 font-mono flex items-center space-x-1">
            <BookmarkCheck className="w-3 h-3" />
            <span>已保存断点: 步骤 {project.lastBreakpoint.stepIndex} ({project.lastBreakpoint.savedAt.slice(11)})</span>
          </span>
        )}
      </div>

      {/* Business Job Status Banner: 任务书指定“每个项目根据各自要求还有建立单项业务的功能，比如新建‘锂电池全球产业研究’等新的业务项目，可以手动输入文字，也可以本地上传PPT、PDF、word、excel、markdown、TXT等文档或图片，然后才能正常启动项目研究” */}
      {(() => {
        const activeJob = project.businessJobs?.find((j) => j.id === project.activeJobId) || project.businessJobs?.[0];
        if (activeJob) {
          return (
            <div className={`border-b px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 ${
              theme === 'developer_black'
                ? 'bg-indigo-950/30 border-indigo-900/50'
                : theme === 'soft_pink'
                ? 'bg-rose-50/70 border-rose-200'
                : 'bg-indigo-50/60 border-indigo-100'
            }`}>
              <div className="flex items-start space-x-2.5 flex-1 min-w-[280px]">
                <div className="p-1 rounded bg-indigo-500/20 text-indigo-400 mt-0.5">
                  <Paperclip className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      当前挂载单项业务:
                    </span>
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-100">
                      【{activeJob.title}】
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {activeJob.status === 'researching' ? '研究推进中' : '已就绪'}
                    </span>
                    <span className="text-[10px] opacity-75 font-mono">
                      (包含 {activeJob.attachments?.length || 0} 个本地资料凭证)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {activeJob.backgroundDescription}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenProjectManagement}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/10 transition-colors flex items-center space-x-1"
                  title="切换或建立新的单项业务项目"
                >
                  <FolderKanban className="w-3 h-3" />
                  <span>管理/新建单项业务</span>
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="border-b px-4 py-2.5 text-xs bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-500" />
              <span>
                <strong>未指定单项业务：</strong>建议先建立单项业务（如新建“锂电池全球产业研究”等，输入背景文字并上传 PPT / PDF / Word / Excel / Markdown / TXT 等资料），以确保项目研究获得高精准度产业交付物。
              </span>
            </div>
            <button
              onClick={onOpenProjectManagement}
              className="px-3 py-1 rounded-md text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center space-x-1 shadow transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>立即建立单项业务</span>
            </button>
          </div>
        );
      })()}

      {/* Main Execution Timeline: 任务书指定“左侧较大序号向下延伸，序号后是本环节执行步骤” */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {steps.map((step, index) => {
          const node = nodes.find((n) => n.id === step.nodeId) || {
            id: step.nodeId,
            name: step.nodeName,
            type: step.nodeType,
            description: '执行阶段任务',
            triggerCondition: '前置节点完成',
            deliverableTransfer: '交付给下一节点',
            verificationCriteria: '符合专业标准',
            roleOrTarget: '专业执行节点',
          };

          const isExpanded = expandedSteps[step.stepIndex] ?? true;
          const matchedDeliverable = project.deliverables.find(
            (d) => d.id === step.deliverableId || d.stepIndex === step.stepIndex || d.nodeId === step.nodeId
          );

          return (
            <div key={step.stepIndex} className="relative flex items-start space-x-4 group">
              {/* Vertical connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-5 top-12 bottom-[-24px] w-0.5 ${
                    step.status === 'completed'
                      ? 'bg-gradient-to-b from-emerald-500 to-slate-700'
                      : 'bg-slate-800'
                  }`}
                />
              )}

              {/* 任务书核心要求：左侧较大“序号”向下延伸 */}
              <div className="flex flex-col items-center flex-shrink-0 z-10">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold font-mono text-base md:text-lg shadow-md border transition-all ${
                    step.status === 'completed'
                      ? theme === 'developer_black'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/60 shadow-emerald-500/10'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-400'
                      : step.status === 'running'
                      ? theme === 'developer_black'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/80 animate-pulse shadow-amber-500/20'
                        : 'bg-amber-100 text-amber-800 border-amber-400 animate-pulse'
                      : step.status === 'waiting_approval'
                      ? theme === 'developer_black'
                        ? 'bg-purple-950 text-purple-300 border-purple-500/80 shadow-purple-500/20'
                        : 'bg-purple-100 text-purple-800 border-purple-400 shadow-sm'
                      : theme === 'developer_black'
                      ? 'bg-slate-900 text-slate-400 border-slate-700'
                      : 'bg-white text-gray-500 border-gray-300 shadow-sm'
                  }`}
                >
                  {step.stepIndex < 10 ? `0${step.stepIndex}` : step.stepIndex}
                </div>

                <span className={`text-[10px] font-mono mt-1 uppercase ${themeConfig.textMutedClass}`}>
                  {step.nodeType}
                </span>
              </div>

              {/* 右侧步骤全景展开卡片 */}
              <div
                className={`flex-1 rounded-xl border transition-all ${
                  theme === 'developer_black'
                    ? step.status === 'running'
                      ? 'bg-slate-900/90 border-amber-500/50 shadow-md shadow-amber-500/5'
                      : step.status === 'completed'
                      ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      : step.status === 'waiting_approval'
                      ? 'bg-slate-900/90 border-purple-500/50 ring-1 ring-purple-500/40 shadow-lg'
                      : 'bg-slate-900/40 border-slate-800/80 opacity-80'
                    : theme === 'soft_pink'
                    ? step.status === 'running'
                      ? 'bg-white border-amber-400 shadow-md ring-2 ring-amber-300/40 text-rose-950'
                      : step.status === 'completed'
                      ? 'bg-white border-rose-200 hover:border-rose-300 text-rose-950 shadow-sm'
                      : step.status === 'waiting_approval'
                      ? 'bg-white border-purple-400 ring-2 ring-purple-300/40 text-rose-950 shadow-md'
                      : 'bg-white/80 border-rose-100 text-rose-900 opacity-90'
                    : step.status === 'running'
                    ? 'bg-white border-[#1a73e8] shadow-md ring-2 ring-[#1a73e8]/20 text-[#202124]'
                    : step.status === 'completed'
                    ? 'bg-white border-[#dadce0] hover:border-gray-400 text-[#202124] shadow-sm'
                    : step.status === 'waiting_approval'
                    ? 'bg-white border-purple-500 ring-2 ring-purple-300 text-[#202124] shadow-md'
                    : 'bg-white/90 border-[#dadce0] text-[#202124] opacity-90'
                }`}
              >
                {/* Step Card Header */}
                <div className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-b border-black/5">
                  <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                    <span className={`text-xs px-2 py-0.5 rounded font-mono border ${
                      theme === 'developer_black'
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : theme === 'soft_pink'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    }`}>
                      节点 {node.id}
                    </span>
                    <h3 className="text-sm font-semibold truncate">
                      {step.nodeName}
                    </h3>
                    <span className={`text-xs hidden lg:inline ${themeConfig.textMutedClass}`}>
                      ({node.roleOrTarget})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(step.status)}

                    {/* Step Action Buttons: 纠偏、回滚、全界面折叠 */}
                    {step.status === 'completed' && (
                      <button
                        onClick={() => onRollbackStep(step.stepIndex)}
                        className="px-2 py-1 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 flex items-center space-x-1 transition-colors"
                        title="回滚：回退到本步骤并重新分支执行"
                      >
                        <RotateCcw className="w-3 h-3 text-rose-400" />
                        <span>回滚至此</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenIntervention(step.stepIndex, node as WorkflowNode)}
                      className="px-2 py-1 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-blue-200 border border-slate-700 flex items-center space-x-1 transition-colors"
                      title="纠偏：修改参数 / 强制纠偏指示 / 调整干预逻辑"
                    >
                      <Edit3 className="w-3 h-3 text-blue-400" />
                      <span>纠偏干预</span>
                    </button>

                    <button
                      onClick={() => toggleStepExpand(step.stepIndex)}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      title={isExpanded ? '收起详情' : '展开全景'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Human Confirmation Gatekeeper Banner (如果处于 waiting_approval) */}
                {step.status === 'waiting_approval' && (
                  <div className="p-4 bg-purple-950/40 border-b border-purple-500/30 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-500/50 flex items-center justify-center text-purple-300">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-purple-200">
                          关键人机协同关卡：需专业主管核准签字 (Human Gatekeeper)
                        </h4>
                        <p className="text-[11px] text-purple-300/80">
                          {node.description || '发现重大决策分歧或高敏感法律资产剥离，底座强制阻断等待人类确认。'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onUserConfirmStep(step.stepIndex)}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/25 transition-all active:scale-95 flex items-center space-x-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>专家在线签署并批准推进</span>
                    </button>
                  </div>
                )}

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-4 space-y-4 text-xs">
                    {/* 1. 任务书指定核心问题：“这一步为什么做、依据是什么” */}
                    <div className={`rounded-xl p-3.5 border space-y-1.5 ${
                      theme === 'developer_black'
                        ? 'bg-slate-950/70 border-slate-800 text-slate-300'
                        : theme === 'soft_pink'
                        ? 'bg-[#fff5f7] border-rose-200 text-rose-950'
                        : 'bg-[#f8f9fa] border-[#e8eaed] text-[#202124]'
                    }`}>
                      <div className="flex items-center space-x-1.5 text-blue-600 font-semibold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>为什么做这一步 · 依据与前置触发机制 (Reasoning & Trigger)</span>
                      </div>
                      <p className="leading-relaxed text-xs">
                        {step.thoughtProcess || node.description || '依据契约规则，提取前置输入材料，对标行业专业规范进行深度穿透。'}
                      </p>
                      <div className={`flex flex-wrap gap-2 text-[11px] font-mono pt-1.5 border-t ${
                        theme === 'developer_black' ? 'border-slate-800 text-slate-400' : 'border-black/5 text-slate-500'
                      }`}>
                        <span>前置识别与触发: <strong className={themeConfig.textPrimaryClass}>{node.triggerCondition}</strong></span>
                        <span className="opacity-30">|</span>
                        <span>成果移交机制: <strong className={themeConfig.textPrimaryClass}>{node.deliverableTransfer}</strong></span>
                      </div>
                    </div>

                    {/* 2. 实际执行过程与工具调用 (Tool calls & Sandbox trace) */}
                    <div className="space-y-2">
                      <div className={`flex items-center justify-between font-semibold text-[11px] ${themeConfig.textMutedClass}`}>
                        <div className="flex items-center space-x-1.5">
                          <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                          <span>执行过程与工具/沙箱调用记录 (Execution & Tool Calls)</span>
                        </div>
                        {step.toolCalls && (
                          <span className="font-mono text-[10px]">
                            调用 {step.toolCalls.length} 项工具/算法
                          </span>
                        )}
                      </div>

                      {step.toolCalls && step.toolCalls.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {step.toolCalls.map((tc, tcIdx) => (
                            <div
                              key={tcIdx}
                              className={`p-2 rounded-lg border font-mono text-[10px] flex items-center justify-between ${
                                theme === 'developer_black'
                                  ? 'bg-slate-950 border-slate-800 text-slate-300'
                                  : theme === 'soft_pink'
                                  ? 'bg-white border-rose-200 text-rose-900 shadow-sm'
                                  : 'bg-white border-[#e8eaed] text-[#3c4043] shadow-sm'
                              }`}
                            >
                              <div className="flex items-center space-x-2 truncate">
                                <span className="text-indigo-600 font-bold">{tc.tool}</span>
                                <span className="truncate max-w-[160px] opacity-80">{tc.commandOrArgs}</span>
                              </div>
                              <div className="flex items-center space-x-1.5 flex-shrink-0">
                                <span className="opacity-60">{tc.latencyMs}ms</span>
                                <span className="text-emerald-600 font-bold">✓</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Console Log Terminal */}
                      {step.executionLog ? (
                        <pre className="bg-[#1e1e1e] text-[#d4d4d4] rounded-lg p-3 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed border border-gray-800 max-h-36">
                          {step.executionLog}
                        </pre>
                      ) : (
                        <div className={`text-[11px] italic py-1 ${themeConfig.textMutedClass}`}>
                          等待节点触发，执行日志将在沙箱启动后实时流式输出...
                        </div>
                      )}
                    </div>

                    {/* 3. 产出了什么、可不可信、成果链接按钮 (Deliverable & Evidence) */}
                    {matchedDeliverable ? (
                      <div className={`rounded-xl p-3.5 border space-y-2 ${
                        theme === 'developer_black'
                          ? 'bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-900 border-emerald-500/30'
                          : theme === 'soft_pink'
                          ? 'bg-gradient-to-r from-rose-50 to-white border-rose-300 shadow-sm'
                          : 'bg-gradient-to-r from-emerald-50/50 to-white border-emerald-200 shadow-sm'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="font-bold text-xs">
                              产出物: {matchedDeliverable.title}
                            </span>
                          </div>

                          {/* 任务书要求：同步在项目运行区内显示“成果链接按钮” */}
                          <button
                            onClick={() => onViewDeliverable(matchedDeliverable)}
                            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1 shadow transition-all active:scale-95"
                            title="打开成果物独立全屏预览抽屉"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>成果链接 / 检视证据</span>
                          </button>
                        </div>

                        <p className={`text-xs ${themeConfig.textSecondaryClass}`}>
                          {matchedDeliverable.summary}
                        </p>

                        {/* Evidence Chain & Hash */}
                        <div className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-[11px] ${
                          theme === 'developer_black' ? 'border-slate-800' : 'border-black/5'
                        }`}>
                          <span className={`font-mono ${themeConfig.textMutedClass}`}>
                            证据哈希: <span className="text-blue-600">{matchedDeliverable.evidenceHash.slice(0, 20)}...</span>
                          </span>

                          <div className="flex items-center space-x-2">
                            <span className={themeConfig.textMutedClass}>客观验真评分:</span>
                            <span className="text-emerald-600 font-bold font-mono">
                              {matchedDeliverable.verificationScore} / 100
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`flex items-center justify-between text-[11px] p-2.5 rounded-lg border ${
                        theme === 'developer_black'
                          ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}>
                        <span>本节点暂未产生最终成果物，将在执行完毕后自动挂接证据并移交。</span>
                        <span className="font-mono">验收标准: {node.verificationCriteria}</span>
                      </div>
                    )}

                    {/* Intervention note banner if user intervened */}
                    {step.interventionNote && (
                      <div className="p-2.5 rounded bg-blue-950/30 border border-blue-500/30 text-[11px] text-blue-300 flex items-center space-x-2">
                        <Edit3 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span>
                          <strong>人工纠偏记录:</strong> {step.interventionNote}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
