import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ProjectManager } from './components/ProjectManager';
import { ExecutionZone } from './components/ExecutionZone';
import { ExecutionDeliverables } from './components/ExecutionDeliverables';
import { ProjectImportModal } from './components/ProjectImportModal';
import { ProjectManagementModal } from './components/ProjectManagementModal';
import { AgentConfigModal } from './components/AgentConfigModal';
import { SoftwareDocsModal } from './components/SoftwareDocsModal';
import { SettingsModal } from './components/SettingsModal';
import { LogsModal } from './components/LogsModal';
import { InterventionModal } from './components/InterventionModal';
import { DeliverableDetailModal } from './components/DeliverableDetailModal';
import { INITIAL_PROJECTS } from './data/mockTemplates';
import { Deliverable, ExecutionContract, ProjectItem, WorkflowNode } from './types';
import { apiService } from './services/apiService';
import { logService } from './services/logService';
import { useTheme } from './contexts/ThemeContext';

const STORAGE_PROJECTS_KEY = 'asi_projects_v04';

export default function App() {
  const { theme, themeConfig } = useTheme();
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return projects[0]?.id || INITIAL_PROJECTS[0].id;
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const executionAbortedRef = useRef(false);

  // Modals state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isProjectManagementOpen, setIsProjectManagementOpen] = useState(false);
  const [contractToReview, setContractToReview] = useState<ExecutionContract | null>(null);
  const [isAgentConfigOpen, setIsAgentConfigOpen] = useState(false);
  const [isSoftwareDocsOpen, setIsSoftwareDocsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  // Intervention & Deliverable Detail state
  const [interventionStep, setInterventionStep] = useState<{
    stepIndex: number;
    node: WorkflowNode;
  } | null>(null);
  const [activeDeliverableDetail, setActiveDeliverableDetail] = useState<Deliverable | null>(null);

  // Mobile layout tab switcher: 'manager' | 'runtime' | 'deliverables'
  const [mobileTab, setMobileTab] = useState<'manager' | 'runtime' | 'deliverables'>('runtime');

  // Sync to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error(e);
    }
  }, [projects]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Execution Engine
  const startPipelineExecution = async (startStepIndex = 1) => {
    if (!activeProject) return;

    executionAbortedRef.current = false;
    setIsExecuting(true);

    logService.addLog(
      'INFO',
      `启动项目流水线执行: ${activeProject.name} (起始步骤: ${startStepIndex})`,
      { totalSteps: activeProject.executionSteps.length },
      activeProject.id,
      activeProject.name
    );

    // Update project status to running
    updateActiveProject((p) => ({ ...p, status: 'running' }));

    const steps = [...activeProject.executionSteps];
    const nodes = activeProject.contract.topology.nodes;

    for (let i = startStepIndex - 1; i < steps.length; i++) {
      if (executionAbortedRef.current) {
        logService.addLog('INFO', '执行流水线已被用户中途暂停。', undefined, activeProject.id, activeProject.name);
        break;
      }

      const currentStep = steps[i];
      const currentNode = nodes.find((n) => n.id === currentStep.nodeId);
      if (!currentNode) continue;

      // Check if step requires human confirmation and hasn't been approved yet
      if (currentNode.type === 'human_approval' && !currentStep.approvalGranted) {
        // Set to waiting_approval and pause
        updateActiveProject((p) => {
          const updatedSteps = [...p.executionSteps];
          updatedSteps[i] = {
            ...updatedSteps[i],
            status: 'waiting_approval',
          };
          return {
            ...p,
            status: 'paused',
            currentStepIndex: i + 1,
            executionSteps: updatedSteps,
          };
        });
        setIsExecuting(false);
        logService.addLog(
          'AUDIT',
          `流水线进入等待人类专家审批状态：【${currentNode.name}】`,
          { condition: currentNode.triggerCondition },
          activeProject.id,
          activeProject.name
        );
        return;
      }

      // Mark step running
      updateActiveProject((p) => {
        const updatedSteps = [...p.executionSteps];
        updatedSteps[i] = {
          ...updatedSteps[i],
          status: 'running',
          startedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        return { ...p, executionSteps: updatedSteps, currentStepIndex: i + 1 };
      });

      // Execute Step via API Service (with reasoning, tool calls, and deliverable)
      try {
        const previousDeliverables = activeProject.deliverables.reduce((acc, d) => {
          acc[d.nodeId] = d.summary;
          return acc;
        }, {} as Record<string, string>);

        const execResult = await apiService.executeStep({
          stepNode: currentNode,
          project: activeProject,
          previousOutputs: previousDeliverables,
          interventionNote: currentStep.interventionNote,
        });

        if (executionAbortedRef.current) break;

        const newDeliverable: Deliverable = {
          ...execResult.deliverable,
          id: `deliv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          projectId: activeProject.id,
          nodeId: currentNode.id,
          stepIndex: i + 1,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };

        // Update step as completed and save deliverable
        updateActiveProject((p) => {
          const updatedSteps = [...p.executionSteps];
          updatedSteps[i] = {
            ...updatedSteps[i],
            status: 'completed',
            completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            thoughtProcess: execResult.thoughtProcess,
            toolCalls: execResult.toolCalls,
            executionLog: execResult.executionLog,
            deliverableId: newDeliverable.id,
            deliverable: newDeliverable,
            canRollback: true,
          };

          const newDeliverablesList = [
            newDeliverable,
            ...p.deliverables.filter((d) => d.nodeId !== currentNode.id),
          ];

          return {
            ...p,
            executionSteps: updatedSteps,
            deliverables: newDeliverablesList,
            lastBreakpoint: {
              stepIndex: i + 1,
              savedAt: new Date().toISOString(),
              snapshotData: { step: i + 1, node: currentNode.id },
            },
          };
        });
      } catch (err: any) {
        console.error('Execution error at step', i + 1, err);
        logService.addLog('ERROR', `步骤 ${i + 1} 执行异常: ${err.message}`, err, activeProject.id, activeProject.name);
        break;
      }
    }

    // Complete if all steps done
    updateActiveProject((p) => {
      const allDone = p.executionSteps.every((s) => s.status === 'completed');
      return {
        ...p,
        status: allDone ? 'completed' : 'paused',
      };
    });

    setIsExecuting(false);
  };

  const pauseExecution = () => {
    executionAbortedRef.current = true;
    setIsExecuting(false);
    updateActiveProject((p) => ({ ...p, status: 'paused' }));
    logService.addLog('INFO', '用户点击了中途暂停', undefined, activeProject?.id, activeProject?.name);
  };

  const resumeExecution = () => {
    if (!activeProject) return;
    const nextPendingStep = activeProject.executionSteps.findIndex(
      (s) => s.status === 'pending' || s.status === 'paused' || s.status === 'waiting_approval'
    );
    startPipelineExecution(nextPendingStep !== -1 ? nextPendingStep + 1 : 1);
  };

  // Rollback to stepIndex (reset downstream steps to pending)
  const rollbackStep = (stepIndex: number) => {
    if (!activeProject) return;
    executionAbortedRef.current = true;
    setIsExecuting(false);

    updateActiveProject((p) => {
      const updatedSteps = p.executionSteps.map((s) => {
        if (s.stepIndex >= stepIndex) {
          return {
            ...s,
            status: 'pending' as const,
            completedAt: undefined,
            executionLog: undefined,
            toolCalls: undefined,
            deliverableId: undefined,
            deliverable: undefined,
          };
        }
        return s;
      });

      // Filter out deliverables produced by rolled-back steps
      const nodesToKeep = p.executionSteps
        .filter((s) => s.stepIndex < stepIndex)
        .map((s) => s.nodeId);
      const updatedDeliverables = p.deliverables.filter((d) => nodesToKeep.includes(d.nodeId));

      return {
        ...p,
        status: 'idle',
        currentStepIndex: stepIndex,
        executionSteps: updatedSteps,
        deliverables: updatedDeliverables,
      };
    });

    logService.addLog(
      'INFO',
      `执行状态机回滚至步骤 ${stepIndex}，下游产出与节点状态已重置`,
      undefined,
      activeProject.id,
      activeProject.name
    );
  };

  // Reset Project to pristine state
  const resetProject = () => {
    if (!activeProject) return;
    executionAbortedRef.current = true;
    setIsExecuting(false);

    updateActiveProject((p) => ({
      ...p,
      status: 'idle',
      currentStepIndex: 1,
      deliverables: [],
      executionSteps: p.contract.topology.nodes.map((n, idx) => ({
        stepIndex: idx + 1,
        nodeId: n.id,
        nodeName: n.name,
        nodeType: n.type,
        status: 'pending',
        canRollback: false,
        requiresUserConfirmation: n.type === 'human_approval',
      })),
    }));

    logService.addLog('INFO', `清除重置项目实例: ${activeProject.name}`, undefined, activeProject.id, activeProject.name);
  };

  // User confirms a Human-in-the-loop step
  const confirmHumanStep = (stepIndex: number) => {
    if (!activeProject) return;
    updateActiveProject((p) => {
      const updatedSteps = [...p.executionSteps];
      if (updatedSteps[stepIndex - 1]) {
        updatedSteps[stepIndex - 1].approvalGranted = true;
        updatedSteps[stepIndex - 1].status = 'pending';
      }
      return {
        ...p,
        executionSteps: updatedSteps,
      };
    });

    logService.addLog(
      'AUDIT',
      `人类主管已签署核准步骤 ${stepIndex}，允许解除阻断并继续推进流水线`,
      undefined,
      activeProject.id,
      activeProject.name
    );

    // Continue execution from this step
    startPipelineExecution(stepIndex);
  };

  // Breakpoint recovery
  const restoreBreakpoint = () => {
    if (!activeProject || !activeProject.lastBreakpoint) return;
    const targetStep = activeProject.lastBreakpoint.stepIndex;
    logService.addLog(
      'INFO',
      `触发断点续传功能：正在恢复步骤 ${targetStep} 的执行快照...`,
      activeProject.lastBreakpoint,
      activeProject.id,
      activeProject.name
    );
    startPipelineExecution(targetStep);
  };

  const saveBreakpointManual = () => {
    if (!activeProject) return;
    const now = new Date().toISOString();
    updateActiveProject((p) => ({
      ...p,
      lastBreakpoint: {
        stepIndex: p.currentStepIndex || 1,
        savedAt: now,
        snapshotData: { manualSave: true },
      },
    }));
    logService.addLog('INFO', `已手动生成执行断点快照 (步骤 ${activeProject.currentStepIndex})`, undefined, activeProject.id, activeProject.name);
  };

  // Submit intervention on step
  const handleInterventionSubmit = (stepIndex: number, note: string) => {
    if (!activeProject) return;
    updateActiveProject((p) => {
      const updatedSteps = [...p.executionSteps];
      if (updatedSteps[stepIndex - 1]) {
        updatedSteps[stepIndex - 1].interventionNote = note;
        updatedSteps[stepIndex - 1].status = 'pending';
      }
      return {
        ...p,
        executionSteps: updatedSteps,
      };
    });
    logService.addLog(
      'INFO',
      `步骤 ${stepIndex} 注入人工纠偏指令: "${note}"，触发局部重新推演`,
      undefined,
      activeProject.id,
      activeProject.name
    );
    startPipelineExecution(stepIndex);
  };

  // Update active project helper
  const updateActiveProject = (updater: (p: ProjectItem) => ProjectItem) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === activeProjectId ? updater(proj) : proj))
    );
  };

  const handleProjectCreated = (newProject: ProjectItem) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    logService.addLog(
      'CONTRACT',
      `新项目【${newProject.name}】已成功载入底座 (契约等级: ${newProject.level})`,
      newProject.contract,
      newProject.id,
      newProject.name
    );
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    if (window.confirm('确认删除该项目及其全部成果和契约吗？')) {
      const remaining = projects.filter((p) => p.id !== id);
      setProjects(remaining);
      if (activeProjectId === id) {
        setActiveProjectId(remaining[0].id);
      }
    }
  };

  const handleLaunchBusinessResearch = (projectId: string, jobId: string) => {
    setActiveProjectId(projectId);
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId
          ? {
              ...proj,
              activeJobId: jobId,
              status: 'running',
              businessJobs: proj.businessJobs?.map((j) =>
                j.id === jobId ? { ...j, status: 'researching' } : j
              ),
            }
          : proj
      )
    );
    const targetProj = projects.find((p) => p.id === projectId);
    const targetJob = targetProj?.businessJobs?.find((j) => j.id === jobId);
    logService.addLog(
      'INFO',
      `启动单项业务研究流水线: 项目【${targetProj?.name}】业务【${targetJob?.title || '新业务'}】`,
      { jobId, materialsCount: targetJob?.attachments?.length || 0 },
      projectId,
      targetProj?.name
    );
    setTimeout(() => {
      startPipelineExecution(1);
    }, 150);
  };

  const handleResetSpecificProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          status: 'idle',
          currentStepIndex: 1,
          deliverables: [],
          executionSteps: p.contract.topology.nodes.map((n, idx) => ({
            stepIndex: idx + 1,
            nodeId: n.id,
            nodeName: n.name,
            nodeType: n.type,
            status: 'pending',
            canRollback: false,
            requiresUserConfirmation: n.type === 'human_approval',
          })),
        };
      })
    );
    const proj = projects.find((p) => p.id === id);
    logService.addLog('INFO', `重置项目实例: ${proj?.name || id}`, undefined, id, proj?.name);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${themeConfig.bgClass}`}>
      {/* Top Header & Metrics Bar */}
      <Header
        onOpenImport={() => setIsImportOpen(true)}
        onOpenProjectManagement={() => setIsProjectManagementOpen(true)}
        onOpenAgentConfig={() => setIsAgentConfigOpen(true)}
        onOpenSoftwareDocs={() => setIsSoftwareDocsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        activeProjectName={activeProject?.name}
        isExecuting={isExecuting}
      />

      {/* Mobile Tab Switcher */}
      <div className={`lg:hidden flex items-center justify-around border-b text-xs font-semibold p-1 ${themeConfig.subBarBgClass}`}>
        <button
          onClick={() => setMobileTab('manager')}
          className={`flex-1 py-1.5 rounded text-center transition-colors ${
            mobileTab === 'manager' ? themeConfig.accentBtnClass : themeConfig.textMutedClass
          }`}
        >
          项目管理区
        </button>
        <button
          onClick={() => setMobileTab('runtime')}
          className={`flex-1 py-1.5 rounded text-center transition-colors ${
            mobileTab === 'runtime' ? themeConfig.accentBtnClass : themeConfig.textMutedClass
          }`}
        >
          项目运行区
        </button>
        <button
          onClick={() => setMobileTab('deliverables')}
          className={`flex-1 py-1.5 rounded text-center transition-colors ${
            mobileTab === 'deliverables' ? themeConfig.accentBtnClass : themeConfig.textMutedClass
          }`}
        >
          项目成果 ({activeProject?.deliverables.length || 0})
        </button>
      </div>

      {/* 3-Column Core Layout (第1层界面 3 列总览) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: 项目管理区 (Agent 与 Skill 折叠面板) */}
        <div className={`h-full ${mobileTab === 'manager' ? 'block w-full' : 'hidden lg:block'}`}>
          <ProjectManager
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={(id) => {
              setActiveProjectId(id);
              setMobileTab('runtime');
            }}
            onOpenImport={() => setIsImportOpen(true)}
            onOpenProjectManagement={() => setIsProjectManagementOpen(true)}
            onOpenContract={(proj) => setContractToReview(proj.contract)}
            onDeleteProject={handleDeleteProject}
          />
        </div>

        {/* Column 2: 项目运行区 (第3层界面 纵向大序号流水线) */}
        <div className={`flex-1 h-full min-w-0 ${mobileTab === 'runtime' ? 'block' : 'hidden lg:block'}`}>
          {activeProject ? (
            <ExecutionZone
              project={activeProject}
              isExecuting={isExecuting}
              onStartExecution={() => startPipelineExecution(1)}
              onPauseExecution={pauseExecution}
              onResumeExecution={resumeExecution}
              onRollbackStep={rollbackStep}
              onResetProject={resetProject}
              onUserConfirmStep={confirmHumanStep}
              onOpenIntervention={(stepIdx, node) =>
                setInterventionStep({ stepIndex: stepIdx, node })
              }
              onViewDeliverable={(d) => setActiveDeliverableDetail(d)}
              onRestoreBreakpoint={restoreBreakpoint}
              onSaveBreakpointManual={saveBreakpointManual}
              onOpenContract={() => setContractToReview(activeProject.contract)}
              onOpenProjectManagement={() => setIsProjectManagementOpen(true)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              请在左侧选择或导入一个项目
            </div>
          )}
        </div>

        {/* Column 3: 项目执行成果 (独立存放与防伪验真) */}
        <div className={`h-full ${mobileTab === 'deliverables' ? 'block w-full' : 'hidden lg:block'}`}>
          {activeProject && (
            <ExecutionDeliverables
              deliverables={activeProject.deliverables}
              projectName={activeProject.name}
              onViewDeliverable={(d) => setActiveDeliverableDetail(d)}
              onJumpToStep={(stepIdx) => {
                setMobileTab('runtime');
              }}
              onTriggerVerify={(d) => setActiveDeliverableDetail(d)}
            />
          )}
        </div>
      </div>

      {/* Modals & Dialogs */}
      {isProjectManagementOpen && (
        <ProjectManagementModal
          isOpen={isProjectManagementOpen}
          onClose={() => setIsProjectManagementOpen(false)}
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={(id) => setActiveProjectId(id)}
          onUpdateProject={(updated) => {
            setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          }}
          onDeleteProject={handleDeleteProject}
          onResetProject={handleResetSpecificProject}
          onImportProjectPackage={(newProj) => {
            setProjects((prev) => [newProj, ...prev]);
            setActiveProjectId(newProj.id);
            logService.addLog('INFO', `成功从项目包导入新工程: ${newProj.name}`, undefined, newProj.id, newProj.name);
          }}
          onOpenImportModal={() => {
            setIsProjectManagementOpen(false);
            setIsImportOpen(true);
          }}
          onOpenContract={(proj) => {
            setIsProjectManagementOpen(false);
            setContractToReview(proj.contract);
          }}
          onLaunchBusinessResearch={handleLaunchBusinessResearch}
        />
      )}

      {isImportOpen && (
        <ProjectImportModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {contractToReview && (
        <ProjectImportModal
          isOpen={Boolean(contractToReview)}
          onClose={() => setContractToReview(null)}
          onProjectCreated={() => {}}
          contractToReview={contractToReview}
          onContractUpdated={(updatedContract) => {
            updateActiveProject((p) => ({ ...p, contract: updatedContract }));
            setContractToReview(null);
          }}
        />
      )}

      {isAgentConfigOpen && (
        <AgentConfigModal
          isOpen={isAgentConfigOpen}
          onClose={() => setIsAgentConfigOpen(false)}
        />
      )}

      {isSoftwareDocsOpen && (
        <SoftwareDocsModal
          isOpen={isSoftwareDocsOpen}
          onClose={() => setIsSoftwareDocsOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isLogsOpen && (
        <LogsModal
          isOpen={isLogsOpen}
          onClose={() => setIsLogsOpen(false)}
          activeProjectId={activeProject?.id}
          activeProjectName={activeProject?.name}
        />
      )}

      {interventionStep && (
        <InterventionModal
          isOpen={Boolean(interventionStep)}
          onClose={() => setInterventionStep(null)}
          stepIndex={interventionStep.stepIndex}
          node={interventionStep.node}
          onSubmitIntervention={handleInterventionSubmit}
        />
      )}

      {activeDeliverableDetail && (
        <DeliverableDetailModal
          deliverable={activeDeliverableDetail}
          onClose={() => setActiveDeliverableDetail(null)}
          onUpdateDeliverable={(updated) => {
            updateActiveProject((p) => ({
              ...p,
              deliverables: p.deliverables.map((d) => (d.id === updated.id ? updated : d)),
            }));
            setActiveDeliverableDetail(updated);
          }}
        />
      )}
    </div>
  );
}
