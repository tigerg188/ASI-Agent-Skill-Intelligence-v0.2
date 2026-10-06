import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  Globe,
  PenTool,
  FolderOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Network,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Sliders,
  RefreshCw,
  FileCheck2,
  Workflow,
  ListTree,
  ChevronRight,
  Check,
  Info,
  FileJson,
  Terminal,
  Copy,
  Download,
  Code2,
  GitFork,
} from 'lucide-react';
import {
  ExecutionContract,
  ProjectItem,
  SkillLevel,
  SKILL_LEVEL_DEFINITIONS,
  WorkflowFlow,
  WorkflowNode,
  Stage2DependencyNode,
  IntelligentContractEngineResult,
} from '../types';
import { apiService } from '../services/apiService';
import { useTheme } from '../contexts/ThemeContext';

interface ProjectImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: ProjectItem) => void;
  contractToReview?: ExecutionContract; // if passed, review existing contract
  onContractUpdated?: (contract: ExecutionContract) => void;
}

export const ProjectImportModal: React.FC<ProjectImportModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
  contractToReview,
  onContractUpdated,
}) => {
  const { theme, themeConfig } = useTheme();
  // Step in wizard: 1 = Import Method, 2 = AI Identification & Contract Generation
  const [currentStep, setCurrentStep] = useState<number>(contractToReview ? 2 : 1);
  const [importMethod, setImportMethod] = useState<'link' | 'custom' | 'upload'>('link');
  const [showMechanismPanel, setShowMechanismPanel] = useState(false);

  // Multi-Stage Reasoning Intelligent Contract Parser Engine State
  const [engineResult, setEngineResult] = useState<IntelligentContractEngineResult | null>(null);
  const [activeEngineStage, setActiveEngineStage] = useState<1 | 2 | 3>(1);
  const [expandedDepNodes, setExpandedDepNodes] = useState<Record<string, boolean>>({
    'dep-root': true,
    'dep-1': true,
  });
  const [schemaCopied, setSchemaCopied] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<'schema' | 'flow' | 'rules'>('schema');

  // Input fields for Step 1
  const [gitUrl, setGitUrl] = useState('https://github.com/agent-ecosystem/enterprise-m-a-compliance-agent');
  const [customGoal, setCustomGoal] = useState('');
  const [customInputs, setCustomInputs] = useState('');
  const [customRole, setCustomRole] = useState('企业管理与法务专家');
  const [uploadFiles, setUploadFiles] = useState<string[]>([
    'SKILL.md',
    'scripts/extract_rules.py',
    'config/mcp_servers.json',
    'references/standards_v3.pdf',
  ]);
  const [projectName, setProjectName] = useState('企业级跨国投资与反垄断合规审查 Agent');

  // Step 2 State (AI Parsing & Contract)
  const [isParsing, setIsParsing] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'tree' | 'flowchart'>('flowchart');
  const [contractDetailsExpanded, setContractDetailsExpanded] = useState(false);

  // The generated or reviewed contract
  const [contract, setContract] = useState<ExecutionContract>(
    contractToReview || {
      id: 'contract-new',
      projectId: 'proj-new',
      createdAt: new Date().toISOString(),
      level: 'L6',
      levelConfidence: 97,
      levelReason: '检测到项目包含自主编排状态机、复杂规则库与多阶段交付闭环，适配为 L6 完整 Agent/Workflow 架构。',
      entrypoint: 'agent_orchestrator.py / SKILL.md',
      sourceTag: 'AI 推断',
      environment: {
        runtime: 'Python 3.11 + Docker 隔离沙箱',
        dependencies: ['pydantic', 'networkx', 'pdfplumber', 'requests'],
        mcpServers: ['mcp-legal-lexisnexis', 'mcp-export-control-db'],
        sandboxRequirements: ['严格网络隔离', '敏感数据只读挂载', '双重内存防护'],
      },
      topology: {
        entryNodeId: 'n-1',
        exitNodeId: 'n-4',
        nodes: [
          {
            id: 'n-1',
            name: '涉案企业股权与司法管辖门槛扫描',
            type: 'skill',
            roleOrTarget: '涉外法务分析专家',
            description: '解析并购协议及持股比例，比对反垄断法定申报标准。',
            triggerCondition: '用户提交企业尽调资料与股权架构图',
            inputs: ['交易草案', '财务报表'],
            outputs: ['多法域强制申报门槛矩阵'],
            deliverableTransfer: '以结构化凭证包移交给节点2',
            verificationCriteria: '法条与营业额换算无数学偏差',
            confidence: 98,
            sourceTag: '原项目',
          },
          {
            id: 'n-2',
            name: '受控两用技术与出口管制穿透比对',
            type: 'script',
            roleOrTarget: '合规计算算法脚本',
            description: '运行 Python 匹配脚本穿透受控 CCL/EAR 目录。',
            triggerCondition: '节点1确认海外持股且涉及前沿技术',
            inputs: ['多法域强制申报门槛矩阵', '技术清单'],
            outputs: ['出口管制风险诊断单'],
            deliverableTransfer: '生成红黄蓝风险卡提交专家核准',
            verificationCriteria: '精确附官方公布受控物项批次编码',
            confidence: 94,
            sourceTag: 'AI 推断',
          },
          {
            id: 'n-3',
            name: '合规风险阻断与资产剥离审批',
            type: 'human_approval',
            roleOrTarget: '合规总监 / 牵头合伙人 (人类确认)',
            description: '高风险人工把关关卡：对受限资产剥离方案进行签字核准。',
            triggerCondition: '发现重大法律风险项时强制阻断等待人类授权',
            inputs: ['出口管制风险诊断单'],
            outputs: ['合规长签署核准书'],
            deliverableTransfer: '签署确认后推入最终成果归集器',
            verificationCriteria: '人类主管必须在线点击签署',
            confidence: 100,
            sourceTag: '用户决定',
          },
          {
            id: 'n-4',
            name: '综合法律意见书与全证据链封存',
            type: 'aggregate',
            roleOrTarget: '终验交付归集器',
            description: '归集前序各节点产出，生成可直接交董事会决策的意见书及证据单。',
            triggerCondition: '节点3完成签署',
            inputs: ['合规长签署核准书', '全套研判底稿'],
            outputs: ['最终决策审计意见书', 'SHA256 证据包'],
            deliverableTransfer: '推入项目执行成果展示区',
            verificationCriteria: '防幻觉校验通过率 >= 98%',
            confidence: 99,
            sourceTag: 'AI 推断',
          },
        ],
        flows: [
          { from: 'n-1', to: 'n-2', condition: '管辖范围确认无误', dataPassed: '管辖判定矩阵' },
          { from: 'n-2', to: 'n-3', condition: '存在受控物项交叉', dataPassed: '风险预警清单' },
          { from: 'n-3', to: 'n-4', condition: '合规官签署通过', dataPassed: '正式整改行动计划' },
        ],
      },
      keyTriggerPoints: [
        '关键触发机制 1：涉案营业额突破申报标准强制触发节点2',
        '关键触发机制 2：高风险受限资产强制进入节点3人类签字审批',
      ],
      summaryContract: {
        overviewText: '已适配 L6 级完整 Agent/Workflow 架构，包含 4 个核心流转节点，已为各环节配置前置触发条件与后置成果移交机制。',
        riskWarnings: ['敏感企业股权需在本地沙箱脱敏隔离', '定期对标官方最新管制黑名单'],
        recommendedSandbox: 'ASI 专用金融与法务高密安全沙箱',
      },
      userConfirmed: false,
    }
  );

  if (!isOpen) return null;

  // Copy & Download helpers for Stage 3 Schema
  const handleCopySchema = () => {
    if (engineResult?.stage3.jsonSchema) {
      navigator.clipboard.writeText(JSON.stringify(engineResult.stage3.jsonSchema, null, 2));
      setSchemaCopied(true);
      setTimeout(() => setSchemaCopied(false), 2000);
    }
  };

  const handleDownloadSchema = () => {
    if (engineResult?.stage3.jsonSchema) {
      const blob = new Blob([JSON.stringify(engineResult.stage3.jsonSchema, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName || 'asi_project'}_schema.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Execute Step 1 -> Step 2 Parse via Intelligent Contract Parser Engine
  const handleProceedToIdentification = async () => {
    setIsParsing(true);
    setCurrentStep(2);

    let contentToAnalyze = '';
    if (importMethod === 'link') {
      contentToAnalyze = `GitHub 仓库: ${gitUrl}\nREADME.md\n包含完整的专业领域方法论与执行规范。`;
    } else if (importMethod === 'custom') {
      contentToAnalyze = `自然语言业务需求:\n目标: ${customGoal}\n输入材料: ${customInputs}\n专业角色: ${customRole}`;
    } else {
      contentToAnalyze = `上传本地文件清单:\n${uploadFiles.join('\n')}\n包含项目原生文件与方法论定义。`;
    }

    try {
      const result = await apiService.parseIntelligentContract({
        projectName: projectName || '智能专业工作流',
        inputType: importMethod,
        content: contentToAnalyze,
        fileList: uploadFiles,
        targetRole: customRole,
      });

      if (result) {
        setEngineResult(result);
        const st1 = result.stage1;
        const st2 = result.stage2;
        const st3 = result.stage3;

        setContract({
          id: `contract-${Date.now()}`,
          projectId: `proj-${Date.now()}`,
          createdAt: new Date().toISOString(),
          level: (st1.level as SkillLevel) || 'L3',
          levelConfidence: st1.confidence || 96,
          levelReason: st1.levelRationale || '智能契约解析引擎多阶段推理完成',
          entrypoint: st2.entrypoints[0]?.path || 'SKILL.md',
          sourceTag: st1.sourceTag || 'AI 推断',
          environment: {
            runtime: st2.discoveredRuntime.runtime || 'Universal Host Runtime',
            dependencies: st2.discoveredRuntime.dependencies || [],
            mcpServers: st2.discoveredRuntime.mcpServers || [],
            sandboxRequirements: st2.discoveredRuntime.sandboxRequirements || ['标准隔离沙箱'],
          },
          topology: st3.compiledContract?.topology || contract.topology,
          keyTriggerPoints: st3.compiledContract?.keyTriggerPoints || [
            '前置触发点: 输入源文件的 SHA-256 哈希校验与完整性预检',
            '分支激活点: 偏离度评分超过警戒阈值时自动分流至专项深挖节点',
            '终验卡点: 证据链不可篡改审计指纹生成与沙箱环境封存',
          ],
          summaryContract: st3.compiledContract?.summaryContract || {
            overviewText: '已由智能契约解析引擎自主编译生成标准流程契约。',
            riskWarnings: ['无外泄端口风险'],
            recommendedSandbox: 'ASI 强化安全隔离沙箱',
          },
          userConfirmed: false,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsing(false);
    }
  };

  // User manual correction of Level
  const handleModifyLevel = (newLevel: SkillLevel) => {
    setContract((prev) => ({
      ...prev,
      level: newLevel,
      sourceTag: '用户决定',
      levelReason: `用户手动校正为 ${newLevel} (${SKILL_LEVEL_DEFINITIONS[newLevel].title})`,
    }));
  };

  // Confirm Contract (方案 C) & Create / Launch Project
  const handleConfirmContract = () => {
    const confirmedContract: ExecutionContract = {
      ...contract,
      userConfirmed: true,
      confirmedAt: new Date().toISOString(),
    };

    if (contractToReview && onContractUpdated) {
      onContractUpdated(confirmedContract);
      onClose();
      return;
    }

    // Build Project Item
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: projectName || '未命名专业项目',
      category: ['L6', 'L8'].includes(confirmedContract.level) ? 'Agent' : 'Skill',
      level: confirmedContract.level,
      description: confirmedContract.summaryContract.overviewText,
      targetRole: customRole || '专业投资/法务管理',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'idle',
      currentStepIndex: 1,
      contract: confirmedContract,
      executionSteps: confirmedContract.topology.nodes.map((n, idx) => ({
        stepIndex: idx + 1,
        nodeId: n.id,
        nodeName: n.name,
        nodeType: n.type,
        status: 'pending',
        canRollback: false,
        requiresUserConfirmation: n.type === 'human_approval',
      })),
      deliverables: [],
    };

    onProjectCreated(newProject);
    onClose();
  };

  // Quick Preset Sample loader
  const handleLoadSample = (sampleType: 'm_a' | 'tender' | 'fin' | 'supply') => {
    if (sampleType === 'm_a') {
      setProjectName('跨国并购高敏感合规审查与反垄断规避 Agent (L6)');
      setGitUrl('https://github.com/agent-ecosystem/cross-border-merger-compliance');
      setCustomRole('跨境投资机构 / 涉外红圈法务合伙人');
      setUploadFiles(['agent_orchestrator.py', 'rules/ecmr.json', 'mcp/lexisnexis.json', 'SKILL.md']);
    } else if (sampleType === 'tender') {
      setProjectName('大型能源工程招投标技术偏离度与清标审查 Skill (L3)');
      setCustomRole('工程管理部总工 / 招投标采购审计师');
      setUploadFiles(['SKILL.md', 'scripts/calculate_deviation.py', 'templates/spec_matrix.xlsx']);
    } else if (sampleType === 'fin') {
      setProjectName('上市公司财务三表勾稽与粉饰造假筛查 Skill Pack (L2)');
      setCustomRole('投委会财务尽调总监 / 资深注册会计师');
      setUploadFiles(['主财务编排Skill.md', 'skills/cash_flow.md', 'skills/inventory.md', 'skills/capex.md']);
    } else {
      setProjectName('关键工业零部件全球供应链断供推演 Agent (L4)');
      setCustomRole('跨国制造业供应链总监 / 采购战略官');
      setUploadFiles(['mcp_agent_server.json', 'skill_chain.md', 'scripts/ais_fetch.js']);
    }
  };

  // Render recursive dependency tree nodes (Stage 2)
  const renderDependencyNode = (node: Stage2DependencyNode) => {
    const isExpanded = expandedDepNodes[node.id] ?? true;
    const hasChildren = Boolean(node.children && node.children.length > 0);

    return (
      <div key={node.id} className="ml-2 sm:ml-4 border-l-2 border-blue-500/30 pl-3 py-1 space-y-1">
        <div
          className={`flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg border transition-all ${
            theme === 'developer_black'
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-black/5 hover:border-blue-200 shadow-xs'
          }`}
        >
          <div className="flex items-center space-x-2">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => setExpandedDepNodes((prev) => ({ ...prev, [node.id]: !isExpanded }))}
                className="p-1 rounded hover:bg-black/5 opacity-70 hover:opacity-100 transition-colors"
                title={isExpanded ? '收起子依赖' : '展开子依赖'}
              >
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            ) : (
              <span className="w-4 h-4 flex items-center justify-center text-blue-500 text-[10px] font-mono">
                •
              </span>
            )}
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold uppercase">
              {node.type}
            </span>
            <span className="font-bold text-xs">{node.name}</span>
            <span className={`text-[10px] font-mono ${themeConfig.textMutedClass}`}>
              ({node.pathOrRef})
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono">
              {node.requiredRuntime}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-mono text-[9px]">
              深度: {node.depth}
            </span>
            <span className="text-emerald-600 font-bold font-mono">
              {node.confidence}%
            </span>
            <span className="px-1.5 py-0.5 rounded bg-black/5 text-[9px] font-mono">
              {node.sourceTag}
            </span>
          </div>
        </div>

        {node.purpose && (
          <p className={`text-[11px] pl-2 ${themeConfig.textMutedClass}`}>
            ↳ 用途说明: {node.purpose}
          </p>
        )}

        {hasChildren && isExpanded && (
          <div className="space-y-1 pt-1">
            {node.children!.map((child) => renderDependencyNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className={`border rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-colors ${themeConfig.modalBgClass}`}>
        {/* Modal Top Header */}
        <div className={`p-4 sm:px-6 border-b flex items-center justify-between ${themeConfig.modalHeaderClass}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center space-x-2">
                <span>{contractToReview ? '项目契约与架构拓扑检视' : '第2层：项目识别与配置 ★核心'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                  theme === 'developer_black'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {currentStep === 1 ? '第1步：项目导入' : '第2步：智能识别与运行契约'}
                </span>
              </h2>
              <p className={`text-[11px] ${themeConfig.textMutedClass}`}>
                面向专业人士，无需理解代码环境 · 底座自动识别 L1-L8 架构并建立运行契约
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* STEP 1: 3 种导入方式 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Presets Bar */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>一键载入典型专业工作者案例：</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleLoadSample('m_a')}
                    className="px-2.5 py-1 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30"
                  >
                    跨境收并购反垄断 (L6)
                  </button>
                  <button
                    onClick={() => handleLoadSample('tender')}
                    className="px-2.5 py-1 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30"
                  >
                    工程招投标清标 (L3)
                  </button>
                  <button
                    onClick={() => handleLoadSample('fin')}
                    className="px-2.5 py-1 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30"
                  >
                    财务三表勾稽 (L2)
                  </button>
                  <button
                    onClick={() => handleLoadSample('supply')}
                    className="px-2.5 py-1 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30"
                  >
                    全球供应链推演 (L4)
                  </button>
                </div>
              </div>

              {/* 3 种导入方式切换标签 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setImportMethod('link')}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    importMethod === 'link'
                      ? 'bg-blue-950/30 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">1. 网络链接</h4>
                      <p className="text-[10px] text-slate-400">GitHub / Git 仓库地址</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    输入 GitHub 或类似代码仓 URL，底座自动克隆并穿透结构识别。
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMethod('custom')}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    importMethod === 'custom'
                      ? 'bg-blue-950/30 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <PenTool className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">2. 用户自建</h4>
                      <p className="text-[10px] text-slate-400">自然语言引导式建立</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    专为管理/投资/法务人员设计，仅用业务语言描述目标与关键关卡。
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMethod('upload')}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    importMethod === 'upload'
                      ? 'bg-blue-950/30 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">3. 用户上传</h4>
                      <p className="text-[10px] text-slate-400">指定本地文件夹完整上传</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    完整上传包含 SKILL.md、Python脚本或 MCP 配置的本地文件夹包。
                  </p>
                </button>
              </div>

              {/* Form Input Detail based on method */}
              <div className="bg-slate-950/50 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    项目/工作流名称
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    placeholder="如：跨境收并购反垄断智能审查 Agent"
                  />
                </div>

                {importMethod === 'link' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Git 仓库 URL 地址
                    </label>
                    <input
                      type="text"
                      value={gitUrl}
                      onChange={(e) => setGitUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                      placeholder="https://github.com/organization/repo-name"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      支持标准 GitHub 仓库、GitLab 或包含 SKILL.md / Agent Framework 的公开地址。
                    </p>
                  </div>
                )}

                {importMethod === 'custom' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        您希望该智能体/Skill 达成的专业工作目标
                      </label>
                      <textarea
                        rows={2}
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                        placeholder="例如：对标两家公司的专利与技术规范书，筛查出潜在侵权点，并在涉及核心专利时要求法务负责人签字核准..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        您将输入的原材料与证据来源
                      </label>
                      <input
                        type="text"
                        value={customInputs}
                        onChange={(e) => setCustomInputs(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                        placeholder="例如：招投标响应文件.pdf、核心产品物料清单 (BOM)、审计后财务报表"
                      />
                    </div>
                  </div>
                )}

                {importMethod === 'upload' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-200">
                      已识别的本地文件夹结构与文件清单
                    </label>
                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg max-h-36 overflow-y-auto space-y-1">
                      {uploadFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                          <FileCode className="w-3.5 h-3.5 text-blue-400" />
                          <span>{file}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      底座将自动适配其中的 Python、Node、MCP 与 Shell 脚本，无需用户手动配置编译环境。
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    适用专业场景与决策角色
                  </label>
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    placeholder="例如：投资决策人员、涉外法务、工程管理负责人、财务总监"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: 项目识别与运行契约 (L1-L8 / 运行方式 / 触发与移交 / 运行契约) */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {isParsing ? (
                <div className="py-16 text-center space-y-3">
                  <div className="relative w-12 h-12 mx-auto">
                    <RefreshCw className="w-12 h-12 text-blue-400 animate-spin" />
                    <Sparkles className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h3 className="text-sm font-bold text-white">底座核心认知引擎正在深度解析项目...</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    正在执行：特征分类识别 (L1-L8) → 入口与拓扑构建 → 分支触发机制匹配 → 分支成果移交机制锁定 → 生成标准运行契约
                  </p>
                </div>
              ) : (
                <>
                  {/* 用户重点问题：底座识别与配置机制深度剖析（纯智能体认知编排 · 严格控制硬编码介入） */}
                  <div className={`rounded-xl p-4 border transition-all ${
                    theme === 'developer_black'
                      ? 'bg-slate-950/80 border-blue-500/40 text-slate-200'
                      : theme === 'soft_pink'
                      ? 'bg-rose-50/70 border-rose-300 text-rose-950 shadow-sm'
                      : 'bg-blue-50/60 border-blue-200 text-[#202124] shadow-sm'
                  }`}>
                    <div
                      className="flex items-center justify-between cursor-pointer select-none"
                      onClick={() => setShowMechanismPanel(!showMechanismPanel)}
                    >
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-blue-600" />
                        <h3 className="text-xs sm:text-sm font-bold flex items-center space-x-2">
                          <span>项目识别与配置机制剖析（纯智能体自适应认知 · 拒绝预设算法硬编码）</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white font-mono">
                            底座机制
                          </span>
                        </h3>
                      </div>
                      <button className="text-xs text-blue-600 flex items-center space-x-1 font-medium">
                        <span>{showMechanismPanel ? '收起机制解析' : '展开查看认知机制'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showMechanismPanel ? 'rotate-90' : ''}`} />
                      </button>
                    </div>

                    {showMechanismPanel && (
                      <div className="mt-3 pt-3 border-t border-black/5 space-y-2.5 text-xs">
                        <p className={`leading-relaxed ${themeConfig.textSecondaryClass}`}>
                          <strong>核心设计哲学：</strong>底座坚决<strong>不主动预设各种业务算法和死板硬编码</strong>，而是构建纯净的安全容器底座，由<strong>大模型智能体动态穿透理解并自适应配置</strong>：
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1 font-sans text-[11px]">
                          <div className={`p-2.5 rounded-lg border ${
                            theme === 'developer_black' ? 'bg-slate-900 border-slate-800' : 'bg-white border-black/5 shadow-sm'
                          }`}>
                            <div className="font-bold text-blue-600 mb-1">① 源码自述深度穿透</div>
                            <p className={`leading-snug ${themeConfig.textMutedClass}`}>
                              全量解析原项目自带的 SKILL.md、README、脚本及环境，按原作者设计逻辑理解，不强行重构。
                            </p>
                          </div>
                          <div className={`p-2.5 rounded-lg border ${
                            theme === 'developer_black' ? 'bg-slate-900 border-slate-800' : 'bg-white border-black/5 shadow-sm'
                          }`}>
                            <div className="font-bold text-indigo-600 mb-1">② 动态档位研判 (L1~L8)</div>
                            <p className={`leading-snug ${themeConfig.textMutedClass}`}>
                              AI 依据真实外挂组件（脚本/MCP/特定数据库/状态机）动态推断复杂度，给出置信度与推理依据。
                            </p>
                          </div>
                          <div className={`p-2.5 rounded-lg border ${
                            theme === 'developer_black' ? 'bg-slate-900 border-slate-800' : 'bg-white border-black/5 shadow-sm'
                          }`}>
                            <div className="font-bold text-teal-600 mb-1">③ 拓扑与数据流动态编排</div>
                            <p className={`leading-snug ${themeConfig.textMutedClass}`}>
                              由大模型推演出主入口、多级分支、节点顺序、流向与最终出口，避免任何静态硬编码。
                            </p>
                          </div>
                          <div className={`p-2.5 rounded-lg border ${
                            theme === 'developer_black' ? 'bg-slate-900 border-slate-800' : 'bg-white border-black/5 shadow-sm'
                          }`}>
                            <div className="font-bold text-amber-600 mb-1">④ 触发与移交机制锁定</div>
                            <p className={`leading-snug ${themeConfig.textMutedClass}`}>
                              明确各分支前置触发信号（材料满足/风险阻断），以及分支成果移交机制（交付格式与验收凭证）。
                            </p>
                          </div>
                          <div className={`p-2.5 rounded-lg border ${
                            theme === 'developer_black' ? 'bg-slate-900 border-slate-800' : 'bg-white border-black/5 shadow-sm'
                          }`}>
                            <div className="font-bold text-purple-600 mb-1">⑤ 运行契约方案 C 共识</div>
                            <p className={`leading-snug ${themeConfig.textMutedClass}`}>
                              将推导结果整合成可解释《运行契约》，标注来源与置信度，由专业人员确认后安全载入沙箱。
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 智能契约解析引擎：多阶段深度推理控制台 */}
                  <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                    theme === 'developer_black'
                      ? 'bg-slate-950 border-blue-500/30 text-slate-100 shadow-xl'
                      : theme === 'soft_pink'
                      ? 'bg-white border-rose-200 text-rose-950 shadow-md'
                      : 'bg-white border-[#dadce0] text-[#202124] shadow-md'
                  }`}>
                    {/* Engine Title & Stage Navigation Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/10 dark:border-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md ring-2 ring-blue-500/20">
                          <Cpu className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-sm sm:text-base">
                              智能契约解析引擎 · 多阶段深度推理全景看板
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-500/10 text-blue-600 border border-blue-500/20 font-semibold">
                              AI Native Zero-Hardcode
                            </span>
                          </div>
                          <p className={`text-[11px] ${themeConfig.textMutedClass}`}>
                            完全依据项目原生特征进行动态适配 · 严控硬编码与预设规则介入
                          </p>
                        </div>
                      </div>

                      {engineResult && (
                        <div className="flex items-center space-x-2 text-xs font-mono">
                          <span className="px-2 py-1 rounded bg-black/5 border border-black/10">
                            推理内核: <strong className="text-blue-600">{engineResult.reasoningModel}</strong>
                          </span>
                          <span className="px-2 py-1 rounded bg-black/5 border border-black/10">
                            解析耗时: <strong className="text-emerald-600">{engineResult.totalDurationMs}ms</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 3-Stage Progress / Switcher Tabs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Stage 1 Tab */}
                      <button
                        type="button"
                        onClick={() => setActiveEngineStage(1)}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          activeEngineStage === 1
                            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5'
                            : 'border-black/10 dark:border-slate-800 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                              1
                            </span>
                            <span>第一阶段：特征识别 (L1-LN)</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-blue-600">
                            {engineResult?.stage1.level || contract.level}
                          </span>
                        </div>
                        <p className={`text-[11px] ${themeConfig.textMutedClass} line-clamp-1`}>
                          原生形态穿透、开放能力分级、反向工作方法论涌现
                        </p>
                      </button>

                      {/* Stage 2 Tab */}
                      <button
                        type="button"
                        onClick={() => setActiveEngineStage(2)}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          activeEngineStage === 2
                            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5'
                            : 'border-black/10 dark:border-slate-800 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                              2
                            </span>
                            <span>第二阶段：递归依赖树分析</span>
                          </span>
                          <span className="text-[10px] font-mono text-indigo-600">
                            入口追踪
                          </span>
                        </div>
                        <p className={`text-[11px] ${themeConfig.textMutedClass} line-clamp-1`}>
                          基于主入口文件递归展开子调用、MCP工具与依赖沙箱
                        </p>
                      </button>

                      {/* Stage 3 Tab */}
                      <button
                        type="button"
                        onClick={() => setActiveEngineStage(3)}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          activeEngineStage === 3
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5'
                            : 'border-black/10 dark:border-slate-800 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs flex items-center space-x-1.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                              3
                            </span>
                            <span>第三阶段：结构化契约 (JSON Schema)</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600">
                            Schema 铸造
                          </span>
                        </div>
                        <p className={`text-[11px] ${themeConfig.textMutedClass} line-clamp-1`}>
                          标准 JSON Schema 规范、语义触发机制与防幻觉验真准则
                        </p>
                      </button>
                    </div>

                    {/* Stage 1 Content: 项目特征识别 (L1-LN) */}
                    {activeEngineStage === 1 && (
                      <div className="space-y-4 pt-1 animate-in fade-in">
                        {/* Level badges with LN dynamic support */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold flex items-center space-x-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                              <span>L1-LN 开放能力阶梯自适应判定 (支持用户手动校准)</span>
                            </span>
                            <span className="text-emerald-600 font-mono font-bold">
                              置信度: {contract.levelConfidence}% · 来源: {contract.sourceTag}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                            {(['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'LN'] as SkillLevel[]).map((lvl) => {
                              const isSelected = contract.level === lvl;
                              const title = lvl === 'LN' ? '开放演化集群' : SKILL_LEVEL_DEFINITIONS[lvl]?.title || lvl;
                              return (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => handleModifyLevel(lvl)}
                                  className={`p-2 rounded-xl border text-center transition-all ${
                                    isSelected
                                      ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-1 ring-blue-400 font-bold'
                                      : 'bg-black/5 hover:bg-black/10 border-black/10 dark:border-slate-800 opacity-80'
                                  }`}
                                >
                                  <div className="text-xs">{lvl}</div>
                                  <div className="text-[9px] truncate opacity-85">{title}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Rationale & Domain & Characteristics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-black/5 border border-black/10 dark:border-slate-800 space-y-2">
                            <div className="font-bold flex items-center justify-between">
                              <span className="text-blue-600">判定详尽逻辑与依据：</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 font-mono">
                                领域: {engineResult?.stage1.domain || customRole}
                              </span>
                            </div>
                            <p className="leading-relaxed text-[11px] opacity-90">
                              {engineResult?.stage1.levelRationale || contract.levelReason}
                            </p>
                            <div className="pt-2 border-t border-black/10 dark:border-slate-800 text-[11px]">
                              <strong className="text-indigo-600 block mb-1">AI 反向推导出的核心工作方法论：</strong>
                              <p className="opacity-85 leading-relaxed">
                                {engineResult?.stage1.coreMethodology || '深入穿透输入申报与对标标准，构建量化诊断矩阵，通过专家关键红线复核，并完成不可篡改防伪存证。'}
                              </p>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-black/5 border border-black/10 dark:border-slate-800 space-y-2.5">
                            <div className="font-bold text-teal-600">
                              项目原生特征标签与推演步骤 (Reasoning Trace)：
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {(engineResult?.stage1.characteristics || [
                                '双向分支任务自触发',
                                '成果物参数化移交',
                                '客观防幻觉验收关卡',
                                'SHA-256 审计存证',
                                '零硬编码语义绑定',
                              ]).map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 text-[10px] font-mono"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <div className="pt-2 border-t border-black/10 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 block font-mono">
                                阶段一思考链推演记录 (Chain-of-Thought):
                              </span>
                              {(engineResult?.stage1.reasoningTrace || [
                                '第 1 步: 读取工程根目录与文档语义，识别出核心专业工作者意图',
                                '第 2 步: 扫描依赖与接口定义，分析任务分支复杂度与工具交互模式',
                                '第 3 步: 综合推导出能力阶梯归属，生成零硬编码原生特征矩阵',
                              ]).map((step, sIdx) => (
                                <div key={sIdx} className="text-[11px] font-mono text-slate-400 flex items-start space-x-1.5">
                                  <span className="text-blue-500">›</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stage 2 Content: 递归分析依赖树 */}
                    {activeEngineStage === 2 && (
                      <div className="space-y-4 pt-1 animate-in fade-in">
                        {/* Entrypoint Header */}
                        <div className="p-3 rounded-xl bg-black/5 border border-black/10 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <GitFork className="w-4 h-4 text-indigo-600" />
                            <span className="font-bold">主入口文件锁定 (Entrypoint):</span>
                            <span className="font-mono px-2 py-0.5 rounded bg-blue-600/10 text-blue-600 font-semibold">
                              {engineResult?.stage2.entrypoints[0]?.path || contract.entrypoint}
                            </span>
                          </div>
                          <span className={`text-[11px] ${themeConfig.textMutedClass}`}>
                            {engineResult?.stage2.entrypoints[0]?.description || '主入口契约文件，负责统领整体执行逻辑与参数装载'}
                          </span>
                        </div>

                        {/* Interactive Recursive Dependency Tree */}
                        <div className="p-3 sm:p-4 rounded-xl border border-black/10 dark:border-slate-800 bg-black/5 space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs flex items-center space-x-1.5">
                              <Network className="w-4 h-4 text-blue-600" />
                              <span>调用关系与依赖递归展开树 (Interactive Recursive Tree)</span>
                            </span>
                            <span className={`text-[10px] font-mono ${themeConfig.textMutedClass}`}>
                              支持展开/折叠各子 Skill、计算脚本与 MCP 工具
                            </span>
                          </div>

                          {engineResult?.stage2.dependencyTree ? (
                            renderDependencyNode(engineResult.stage2.dependencyTree)
                          ) : (
                            <p className="text-xs opacity-75">暂无依赖树信息</p>
                          )}
                        </div>

                        {/* Recursive Trace Log & Discovered Runtime Profile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Recursive trace log */}
                          <div className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] border border-slate-800 space-y-1 max-h-48 overflow-y-auto">
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-800">
                              <span className="flex items-center space-x-1">
                                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                                <span>递归调用链追踪日志 (Recursive Trace)</span>
                              </span>
                              <span>LIVE TRACE</span>
                            </div>
                            {(engineResult?.stage2.recursiveTrace || [
                              '[递归深度 0] 锁定主执行入口: SKILL.md，完成顶层执行上下文建模',
                              '[递归深度 1] 展开第一层调用: 发现专业抽取子 Skill 与 MCP 外部合规检索端口',
                              '[递归深度 2] 递归分析抽取模块内部调用链: 探测到本地 Python 数据流处理脚本',
                              '[递归依赖验证] 依赖关系闭环无环死锁，已自动匹配沙箱资源配额',
                            ]).map((log, lIdx) => (
                              <div key={lIdx} className="leading-relaxed">
                                <span className="text-blue-400 mr-1.5">[{lIdx + 1}]</span>
                                <span>{log}</span>
                              </div>
                            ))}
                          </div>

                          {/* Discovered Runtime Profile */}
                          <div className="p-3 rounded-xl bg-black/5 border border-black/10 dark:border-slate-800 space-y-2">
                            <div className="font-bold text-xs text-indigo-600 flex items-center justify-between">
                              <span>自适应探测复合运行时与沙箱需求：</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 font-mono">
                                零预设推导
                              </span>
                            </div>

                            <div className="space-y-1 text-[11px]">
                              <div>
                                <span className="opacity-70">复合运行时:</span>{' '}
                                <strong className="font-mono text-blue-600">
                                  {engineResult?.stage2.discoveredRuntime.runtime || contract.environment.runtime}
                                </strong>
                              </div>
                              <div>
                                <span className="opacity-70">探测到的关键依赖:</span>{' '}
                                <span className="font-mono">
                                  {(engineResult?.stage2.discoveredRuntime.dependencies || contract.environment.dependencies).join(', ')}
                                </span>
                              </div>
                              <div>
                                <span className="opacity-70">MCP 外部服务:</span>{' '}
                                <span className="font-mono">
                                  {(engineResult?.stage2.discoveredRuntime.mcpServers || contract.environment.mcpServers).join(', ') || '无外部 MCP'}
                                </span>
                              </div>
                              <div>
                                <span className="opacity-70">沙箱安全边界:</span>{' '}
                                <span className="text-emerald-600">
                                  {(engineResult?.stage2.discoveredRuntime.sandboxRequirements || contract.environment.sandboxRequirements).join(' · ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stage 3 Content: 结构化契约生成 (JSON Schema 规范 + 完整契约) */}
                    {activeEngineStage === 3 && (
                      <div className="space-y-4 pt-1 animate-in fade-in">
                        {/* Sub Tab Navigation */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 dark:border-slate-800 pb-2">
                          <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-black/5 border border-black/10 text-xs">
                            <button
                              type="button"
                              onClick={() => setActiveSchemaTab('schema')}
                              className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition-all ${
                                activeSchemaTab === 'schema'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'opacity-70 hover:opacity-100'
                              }`}
                            >
                              <FileJson className="w-3.5 h-3.5" />
                              <span>JSON Schema 规范定义</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveSchemaTab('flow')}
                              className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition-all ${
                                activeSchemaTab === 'flow'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'opacity-70 hover:opacity-100'
                              }`}
                            >
                              <Workflow className="w-3.5 h-3.5" />
                              <span>工作流拓扑视图</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveSchemaTab('rules')}
                              className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition-all ${
                                activeSchemaTab === 'rules'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'opacity-70 hover:opacity-100'
                              }`}
                            >
                              <FileCheck2 className="w-3.5 h-3.5" />
                              <span>动态触发与成果移交规则</span>
                            </button>
                          </div>

                          {activeSchemaTab === 'schema' && (
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={handleCopySchema}
                                className="px-2.5 py-1 rounded-lg border border-black/10 text-xs flex items-center space-x-1 hover:bg-black/5 transition-colors"
                              >
                                {schemaCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{schemaCopied ? '已复制 Schema' : '复制 JSON Schema'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleDownloadSchema}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs flex items-center space-x-1 hover:bg-blue-500 transition-colors shadow-xs"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>下载 Schema .json</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* View 1: JSON Schema Code Box */}
                        {activeSchemaTab === 'schema' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold flex items-center space-x-1.5">
                                <Code2 className="w-4 h-4 text-emerald-600" />
                                <span>执行契约强类型约束规范 (符合 JSON Schema Draft-07 标准)</span>
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                严格定义 nodes, flows, triggers, deliverableTransfer 与 verificationPolicy
                              </span>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-xs max-h-72 overflow-y-auto overflow-x-auto">
                              <pre className="text-[11px] leading-relaxed">
                                {JSON.stringify(
                                  engineResult?.stage3.jsonSchema || {
                                    $schema: 'http://json-schema.org/draft-07/schema#',
                                    title: `${projectName} 契约规范`,
                                    type: 'object',
                                    required: ['contractId', 'version', 'workflowTopology', 'verificationPolicy'],
                                    properties: {
                                      contractId: { type: 'string' },
                                      workflowTopology: { type: 'object' },
                                      verificationPolicy: { type: 'object' },
                                    },
                                  },
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* View 2: Flowchart & Tree topology */}
                        {activeSchemaTab === 'flow' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs flex items-center space-x-1.5">
                                <Workflow className="w-4 h-4 text-indigo-600" />
                                <span>DAG 任务拓扑流转图</span>
                              </span>

                              <div className="flex items-center p-0.5 rounded-lg bg-black/5 border border-black/10 text-xs">
                                <button
                                  type="button"
                                  onClick={() => setActiveViewMode('flowchart')}
                                  className={`px-2.5 py-1 rounded font-medium flex items-center space-x-1 ${
                                    activeViewMode === 'flowchart' ? 'bg-blue-600 text-white' : 'opacity-70'
                                  }`}
                                >
                                  <span>流程图</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveViewMode('tree')}
                                  className={`px-2.5 py-1 rounded font-medium flex items-center space-x-1 ${
                                    activeViewMode === 'tree' ? 'bg-blue-600 text-white' : 'opacity-70'
                                  }`}
                                >
                                  <span>树形清单</span>
                                </button>
                              </div>
                            </div>

                            {activeViewMode === 'flowchart' ? (
                              <div className="p-4 rounded-xl border border-black/10 dark:border-slate-800 bg-black/5 overflow-x-auto">
                                <div className="flex items-center space-x-3 min-w-[700px] justify-between py-2">
                                  {contract.topology.nodes.map((node, nIdx) => (
                                    <React.Fragment key={node.id}>
                                      <div className={`flex-1 min-w-[150px] p-3 rounded-lg border shadow-sm ${
                                        theme === 'developer_black'
                                          ? 'bg-slate-900 border-slate-700'
                                          : 'bg-white border-black/10'
                                      }`}>
                                        <div className="flex items-center justify-between text-[10px] opacity-70 font-mono mb-1">
                                          <span>节点 {nIdx + 1}</span>
                                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 uppercase font-bold">
                                            {node.type}
                                          </span>
                                        </div>
                                        <h4 className="text-xs font-bold mb-1 leading-snug">{node.name}</h4>
                                        <p className="text-[10px] opacity-75 line-clamp-2">{node.description}</p>
                                        <div className="mt-2 pt-2 border-t border-black/5 space-y-0.5 text-[10px]">
                                          <div className="text-amber-600 truncate">触发: {node.triggerCondition}</div>
                                          <div className="text-emerald-600 truncate">移交: {node.deliverableTransfer}</div>
                                        </div>
                                      </div>

                                      {nIdx < contract.topology.nodes.length - 1 && (
                                        <div className="flex flex-col items-center flex-shrink-0 px-1 opacity-60">
                                          <ArrowRight className="w-5 h-5 text-blue-500" />
                                          <span className="text-[9px] font-mono max-w-[80px] text-center truncate">
                                            {contract.topology.flows[nIdx]?.dataPassed || '数据流转'}
                                          </span>
                                        </div>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 rounded-xl border border-black/10 dark:border-slate-800 bg-black/5 space-y-2">
                                {contract.topology.nodes.map((node, idx) => (
                                  <div
                                    key={node.id}
                                    className={`p-2.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                      theme === 'developer_black' ? 'bg-slate-900 border-slate-800' : 'bg-white border-black/5'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-[10px]">
                                        {idx + 1}
                                      </span>
                                      <div>
                                        <span className="font-semibold">{node.name}</span>
                                        <span className={`text-[11px] ml-1.5 font-mono ${themeConfig.textMutedClass}`}>
                                          ({node.roleOrTarget})
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-3 text-[11px]">
                                      <span className="text-amber-600">前置: {node.triggerCondition}</span>
                                      <span>→</span>
                                      <span className="text-emerald-600">移交: {node.deliverableTransfer}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* View 3: Trigger & Deliverable Rules List */}
                        {activeSchemaTab === 'rules' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {/* Triggers */}
                            <div className="p-3.5 rounded-xl border border-black/10 dark:border-slate-800 bg-black/5 space-y-2">
                              <div className="font-bold flex items-center space-x-1.5 text-amber-600">
                                <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-600 flex items-center justify-center text-[10px]">
                                  T
                                </span>
                                <span>动态前置触发判定机制 (Dynamic Pre-condition Triggers)</span>
                              </div>
                              <div className="space-y-2 pt-1">
                                {(engineResult?.stage3.triggerRulesSummary || contract.keyTriggerPoints.map((tp, idx) => ({
                                  nodeId: `node-${idx + 1}`,
                                  nodeName: `环节 ${idx + 1}`,
                                  triggerCondition: tp,
                                  rationale: '基于前置依赖与数据满足度动态触发',
                                }))).map((rule, rIdx) => (
                                  <div key={rIdx} className="p-2 rounded-lg bg-black/5 border border-black/5 space-y-1">
                                    <div className="font-semibold text-xs text-amber-700 dark:text-amber-400">
                                      {rule.nodeName}
                                    </div>
                                    <div className="text-[11px] leading-snug">
                                      <strong>触发条件:</strong> {rule.triggerCondition}
                                    </div>
                                    <div className={`text-[10px] ${themeConfig.textMutedClass}`}>
                                      逻辑依据: {rule.rationale}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Deliverable Transfer */}
                            <div className="p-3.5 rounded-xl border border-black/10 dark:border-slate-800 bg-black/5 space-y-2">
                              <div className="font-bold flex items-center space-x-1.5 text-emerald-600">
                                <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[10px]">
                                  D
                                </span>
                                <span>分支成果汇报移交与防幻觉准则 (Artifact Transfer)</span>
                              </div>
                              <div className="space-y-2 pt-1">
                                {(engineResult?.stage3.artifactTransferRulesSummary || [
                                  {
                                    fromNode: '解析节点',
                                    toNode: '计算节点',
                                    deliverableType: '结构化要素矩阵 (JSON)',
                                    verificationGate: '字段完整性与数据类型校验',
                                  },
                                  {
                                    fromNode: '计算节点',
                                    toNode: '审核关卡',
                                    deliverableType: '量化偏离清单 & 穿透底稿',
                                    verificationGate: '法规条文有效性与计算公式推演链',
                                  },
                                  {
                                    fromNode: '审核关卡',
                                    toNode: '成果区',
                                    deliverableType: '最终决策审计报告 (SHA-256 存证包)',
                                    verificationGate: '根哈希一致性与全流程防伪验真',
                                  },
                                ]).map((deliv, dIdx) => (
                                  <div key={dIdx} className="p-2 rounded-lg bg-black/5 border border-black/5 space-y-1">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                      <span className="text-emerald-700 dark:text-emerald-400">
                                        {deliv.fromNode} → {deliv.toNode}
                                      </span>
                                      <span className="text-[10px] font-mono opacity-80">{deliv.deliverableType}</span>
                                    </div>
                                    <div className={`text-[11px] ${themeConfig.textMutedClass}`}>
                                      <strong>验收准则:</strong> {deliv.verificationGate}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 5. 生成运行契约 (Execution Contract) + 方案 C 确认 */}
                  <div className="bg-gradient-to-br from-slate-950 to-blue-950/30 p-4 sm:p-5 rounded-xl border border-blue-500/40 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileCheck2 className="w-5 h-5 text-blue-400" />
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          生成运行契约 (Execution Contract) · 方案 C 确认
                        </h4>
                      </div>
                      <span className="text-[11px] text-blue-300 font-mono">
                        契约 ID: {contract.id}
                      </span>
                    </div>

                    {/* 精简版概览 (入口、分支数、依赖数、关键触发点) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">主入口</span>
                        <span className="text-white font-semibold truncate block">{contract.entrypoint}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">节点/分支总数</span>
                        <span className="text-cyan-400 font-semibold block">{contract.topology.nodes.length} 个节点</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">核心依赖库</span>
                        <span className="text-white font-semibold truncate block">{contract.environment.dependencies.join(', ')}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">推荐沙箱环境</span>
                        <span className="text-emerald-400 font-semibold truncate block">{contract.summaryContract.recommendedSandbox}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {contract.summaryContract.overviewText}
                    </p>

                    {/* 可展开逐项检查与编辑 */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => setContractDetailsExpanded(!contractDetailsExpanded)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                      >
                        <span>{contractDetailsExpanded ? '收起契约明细' : '展开逐项检查契约细则 (含来源标签与环境隔离条款)'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${contractDetailsExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      {contractDetailsExpanded && (
                        <div className="mt-3 p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs space-y-2">
                          <div className="text-slate-400">
                            <strong>沙箱环境隔离要求：</strong>
                            <ul className="list-disc list-inside text-slate-300 mt-1 space-y-0.5">
                              {contract.environment.sandboxRequirements.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-slate-400 pt-1">
                            <strong>风险预警与规避建议：</strong>
                            <ul className="list-disc list-inside text-amber-300 mt-1 space-y-0.5">
                              {contract.summaryContract.riskWarnings.map((w, i) => (
                                <li key={i}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:px-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70">
          {currentStep === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                取消
              </button>

              <button
                onClick={handleProceedToIdentification}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all active:scale-95"
              >
                <span>下一步：项目识别与生成契约</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                返回修改导入输入
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleProceedToIdentification}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>重新解析</span>
                </button>

                {/* 方案 C 核心操作按钮 */}
                <button
                  onClick={handleConfirmContract}
                  className="px-6 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>一键确认契约并载入底座</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
