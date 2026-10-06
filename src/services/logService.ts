import { LogEntry } from '../types';

const STORAGE_KEY = 'asi_execution_logs_v03';

export class LogService {
  private static instance: LogService;
  private logs: LogEntry[] = [];
  private listeners: Array<() => void> = [];

  private constructor() {
    this.loadFromStorage();
    if (this.logs.length === 0) {
      this.seedInitialLogs();
    }
  }

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load logs from storage', e);
      this.logs = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save logs to storage', e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public addLog(
    level: LogEntry['level'],
    message: string,
    details?: any,
    projectId?: string,
    projectName?: string
  ): LogEntry {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level,
      projectId,
      projectName,
      message,
      details,
    };
    this.logs.unshift(entry); // newest first
    this.saveToStorage();
    return entry;
  }

  public clearAll() {
    this.logs = [];
    this.saveToStorage();
  }

  public deleteLog(id: string) {
    this.logs = this.logs.filter((l) => l.id !== id);
    this.saveToStorage();
  }

  public clearByProject(projectId: string) {
    this.logs = this.logs.filter((l) => l.projectId !== projectId);
    this.saveToStorage();
  }

  // Export as formatted TXT (Dual-language headers & readable traces)
  public exportAsTxt(): string {
    const header = `================================================================================
ASI — Agent-Skill Intelligence 通用智能底座 审计与运行日志 (Audit & Execution Logs)
系统版本 (System Version): V0.3
导出时间 (Exported At): ${new Date().toLocaleString()}
记录总条数 (Total Records): ${this.logs.length}
核心原则 (Core Tenet): 不相信模型声称完成，验证它 (Never trust claims, verify with evidence)
================================================================================\n\n`;

    const body = this.logs
      .map((log) => {
        let detailsStr = '';
        if (log.details) {
          detailsStr = `\n    [DETAILS/详情]: ${typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}`;
        }
        return `[${log.timestamp}] [${log.level}] [PROJECT: ${log.projectName || log.projectId || 'SYSTEM/全局'}]
    ${log.message}${detailsStr}`;
      })
      .join('\n--------------------------------------------------------------------------------\n');

    return header + body;
  }

  // Export as structured JSON for AI and programmatic audit
  public exportAsJson(): string {
    return JSON.stringify(
      {
        system: 'ASI - Agent-Skill Intelligence',
        version: '0.3',
        exportedAt: new Date().toISOString(),
        totalEntries: this.logs.length,
        logs: this.logs,
      },
      null,
      2
    );
  }

  private seedInitialLogs() {
    const now = new Date();
    const t = (offsetSec: number) =>
      new Date(now.getTime() - offsetSec * 1000).toISOString().replace('T', ' ').substring(0, 19);

    this.logs = [
      {
        id: 'seed-01',
        timestamp: t(3600),
        level: 'INFO',
        message: 'ASI 底座核心引擎初始化成功 / ASI Core Engine Bootstrapped successfully.',
        details: { runtime: 'Node/Express + Vite', platform: 'Google AI Studio Ready', version: '0.3.0' },
      },
      {
        id: 'seed-02',
        timestamp: t(3400),
        level: 'CONTRACT',
        projectId: 'proj-crossborder-m-a',
        projectName: '跨境并购合规审查与反垄断规避 Agent',
        message: '项目特征识别完毕，签署运行契约 (Level: L6, 置信度 98%)。',
        details: { entrypoint: 'agent_orchestrator.py', nodesCount: 4, branchesCount: 2 },
      },
      {
        id: 'seed-03',
        timestamp: t(3000),
        level: 'EXECUTION',
        projectId: 'proj-crossborder-m-a',
        projectName: '跨境并购合规审查与反垄断规避 Agent',
        message: '节点【交易架构与多国司法管辖区前置扫描】执行完成，沙箱耗时 550ms。',
        details: { toolsCalled: ['extract_document_entities', 'query_jurisdiction_thresholds'], status: 'success' },
      },
      {
        id: 'seed-04',
        timestamp: t(2800),
        level: 'EVIDENCE',
        projectId: 'proj-crossborder-m-a',
        projectName: '跨境并购合规审查与反垄断规避 Agent',
        message: '成果物【全球反垄断强制申报管辖权判定矩阵表】生成并存证，证据链校验通过。',
        details: { evidenceHash: '9e7b23f81014a6dc412b189736e1892f39c812da82b0123c', verificationScore: 98 },
      },
      {
        id: 'seed-05',
        timestamp: t(2500),
        level: 'AUDIT',
        projectId: 'proj-crossborder-m-a',
        projectName: '跨境并购合规审查与反垄断规避 Agent',
        message: '关键重大风险阻断与合规方案审批：合规长完成人类签字审批 (Human Gatekeeper Sign-off)。',
        details: { approvalGranted: true, officer: 'Chief Compliance Officer' },
      },
      {
        id: 'seed-06',
        timestamp: t(2400),
        level: 'INFO',
        projectId: 'proj-crossborder-m-a',
        projectName: '跨境并购合规审查与反垄断规避 Agent',
        message: '综合合规意见书编制完成，生成全证据链 SHA-256 根哈希，封存入库。',
        details: { merkleRoot: '0x8f2c918a0928fca819273cba01947182937401928471' },
      },
    ];
    this.saveToStorage();
  }
}

export const logService = LogService.getInstance();
