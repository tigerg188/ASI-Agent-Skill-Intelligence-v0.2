export type SkillLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8' | 'LN' | string;

export interface SkillLevelInfo {
  level: SkillLevel;
  title: string;
  typicalCase: string;
  scenario: string;
  description: string;
}

export const SKILL_LEVEL_DEFINITIONS: Record<SkillLevel, SkillLevelInfo> = {
  L1: {
    level: 'L1',
    title: '单个 SKILL.md',
    typicalCase: '主要是 Prompt / 方法论',
    scenario: '测试用免费算力',
    description: '单文件规范，定义了专家推理逻辑、标准输入与期望产出格式。',
  },
  L2: {
    level: 'L2',
    title: 'Skill Pack 套件',
    typicalCase: '包含主 Skill + 多个子 Skill',
    scenario: '测试用免费算力',
    description: '多层级专业方法包，主 Skill 负责任务编排，子 Skill 处理专业垂直细分任务。',
  },
  L3: {
    level: 'L3',
    title: 'Skill + 自动化脚本',
    typicalCase: 'Skill + Python / Node / Shell 脚本',
    scenario: '测试用免费算力',
    description: '包含外挂脚本工具，实现复杂数学计算、公式推导或文档批处理。',
  },
  L4: {
    level: 'L4',
    title: 'Skill + MCP 外部程序',
    typicalCase: 'Skill + MCP + 浏览器 + 外部程序',
    scenario: '测试用免费算力',
    description: '通过模型上下文协议 (MCP) 驱动外部系统、网络浏览器、私有工具服务。',
  },
  L5: {
    level: 'L5',
    title: '特定运行环境与数据底座',
    typicalCase: 'Skill + 特定运行环境 + 数据库 + API',
    scenario: '本地化部署 / 产品交付 / 商用算力',
    description: '深度依赖外部企业数据库、专用向量底座或受管 API 权限。',
  },
  L6: {
    level: 'L6',
    title: '完整 Agent / Workflow 项目',
    typicalCase: '一个完整 Agent / Workflow 项目',
    scenario: '本地化部署 / 产品交付 / 商用算力',
    description: '具备自主状态机、记忆系统与复杂编排闭环的完整智能体工程。',
  },
  L7: {
    level: 'L7',
    title: '非标专业 GitHub 项目',
    typicalCase: 'GitHub 项目本身无标准 Skill 格式，但包含完整专业方法',
    scenario: '本地化部署 / 产品交付 / 商用算力',
    description: '底座通过语义与拓扑挖掘，自动萃取非标工程中的核心方法论并适配封装。',
  },
  L8: {
    level: 'L8',
    title: '复杂异构网状生态',
    typicalCase: 'Skill 与 Skill、Agent、Workflow、工具之间形成复杂关系',
    scenario: '本地化部署 / 产品交付 / 商用算力',
    description: '多 Agent、多 Skill 网状协同，具备动态触发、分布式汇总与多重验收机制。',
  },
};

export type NodeType = 'skill' | 'script' | 'mcp' | 'api' | 'human_approval' | 'aggregate';

export interface WorkflowNode {
  id: string;
  name: string;
  type: NodeType;
  roleOrTarget: string;
  description: string;
  triggerCondition: string; // 前置识别与触发机制
  inputs: string[];
  outputs: string[];
  deliverableTransfer: string; // 分支成果移交机制
  verificationCriteria: string; // 验收标准
  confidence: number;
  sourceTag?: '原项目' | 'AI 推断' | '用户决定';
}

export interface WorkflowFlow {
  from: string;
  to: string;
  condition?: string;
  dataPassed?: string;
}

export interface WorkflowTopology {
  entryNodeId: string;
  exitNodeId: string;
  nodes: WorkflowNode[];
  flows: WorkflowFlow[];
}

export interface ExecutionContract {
  id: string;
  projectId: string;
  createdAt: string;
  level: SkillLevel;
  levelConfidence: number;
  levelReason: string;
  entrypoint: string;
  sourceTag: '原项目' | 'AI 推断' | '用户决定';
  environment: {
    runtime: string;
    dependencies: string[];
    mcpServers: string[];
    sandboxRequirements: string[];
  };
  topology: WorkflowTopology;
  keyTriggerPoints: string[];
  summaryContract: {
    overviewText: string;
    riskWarnings: string[];
    recommendedSandbox: string;
  };
  userConfirmed: boolean;
  confirmedAt?: string;
}

export type ExecutionStatus = 'pending' | 'running' | 'waiting_approval' | 'paused' | 'completed' | 'failed';

export interface ToolCallRecord {
  tool: string;
  commandOrArgs: string;
  status: 'success' | 'failed' | 'running';
  latencyMs: number;
}

export interface EvidenceItem {
  item: string;
  status: 'VERIFIED' | 'CAUTION' | 'PENDING';
  source: string;
}

export interface Deliverable {
  id: string;
  projectId: string;
  nodeId: string;
  stepIndex: number;
  title: string;
  type: 'report' | 'table' | 'code' | 'schema' | 'verification_proof';
  summary: string;
  content: string;
  evidenceHash: string;
  evidenceChain: EvidenceItem[];
  verified: boolean;
  verificationScore: number;
  createdAt: string;
  auditDetails?: {
    auditedBy: string;
    antiHallucinationCheck: boolean;
    evidencePoints: string[];
  };
}

export interface ExecutionStepRecord {
  stepIndex: number; // 1, 2, 3...
  nodeId: string;
  nodeName: string;
  nodeType: NodeType;
  status: ExecutionStatus;
  startedAt?: string;
  completedAt?: string;
  thoughtProcess?: string; // 这一步为什么做、依据是什么
  toolCalls?: ToolCallRecord[];
  executionLog?: string;
  deliverableId?: string;
  deliverable?: Deliverable;
  interventionNote?: string; // 纠偏记录
  canRollback: boolean;
  requiresUserConfirmation: boolean;
  approvalGranted?: boolean;
}

export type ProjectCategory = 'Agent' | 'Skill';

export interface BusinessAttachment {
  id: string;
  name: string;
  size: number;
  type: 'pdf' | 'ppt' | 'word' | 'excel' | 'markdown' | 'txt' | 'image' | 'other';
  uploadedAt: string;
  contentSnippet?: string;
}

export interface BusinessJob {
  id: string;
  projectId: string; // 归属的 Agent 或 Skill 项目
  title: string; // 如：“锂电池全球产业研究”、“某跨国半导体收购案合规穿透”
  backgroundDescription: string; // 手动输入的文字背景与研究目标
  targetScope?: string; // 对标范围/特定约束
  attachments: BusinessAttachment[]; // PPT, PDF, word, excel, markdown, TXT, images
  status: 'draft' | 'ready_to_launch' | 'researching' | 'completed' | 'failed';
  createdAt: string;
  launchedAt?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  category: ProjectCategory;
  level: SkillLevel;
  description: string;
  targetRole: string; // 适用场景角色：企业管理、法律合规、投资尽调、工程管理等
  systemPrompt?: string; // 核心 Prompt / 指令方法论
  createdAt: string;
  updatedAt: string;
  contract: ExecutionContract;
  executionSteps: ExecutionStepRecord[];
  deliverables: Deliverable[];
  status: 'idle' | 'running' | 'paused' | 'completed';
  currentStepIndex: number;
  businessJobs?: BusinessJob[]; // 单项业务清单
  activeJobId?: string; // 当前激活或正在运行的单项业务
  lastBreakpoint?: {
    stepIndex: number;
    savedAt: string;
    snapshotData: any;
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'CONTRACT' | 'EXECUTION' | 'EVIDENCE' | 'AUDIT' | 'WARNING' | 'ERROR';
  projectId?: string;
  projectName?: string;
  message: string;
  details?: any;
}

// 免费模型配额与调用看板分桶定义 (依据截图精确复现)
export interface ModelQuotaBucket {
  id: string; // 'flash_latest' | '3_1_flash_lite' | '3_flash_preview' | '3_8_flash'
  name: string; // 'Flash Latest', '3.1 Flash Lite', '3 Flash Preview', '3.8 Flash'
  modelIdentifier: string; // 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-3.8-flash'
  tag: string; // '最强交互/设计' | '极速轻量' | '高吞吐批处理' | '超长上下文'
  status: 'normal' | 'exhausted' | 'cooling_down'; // '正常通畅' | '已达上限'
  tokensUsed: number;
  tokensLimit: number; // 4,000,000
  callsUsed: number;
  callsLimit: number; // 1500 RPD
  priority: number;
  isTopTier: boolean; // 最强模型主要使用在用户于你交互、代码设计和修改上
}

export interface ModelQuotaDashboardState {
  currentChannelId: string; // 当前通道：如 'flash_latest'
  autoSwitchOnLimit: boolean; // 设置当前使用模型限额封顶后自动切换模型机制
  totalDayTokensUsed: number;
  totalDayTokensLimit: number; // 4,000,000
  totalDayCallsUsed: number;
  totalDayCallsLimit: number; // 1500
  batchModeSavingPercent: number; // 50%
  resetCountdownHours: number; // 23
  resetCountdownMinutes: number; // 36
  buckets: Record<string, ModelQuotaBucket>;
}

export interface AgentConfig {
  mode: 'google_ai_studio_native' | 'openai_compatible';
  googleModel: string;
  openaiBaseUrl: string;
  openaiApiKey: string;
  openaiModel: string;
  status: 'active' | 'configuring';
  totalCalls: number;
  totalTokens: number;
  quotaDashboard?: ModelQuotaDashboardState;
}

export type AppTheme = 'developer_black' | 'office_gray' | 'soft_pink';

export interface SystemSettings {
  theme: AppTheme; // 'developer_black' | 'office_gray' | 'soft_pink'
  sandboxIsolation: 'strict' | 'standard' | 'relaxed';
  verificationLevel: 'financial_grade' | 'standard' | 'relaxed';
  autoBreakpointIntervalSec: number;
  persistentLogDays: number;
  telemetryDisabled: boolean;
}

// 智能契约解析引擎：多阶段推理类型定义
export interface Stage1FeatureRecognition {
  level: SkillLevel; // L1 - LN 动态级别
  levelName: string;
  levelRationale: string; // 判定详尽逻辑依据
  domain: string; // 专业领域：投资、法务、工程、财务、战略等
  coreMethodology: string; // 核心工作方法论与专家推演模型
  characteristics: string[]; // 项目原生特征标签
  confidence: number; // 0-100%
  sourceTag: '原项目' | 'AI 推断' | '用户决定';
  reasoningTrace: string[]; // 阶段一思考链步骤
}

export interface Stage2DependencyNode {
  id: string;
  name: string;
  type: 'entrypoint' | 'sub_skill' | 'script' | 'mcp_tool' | 'api_endpoint' | 'database' | 'native_lib';
  pathOrRef: string;
  purpose: string;
  requiredRuntime: string; // 如 Python 3.11, Node 20, MCP stdio
  depth: number;
  sourceTag: '原项目' | 'AI 推断' | '用户决定';
  confidence: number;
  children?: Stage2DependencyNode[];
}

export interface Stage2DependencyAnalysis {
  entrypoints: Array<{
    path: string;
    type: 'file' | 'prompt_doc' | 'instruction_entry';
    description: string;
  }>;
  dependencyTree: Stage2DependencyNode;
  recursiveTrace: string[]; // 递归解析调用链日志
  discoveredRuntime: {
    runtime: string;
    dependencies: string[];
    mcpServers: string[];
    systemPermissions: string[];
    sandboxRequirements: string[];
  };
  confidence: number;
}

export interface Stage3ContractSchema {
  jsonSchema: Record<string, any>; // 遵循 JSON Schema Draft-07 / 2020-12 的标准契约定义
  compiledContract: ExecutionContract;
  triggerRulesSummary: Array<{
    nodeId: string;
    nodeName: string;
    triggerCondition: string;
    rationale: string;
  }>;
  artifactTransferRulesSummary: Array<{
    fromNode: string;
    toNode: string;
    deliverableType: string;
    verificationGate: string;
  }>;
  confidence: number;
}

export interface IntelligentContractEngineResult {
  projectName: string;
  sourceMode: string;
  stage1: Stage1FeatureRecognition;
  stage2: Stage2DependencyAnalysis;
  stage3: Stage3ContractSchema;
  totalDurationMs: number;
  reasoningModel: string;
  completedAt: string;
}

