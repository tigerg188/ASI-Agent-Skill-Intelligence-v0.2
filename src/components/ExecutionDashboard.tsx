import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  Bot,
  UserCheck,
  Check,
} from 'lucide-react';
import { ExecutionStepRecord, ProjectItem, WorkflowNode } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface ExecutionDashboardProps {
  project: ProjectItem;
  isExecuting: boolean;
  onJumpToStep?: (stepIndex: number) => void;
}

export const ExecutionDashboard: React.FC<ExecutionDashboardProps> = ({
  project,
  isExecuting,
  onJumpToStep,
}) => {
  const { theme, themeConfig } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const steps = project.executionSteps || [];
  const nodes = project.contract?.topology?.nodes || [];
  const totalSteps = steps.length || nodes.length || 1;

  const completedSteps = steps.filter((s) => s.status === 'completed');
  const runningSteps = steps.filter((s) => s.status === 'running');
  const waitingApprovalSteps = steps.filter((s) => s.status === 'waiting_approval');
  const pendingSteps = steps.filter((s) => s.status === 'pending');

  const completedCount = completedSteps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  // Dynamic remaining time calculation
  const remainingCount = totalSteps - completedCount;
  const [estimatedSeconds, setEstimatedSeconds] = useState(remainingCount * 4);

  useEffect(() => {
    if (project.status === 'completed' || completedCount === totalSteps) {
      setEstimatedSeconds(0);
      return;
    }

    if (isExecuting || project.status === 'running') {
      const baseSec = Math.max(1, remainingCount * 4);
      setEstimatedSeconds(baseSec);
      const timer = setInterval(() => {
        setEstimatedSeconds((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setEstimatedSeconds(remainingCount * 4);
    }
  }, [isExecuting, project.status, completedCount, totalSteps, remainingCount]);

  // Success rate metrics calculation
  // Base confidence from nodes, boosted or verified by deliverable score
  const stepMetrics = steps.map((step) => {
    const node = nodes.find((n) => n.id === step.nodeId);
    let confidence = node?.confidence || 96;
    let isHumanApproval = node?.type === 'human_approval';

    if (step.deliverable) {
      confidence = Math.max(confidence, step.deliverable.verificationScore);
    }

    return {
      stepIndex: step.stepIndex,
      nodeId: step.nodeId,
      nodeName: step.nodeName,
      nodeType: step.nodeType,
      status: step.status,
      confidence,
      isHumanApproval,
      verificationCriteria: node?.verificationCriteria || '符合金融与产业级客观证据标准',
    };
  });

  const avgConfidence = Math.round(
    stepMetrics.reduce((acc, curr) => acc + curr.confidence, 0) / (stepMetrics.length || 1)
  );

  const formatRemainingTime = () => {
    if (project.status === 'completed' || completedCount === totalSteps) {
      return '已全部完成 (0 秒)';
    }
    if (waitingApprovalSteps.length > 0) {
      return '等待人工核准签批';
    }
    if (project.status === 'paused') {
      return '中途暂停中';
    }
    if (!isExecuting && project.status === 'idle') {
      return `预估约 ${totalSteps * 4} 秒 (待启动)`;
    }

    const min = Math.floor(estimatedSeconds / 60);
    const sec = estimatedSeconds % 60;
    if (min > 0) {
      return `约 ${min} 分 ${sec} 秒`;
    }
    return `约 ${sec} 秒`;
  };

  return (
    <div
      className={`border-b transition-colors duration-200 ${
        theme === 'developer_black'
          ? 'bg-slate-900/75 border-slate-800'
          : theme === 'soft_pink'
          ? 'bg-rose-50/60 border-rose-200'
          : 'bg-[#f8fafd] border-slate-200'
      }`}
    >
      {/* Dashboard Top Toggle Header */}
      <div className="px-4 py-2 flex items-center justify-between gap-2 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-tight">
            项目执行看板 · 实时进度与节点成功率指标
          </span>
          <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-medium ${
            progressPercent === 100
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              : isExecuting
              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse'
              : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
          }`}>
            {progressPercent === 100
              ? '终验达成 100%'
              : isExecuting
              ? `推演中 (${completedCount}/${totalSteps})`
              : `待命中 (${progressPercent}%)`}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1 border transition-colors ${
            theme === 'developer_black'
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm'
          }`}
          title={isExpanded ? '收起仪表盘' : '展开仪表盘'}
        >
          <span>{isExpanded ? '收起看板' : '展开看板'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Main Dashboard Cards */}
      {isExpanded && (
        <div className="p-3 sm:px-5 space-y-3 animate-in fade-in duration-200">
          {/* Top 3 Core Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Metric 1: 执行进度百分比 */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between shadow-sm transition-all ${
                theme === 'developer_black'
                  ? 'bg-slate-950/60 border-slate-800'
                  : theme === 'soft_pink'
                  ? 'bg-white/90 border-rose-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px] font-semibold">
                  <Gauge className="w-3.5 h-3.5 text-blue-500" />
                  <span>执行进度百分比</span>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black font-mono tracking-tight text-blue-600 dark:text-blue-400">
                    {progressPercent}%
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({completedCount} / {totalSteps} 步骤)
                  </span>
                </div>
                <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden mt-1 max-w-[170px]">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Status Ring / Icon */}
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                {progressPercent === 100 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : isExecuting ? (
                  <Zap className="w-5 h-5 text-amber-500 animate-bounce" />
                ) : (
                  <PlayCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </div>

            {/* Metric 2: 预计剩余完成时间 */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between shadow-sm transition-all ${
                theme === 'developer_black'
                  ? 'bg-slate-950/60 border-slate-800'
                  : theme === 'soft_pink'
                  ? 'bg-white/90 border-rose-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px] font-semibold">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>预计剩余完成时间</span>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className={`text-xl font-bold font-mono tracking-tight ${
                    project.status === 'completed'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {formatRemainingTime()}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {isExecuting
                    ? '正在执行沙箱计算与证据生成...'
                    : project.status === 'completed'
                    ? '全证据链哈希已封存入库'
                    : `待执行 ${remainingCount} 个拓扑节点`}
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-indigo-500" />
              </div>
            </div>

            {/* Metric 3: 整体可信成功率 / 达标度 */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between shadow-sm transition-all ${
                theme === 'developer_black'
                  ? 'bg-slate-950/60 border-slate-800'
                  : theme === 'soft_pink'
                  ? 'bg-white/90 border-rose-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>综合可信达标率</span>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                    {avgConfidence}%
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    防伪穿透
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {project.deliverables?.length || 0} 项成果具备 SHA-256 存证
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Bottom Step-by-Step Success Rate & Reliability Radar */}
          <div
            className={`p-3 rounded-xl border ${
              theme === 'developer_black'
                ? 'bg-slate-950/40 border-slate-800/80'
                : theme === 'soft_pink'
                ? 'bg-white/60 border-rose-200'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                <span>各步骤节点成功率与验收指标明细：</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                严格对齐契约验收标准 · 拒绝口头声称完成
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {stepMetrics.map((sm) => {
                const isStepCompleted = sm.status === 'completed';
                const isStepRunning = sm.status === 'running';
                const isStepWaiting = sm.status === 'waiting_approval';

                let borderClass = 'border-slate-700/60 bg-black/5 dark:bg-white/5';
                let badgeClass = 'bg-slate-500/10 text-slate-400';
                let statusText = '待执行';

                if (isStepCompleted) {
                  borderClass = 'border-emerald-500/30 bg-emerald-500/5 text-emerald-950 dark:text-emerald-100';
                  badgeClass = 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
                  statusText = '已终验达标';
                } else if (isStepRunning) {
                  borderClass = 'border-amber-500/40 bg-amber-500/5 animate-pulse';
                  badgeClass = 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
                  statusText = '推演计算中';
                } else if (isStepWaiting) {
                  borderClass = 'border-purple-500/40 bg-purple-500/5';
                  badgeClass = 'bg-purple-500/10 text-purple-600 border border-purple-500/20';
                  statusText = '待人工签字';
                }

                return (
                  <div
                    key={sm.nodeId}
                    onClick={() => onJumpToStep && onJumpToStep(sm.stepIndex)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer hover:scale-[1.01] transition-all ${borderClass}`}
                    title={`点击定位到步骤 ${sm.stepIndex}：${sm.verificationCriteria}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-[11px] text-blue-600 dark:text-blue-400">
                        步骤 {sm.stepIndex}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${badgeClass}`}>
                        {sm.confidence}% 达标
                      </span>
                    </div>

                    <div className="font-semibold text-xs truncate mb-1" title={sm.nodeName}>
                      {sm.nodeName}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{sm.isHumanApproval ? '人工审批关卡' : sm.nodeType}</span>
                      <span className={isStepCompleted ? 'text-emerald-600 font-semibold' : ''}>
                        {statusText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
