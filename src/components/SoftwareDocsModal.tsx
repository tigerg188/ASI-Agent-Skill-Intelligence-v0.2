import React, { useState } from 'react';
import {
  X,
  BookOpen,
  FileText,
  Copy,
  Check,
  Download,
  Layers,
  Code2,
  FolderTree,
  Terminal,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext';

interface SoftwareDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoftwareDocsModal: React.FC<SoftwareDocsModalProps> = ({ isOpen, onClose }) => {
  const { theme, themeConfig } = useTheme();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');

  if (!isOpen) return null;

  const docMarkdown = `# 《Agent-Skill 通用智能底座》 软件技术说明书 (README)
**项目代号**: ASI — Agent-Skill Intelligence
**系统版本**: V0.3 (面向个人专业工作者的通用 Skill 识别、适配、执行与验证智能底座)
**核心哲学**:
1. 不改变外部 Skill，理解它 (Understand external skills)
2. 不规定 Skill 环境，适配它 (Adapt Python, Node, MCP, Shell runtimes)
3. 不相信模型声称完成，验证它 (Never trust raw claims without evidence)
4. 不绑定模型厂商，替换它 (Reasoning engine is replaceable)

---

## 一、系统设计初衷
当前 Agent / Skill 生态正在快速爆发，但存在严重割裂与脱节：
- **认得 Skill，不一定懂 Skill**：多层级 Skill Pack 中的主从关系被粗暴割裂为孤立项目；
- **能加载 Skill，不一定能按逻辑执行**：缺乏对输入、分支触发机制、输出移交机制的深度建模；
- **能执行，不一定知道是否真完成**：大模型往往幻觉宣称“已完成”，缺乏真实工具调用记录、客观数据比对与防伪证据链。

**ASI 的核心定位**：
不是再造一个 Agent，而是建立位于“任意外部 Skill 项目”与“成熟 Agent Harness”之间的通用智能适配层。
让企业管理者、投资决策人、工程总工、合规法务等专业人士，只需导入项目，系统便会自动识别档位 (L1-L8)、生成运行契约、准备隔离沙箱、执行每一步并交出具有不可篡改哈希 (SHA-256) 的专业成果。

---

## 二、全栈技术方案
- **前端架构**: React 19 + TypeScript + Tailwind CSS (现代化极速 SPA 界面)
- **后端架构**: Express + Node.js (提供安全代理路由，严禁密钥下发到前端浏览器)
- **大模型接入**: Google AI Studio 原生 @google/genai SDK (gemini-3.8-flash) + 通用 OpenAI 兼容协议
- **拓扑编译器**: 自动构建有向无环图 (DAG) 拓扑、前置触发条件解析器、后置成果移交调度器
- **运行沙箱**: 隔离环境模拟器与安全容器协议，提供内存保护、断点快照与状态机回滚
- **防幻觉验真**: 基于 Evidence Claims 与 SHA-256 根哈希的客观验证系统

---

## 三、代码结构与文件目录树
\`\`\`text
asi-agent-skill-intelligence/
├── metadata.json                 # 应用元数据 (配置服务端 Gemini API 权限)
├── server.ts                     # Full-stack 服务端 (Express + Vite 中间件 + AI 代理)
├── package.json                  # 项目依赖与启动脚本
├── index.html                    # HTML 入口
├── src/
│   ├── main.tsx                  # React 客户端启动入口
│   ├── App.tsx                   # 顶层布局容器与 3 层状态管理器
│   ├── index.css                 # 全局样式与 Tailwind
│   ├── types/
│   │   └── index.ts              # L1-L8、契约、拓扑、证据链核心 TypeScript 类型定义
│   ├── data/
│   │   └── mockTemplates.ts      # 预置高水准专业场景 (并购合规、招投标偏离、财报造假、供应链MCP)
│   ├── services/
│   │   ├── apiService.ts         # 底座核心 API、Token与调用统计、断点管理
│   │   └── logService.ts         # 全生命周期无死角运行日志 (支持 TXT / JSON 双格式持久化)
│   └── components/
│       ├── Header.tsx            # 顶部导航、状态指标条 (智能体状态、调用量、Token量)
│       ├── ProjectManager.tsx    # 第1层：项目管理区 (Agent 与 Skill 折叠弹出面板)
│       ├── ExecutionZone.tsx     # 第1层/第3层：项目运行区 (纵向大序号时间轴、决策证据、断点续传)
│       ├── ExecutionDeliverables.tsx # 第1层：项目执行成果区 (成果卡片、验真评分、SHA256哈希)
│       ├── ProjectImportModal.tsx    # 第2层：项目识别与配置 (3种导入、L1-L8判定、双视图、方案C契约)
│       ├── AgentConfigModal.tsx  # 智能体配置 (Google AI Studio 自适应 / OpenAI API)
│       ├── SoftwareDocsModal.tsx # 软件说明 README 与二次开发指南
│       ├── SettingsModal.tsx     # 底座沙箱与审计严格度配置
│       ├── LogsModal.tsx         # 全流程无死角运行日志检视器 (双语/TXT/JSON导出)
│       ├── InterventionModal.tsx # 步骤纠偏与人工干预弹窗
│       └── DeliverableDetailModal.tsx # 成果物全屏检视与证据链溯源抽屉
\`\`\`

---

## 四、软件特征与能力阶梯 (L1-L8)
1. **L1 单个 SKILL.md**: Prompt / 方法论规范解析。
2. **L2 Skill Pack**: 主 Skill 与多个子 Skill 层次协同，不割裂。
3. **L3 脚本套件**: Skill + Python / Node / Shell 本地计算与数据抽取。
4. **L4 MCP 外部程序**: Skill + MCP + 浏览器沙箱 + 真实外部 API。
5. **L5 特定运行环境**: 专用数据库与企业数据底座适配。
6. **L6 完整 Agent/Workflow**: 自主状态机与复杂长流程。
7. **L7 GitHub 原生工程**: 自动挖掘非标代码库中的专业方法论。
8. **L8 复杂网状协同**: 多 Agent、多 Skill 网状协同与联合汇总。

---

## 五、目标用户画像与使用场景
- **企业管理者 / 战略顾问**: 研判跨国并购、重组方案中的反垄断与长臂管辖风险。
- **投资决策人员 / 尽调团队**: 穿透上市公司财务三表造假、Beneish 模型分析、存货资金体外循环。
- **工程管理人员 / 采购招标总工**: 自动化比对数百页标书的技术偏离度，杜绝废标红线漏网。
- **供应链与跨国贸易主管**: 连通卫星船舶与航运数据，模拟海峡封锁下的断供倒计时与替代备件寻源。

---

## 六、本地部署与平台适配条件
- **平台适配**: 完全适配 Google AI Studio Build 运行时，自动注入 GEMINI_API_KEY。
- **本地部署**:
  \`\`\`bash
  git clone <repository_url>
  cd asi-platform
  npm install
  npm run dev # 启动全栈服务器 (http://localhost:3000)
  \`\`\`
- **生产构建**:
  \`\`\`bash
  npm run build
  npm start
  \`\`\`

---

## 七、“项目导入”之后的“项目识别与配置”AI 机制详解 (核心设计理念)

系统坚决贯彻任务书第 2 节与核心产品哲学：**“打造能够智能识别和运行 Agent 或 Skill 项目的容器和底座，不主动预设各种算法和硬编码，交给每一个 Skill 自行决定或使用该 Skill 根据自身需求预设的环境、依赖、库”**。

传统平台常犯的错误，是用几条硬编码正则匹配（如查找 requirements.txt 或 package.json）生硬判定项目，一旦遇到非标的 L2/L4/L7/L8 项目便宣告瘫痪。ASI 底座在“项目导入”后，完全由 **AI 智能体认知编排引擎 (LLM Cognitive Orchestrator)** 深度介入，其底层运行以下五个逻辑机制：

### 1. 语义反向抽象与开发者意图涌现 (Semantic Reverse-Engineering)
- **非硬编码模式**: AI 智能体并不依赖特定关键字，而是通读项目代码、提示词、文档注释、输入输出接口与上下文依赖关系。
- **意图重构**: 自行理解原作者“究竟试图解决什么专业问题”、“方法论的底层推演路径是什么”。

### 2. 运行时自适应发现与非预设依赖解构 (Zero-Preset Probing)
- **环境免预设**: 不预设固定容器模板。AI 智能体自主推断项目所需运行时（Python 3.11、Node.js 20、MCP Server、Chrome Headless、PostgreSQL 等）。
- **来源置信度标定**: 为每个依赖打上标签（原项目自带 / AI自主推断 / 需用户决策），并标注置信度百分比（0-100%）。

### 3. 动态 DAG 拓扑与前置触发机制生成 (Dynamic DAG & Pre-condition Synthesis)
- **多层级拓扑重构**: AI 智能体动态识别主入口、分支任务、二级/三级递归节点与最终出口。
- **触发机制语义绑定**: 为每个节点制定严格的“前置触发条件”（例如：“当上一环节反洗钱筛查风险分 > 75 时激活分支”、“当标书技术偏离度解析完成且无致命格式破损时触发比对”），杜绝硬编码死条件。

### 4. 分支成果移交机制与防幻觉验真准则 (Artifact Transfer & Evidence Grounding)
- **明确移交链路**: AI 为每个节点生成明确的《成果移交契约》——包括数据载体（结构化JSON、对比表格、法律备忘录）、由谁承接、由谁终审。
- **不相信模型口头声称完成**: 必须为每个节点生成可客观查验的验收标准（Verification Criteria），并绑定 SHA-256 证据指纹。

### 5. 人机协同“方案 C 运行契约”确认 (Human-Agent Contract Plan C)
- 识别完成后，系统将 AI 智能体推理出的一切配置以结构化契约呈现给专业用户。
- 用户可在“方案 C”中直接审阅、勾选或修正 AI 推断项，确认后才交由底座沙箱加载执行，实现安全与弹性的完美平衡。

---

## 八、“项目管理”模块与“单项业务”工作台详解 (核心业务层设计)

系统在顶部导航栏“项目导入”右后侧正式上线**「项目管理」**控制中心，对已经导入的 Agent 与 Skill 项目提供全局维度的生命周期管控，并确立“底座工程 - 单项业务研究”的两层业务模型：

### 1. 统一项目管理核心矩阵
- **项目重置 (Project Reset)**: 清理运行缓存、重置节点状态机为 pending、清空临时成果与执行日志，恢复项目至纯净待命状态；
- **项目删除 (Project Deletion)**: 具备安全防误触确认机制，从底座与本地存储安全注销不再使用的项目包；
- **项目名称与提示词修改 (Project Name & Prompt Customization)**: 允许用户根据企业实际需求，动态修改项目名称、角色定位、业务描述及核心系统提示词指令方法论（支持插入 \`{{BUSINESS_INPUT}}\` 与 \`{{MATERIALS}}\` 动态参数插槽）；
- **完整项目包导出与恢复 (Export & Import Bundle)**: 完整打包项目的元数据、第2层运行契约、拓扑节点、提示词规范、单项业务及所有防伪证据成果为标准 \`.json\` 文件，支持跨环境一键恢复。

### 2. 单项业务创建与资料上传机制 (以“锂电池全球产业研究”为例)
- **业务概念边界**: “项目”是指 Agent 或 Skill 底座工程，具备通用的方法论和拓扑能力；“单项业务”则是该项目在具体场景下的实际落地研究任务（例如：在“全球新能源与硬科技产业研究 Agent”下新建**“锂电池全球产业研究”**）；
- **双重输入通道**:
  1. **手动输入文字**: 详尽录入业务研究背景、决策诉求、对标范围与关键限制条件；
  2. **本地上传各类文档与图片**: 支持包括但不限于 **PPT (.ppt, .pptx)、PDF (.pdf)、Word (.doc, .docx)、Excel (.xls, .xlsx)、Markdown (.md)、TXT (.txt) 等各类文档或图片 (.png, .jpg, .webp)**；
- **启动业务前置准则**: 只有在单项业务建立了明确的目标输入并挂载真实资料后，用户才正式触发“启动流水线”，底座智能体引擎将自动把业务背景和资料摘要注入推演上下文，确保输出高置信度产业交付成果。

---

## 九、升级历史与版本日志
- **V0.1**: 提出底座概念，实现单文件 Skill 静态解析。
- **V0.2**: 引入沙箱工具与流程图 DAG 拓扑呈现。
- **V0.3**:
  - 提供多主题外观（程序员纯黑 / 办公浅灰 / 女性柔和粉红），默认 Google 网页标准浅灰色；
  - 确立“第1层总览、第2层识别配置、第3层时间轴运行”三层规范交互体系；
  - 增加方案 C 运行契约机制 (支持来源标签 [原项目/AI推断/用户决定] 与置信度百分比)；
  - 增加全流程无死角运行日志持久化 (支持 TXT / JSON 双格式导出供 AI 大模型随时查验)；
  - 增加执行断点快照与断点续传机制，确保网络波动或意外中断时无缝恢复；
  - 强化防幻觉验真体系与 SHA-256 审计根哈希电子存证。
- **V0.4 (当前版本)**:
  - 在“项目导入”右侧新增“项目管理”控制台；
  - 完善项目重置、项目删除、名称与系统提示词修改、完整项目包导出与导入；
  - 确立 Agent/Skill 项目下挂载单项业务的功能（如“锂电池全球产业研究”）；
  - 支持手动输入文字与本地上传 PPT、PDF、Word、Excel、Markdown、TXT 等格式文档及图片；
  - 在项目运行区深度挂载单项业务与资料凭证，未挂载前给予友好引导与一键新建。
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(docMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([docMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ASI_Agent_Skill_Intelligence_README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className={`border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ${themeConfig.modalBgClass}`}>
        {/* Header */}
        <div className={`p-4 sm:px-6 border-b flex items-center justify-between ${themeConfig.modalHeaderClass}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">
                软件技术说明书 (README.md)
              </h2>
              <p className={`text-[11px] ${themeConfig.textMutedClass}`}>
                ASI V0.3 · 全栈技术方案、文件目录树、能力阶梯与开发者二次开发指南
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`flex items-center p-0.5 rounded-lg border ${
              theme === 'developer_black' ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'
            }`}>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'preview' ? 'bg-blue-600 text-white' : 'opacity-70 hover:opacity-100'
                }`}
              >
                排版预览
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'raw' ? 'bg-blue-600 text-white' : 'opacity-70 hover:opacity-100'
                }`}
              >
                Markdown 原文
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="复制 Markdown"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="下载 README.md"
            >
              <Download className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-slate-200">
          {activeTab === 'raw' ? (
            <pre className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed">
              {docMarkdown}
            </pre>
          ) : (
            <div className="space-y-6 text-xs sm:text-sm leading-relaxed max-w-none prose prose-invert">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>ASI 四大核心产品哲学</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-0.5">1. 不改变外部 Skill，理解它</strong>
                    <span className="text-slate-400 text-[11px]">不强求重写成特定格式，深度穿透原作者逻辑。</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-0.5">2. 不规定 Skill 环境，适配它</strong>
                    <span className="text-slate-400 text-[11px]">Python、Node、MCP、Browser、Shell、API 全适配。</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-0.5">3. 不相信模型声称完成，验证它</strong>
                    <span className="text-slate-400 text-[11px]">绝不听信空头报告，必须有工具记录、产出物与 SHA256 哈希。</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-0.5">4. 不绑定模型厂商，替换它</strong>
                    <span className="text-slate-400 text-[11px]">模型是推理发动机，底座是承载架构，随时解耦。</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FolderTree className="w-4 h-4 text-emerald-400" />
                  <span>工程目录全景树</span>
                </h3>
                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`asi-agent-skill-intelligence/
├── metadata.json                 # 应用元数据 (服务端 Gemini API 权限)
├── server.ts                     # Full-stack 服务端 (Express + Vite + AI 代理)
├── src/
│   ├── types/index.ts            # L1-L8 档位、契约、拓扑、证据链类型
│   ├── services/
│   │   ├── apiService.ts         # 底座服务、Token统计与断点续传
│   │   └── logService.ts         # 全流程持久化日志 (TXT+JSON 双语导出)
│   └── components/               # 第1、2、3层界面核心组件群`}
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>版本发布说明 (V0.3)</span>
                </h3>
                <p className="text-slate-300 text-xs">
                  V0.3 重点完成了《任务书》所要求的<strong>“第2层项目识别与方案C运行契约”</strong>，建立了
                  <strong>“左侧大序号时间轴、中途暂停、断点续传、步骤回滚、人类确认”</strong>等完备运行区体系，并在成果区提供可独立存放与查验的防伪审计证据单。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-800 flex items-center justify-between bg-slate-950/70 text-xs text-slate-400">
          <span>ASI Architecture Team · 遵循 Apache-2.0 开源许可协议</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            关闭说明
          </button>
        </div>
      </div>
    </div>
  );
};
