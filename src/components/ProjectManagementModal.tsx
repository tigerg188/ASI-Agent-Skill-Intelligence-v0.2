import React, { useState, useRef } from 'react';
import {
  X,
  FolderKanban,
  Bot,
  Sparkles,
  PlusCircle,
  FileCheck2,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  Edit3,
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Presentation,
  CheckCircle2,
  Clock,
  PlayCircle,
  Search,
  Sliders,
  Layers,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Paperclip,
  Check,
  Cpu,
  BookOpen,
} from 'lucide-react';
import {
  BusinessAttachment,
  BusinessJob,
  ProjectCategory,
  ProjectItem,
  SkillLevel,
} from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { logService } from '../services/logService';

interface ProjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onUpdateProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  onResetProject: (id: string) => void;
  onImportProjectPackage: (project: ProjectItem) => void;
  onOpenImportModal: () => void;
  onOpenContract: (project: ProjectItem) => void;
  onLaunchBusinessResearch: (projectId: string, jobId: string) => void;
}

export const ProjectManagementModal: React.FC<ProjectManagementModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onUpdateProject,
  onDeleteProject,
  onResetProject,
  onImportProjectPackage,
  onOpenImportModal,
  onOpenContract,
  onLaunchBusinessResearch,
}) => {
  const { theme, themeConfig } = useTheme();

  // Tabs: 'projects' | 'business' | 'prompt_edit' | 'export_import'
  const [activeTab, setActiveTab] = useState<'projects' | 'business' | 'prompt_edit' | 'export_import'>('business');
  
  // Selected project for deep inspection/edit inside this modal
  const [selectedProjId, setSelectedProjId] = useState<string>(activeProjectId || projects[0]?.id || '');
  
  // Filter for projects list
  const [filterCategory, setFilterCategory] = useState<'all' | 'Agent' | 'Skill'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state for Project Name & System Prompt
  const currentProject = projects.find((p) => p.id === selectedProjId) || projects[0];

  const [editName, setEditName] = useState(currentProject?.name || '');
  const [editCategory, setEditCategory] = useState<ProjectCategory>(currentProject?.category || 'Agent');
  const [editRole, setEditRole] = useState(currentProject?.targetRole || '');
  const [editDescription, setEditDescription] = useState(currentProject?.description || '');
  const [editSystemPrompt, setEditSystemPrompt] = useState(currentProject?.systemPrompt || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // New Business Job Form State
  const [newJobTitle, setNewJobTitle] = useState('锂电池全球产业研究');
  const [newJobBackground, setNewJobBackground] = useState(
    '针对全球动力及储能锂电池全产业链（包括上游锂矿/碳酸锂提炼、中游正负极材料/隔膜/电解液/电芯封装，以及下游新能源汽车和特种储能电站）进行深度竞争格局与供应链穿透研究，评估全球产能利用率周期、固态电池技术路线演进、欧美通胀削减法案(IRA)与新电池法规壁垒。'
  );
  const [newJobScope, setNewJobScope] = useState('全球 Top 10 动力电池厂商（宁德时代、比亚迪、LG新能源、中创新航、松下等）及核心材料供应商');
  const [newJobAttachments, setNewJobAttachments] = useState<BusinessAttachment[]>([
    {
      id: 'att-1',
      name: '锂电池全球产能规划与出海壁垒研判.pptx',
      size: 25690112,
      type: 'ppt',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      contentSnippet: '包含全球五大动力电池制造基地扩产节奏、地缘关税壁垒测算及海外本地化建厂CAPEX对标数据。',
    },
    {
      id: 'att-2',
      name: '2026年全球动力电池装车量与供应链穿透报告.pdf',
      size: 19084000,
      type: 'pdf',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      contentSnippet: '权威第三方产业统计，涵盖磷酸铁锂与三元锂电池市占率推演、车企定点供应链结构及长单锁定比例。',
    },
    {
      id: 'att-3',
      name: '全球主要锂电池厂商成本模型与BOM拆解表.xlsx',
      size: 7130316,
      type: 'excel',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      contentSnippet: '单Wh成本拆解：碳酸锂价格敏感性分析、正极材料占比、结构件与隔膜降本曲线模型。',
    },
    {
      id: 'att-4',
      name: '全固态与半固态电池关键材料专利演进清单.docx',
      size: 9542000,
      type: 'word',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      contentSnippet: '硫化物、氧化物及聚合物三大固态电解质技术路径主流专利申请趋势与核心壁垒分析。',
    },
    {
      id: 'att-5',
      name: '欧美IRA法案及欧盟新电池法合规指南.md',
      size: 460800,
      type: 'markdown',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      contentSnippet: '关键矿物本土化比例门槛、电池护照(Battery Passport)碳足迹追溯与回收再利用强制要求细则。',
    },
    {
      id: 'att-6',
      name: '全球锂电池供应链地缘分布图谱.png',
      size: 4404019,
      type: 'image',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      contentSnippet: '高精供应链地理分布雷达图谱：精炼厂、前驱体制造基地与整车装配枢纽空间位置。',
    },
  ]);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const packageImportInputRef = useRef<HTMLInputElement | null>(null);

  // Sync edit form when selected project changes
  const handleSelectProj = (id: string) => {
    setSelectedProjId(id);
    const p = projects.find((x) => x.id === id);
    if (p) {
      setEditName(p.name);
      setEditCategory(p.category);
      setEditRole(p.targetRole);
      setEditDescription(p.description);
      setEditSystemPrompt(p.systemPrompt || getDefaultPromptForProject(p));
      setSaveSuccessMsg('');
    }
  };

  // Helper for default prompts
  function getDefaultPromptForProject(p: ProjectItem): string {
    return `# ${p.name} 核心推理方法论与执行指令规范
## 1. 角色定位与专业边界
你是由 ASI 智能底座驱动的【${p.targetRole || '专业分析师'}】。严格执行契约定义的拓扑节点，对真实输入进行穿透式研判，拒绝一切模糊假设。

## 2. 业务输入规范
{{BUSINESS_INPUT}}
本 Agent 接收来自单项业务的业务目标、文字要求以及上传的专业附件资料（包括 PPT、PDF、Word、Excel、Markdown、TXT 及图谱）。

## 3. 核心执行原则
- **事实第一**: 所有研判结论均需对应真实数据源与输入材料依据。
- **可复核性**: 计算结果与参数对标必须附公式或原始引用页码。
- **防伪封存**: 交付物必须挂载 SHA-256 证据链防伪哈希，供人类复核。
`;
  }

  // Handle Save Project Name & Prompt
  const handleSaveProjectInfo = () => {
    if (!currentProject) return;
    const updated: ProjectItem = {
      ...currentProject,
      name: editName.trim() || currentProject.name,
      category: editCategory,
      targetRole: editRole.trim() || currentProject.targetRole,
      description: editDescription.trim() || currentProject.description,
      systemPrompt: editSystemPrompt,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    onUpdateProject(updated);
    setSaveSuccessMsg('项目名称与核心提示词指令已成功保存更新！');
    logService.addLog(
      'INFO',
      `修改项目名称与提示词规范: 【${updated.name}】`,
      { name: updated.name, role: updated.targetRole },
      updated.id,
      updated.name
    );
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Handle Export Full Project Package (JSON)
  const handleExportPackage = (projectToExport: ProjectItem) => {
    const fullPackage = {
      manifestVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      platform: 'ASI Agent-Skill Intelligence Platform V0.3',
      project: {
        id: projectToExport.id,
        name: projectToExport.name,
        category: projectToExport.category,
        level: projectToExport.level,
        description: projectToExport.description,
        targetRole: projectToExport.targetRole,
        systemPrompt: projectToExport.systemPrompt || getDefaultPromptForProject(projectToExport),
        contract: projectToExport.contract,
        businessJobs: projectToExport.businessJobs || [],
        executionSteps: projectToExport.executionSteps,
        deliverables: projectToExport.deliverables,
        status: projectToExport.status,
      },
    };

    const blob = new Blob([JSON.stringify(fullPackage, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = projectToExport.name.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_');
    a.download = `ASI_Project_${safeName}_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logService.addLog(
      'INFO',
      `完整项目包已导出: 【${projectToExport.name}】(包含契约、拓扑、提示词、单项业务与成果数据)`,
      undefined,
      projectToExport.id,
      projectToExport.name
    );
  };

  // Handle Import Project Package
  const handlePackageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const importedProj = parsed.project || parsed;
        if (!importedProj.name || !importedProj.contract) {
          alert('无效的项目包文件格式，请提供正确的 ASI 导出的 JSON 项目包');
          return;
        }

        const completeProj: ProjectItem = {
          ...importedProj,
          id: `proj-imported-${Date.now()}`,
          name: `${importedProj.name} (导入)`,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };

        onImportProjectPackage(completeProj);
        setSelectedProjId(completeProj.id);
        alert(`项目包【${completeProj.name}】导入成功！`);
      } catch (err: any) {
        alert(`项目包解析失败: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Local File Upload for Business Attachments
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAtts: BusinessAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      let fileType: BusinessAttachment['type'] = 'other';

      if (['pdf'].includes(ext)) fileType = 'pdf';
      else if (['ppt', 'pptx'].includes(ext)) fileType = 'ppt';
      else if (['doc', 'docx'].includes(ext)) fileType = 'word';
      else if (['xls', 'xlsx', 'csv'].includes(ext)) fileType = 'excel';
      else if (['md', 'markdown'].includes(ext)) fileType = 'markdown';
      else if (['txt', 'log'].includes(ext)) fileType = 'txt';
      else if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) fileType = 'image';

      newAtts.push({
        id: `att-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        name: f.name,
        size: f.size,
        type: fileType,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        contentSnippet: `本地解析就绪：文件大小 ${(f.size / (1024 * 1024)).toFixed(2)} MB，已挂载至单项业务上下文。`,
      });
    }

    setNewJobAttachments((prev) => [...prev, ...newAtts]);
    e.target.value = '';
  };

  const removeAttachment = (attId: string) => {
    setNewJobAttachments((prev) => prev.filter((a) => a.id !== attId));
  };

  // Handle Create Business Job
  const handleCreateBusinessJob = (autoLaunch = false) => {
    if (!currentProject) return;
    if (!newJobTitle.trim()) {
      alert('请输入单项业务项目名称，如“锂电池全球产业研究”');
      return;
    }

    const newJob: BusinessJob = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      projectId: currentProject.id,
      title: newJobTitle.trim(),
      backgroundDescription: newJobBackground.trim(),
      targetScope: newJobScope.trim(),
      attachments: newJobAttachments,
      status: autoLaunch ? 'researching' : 'ready_to_launch',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      launchedAt: autoLaunch ? new Date().toISOString().replace('T', ' ').substring(0, 19) : undefined,
    };

    const existingJobs = currentProject.businessJobs || [];
    const updatedJobs = [newJob, ...existingJobs.filter((j) => j.id !== newJob.id)];

    const updatedProj: ProjectItem = {
      ...currentProject,
      businessJobs: updatedJobs,
      activeJobId: newJob.id,
      status: autoLaunch ? 'running' : currentProject.status,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    onUpdateProject(updatedProj);

    logService.addLog(
      'INFO',
      `项目【${currentProject.name}】新建单项业务: 【${newJob.title}】(挂载资料附件: ${newJob.attachments.length} 个)`,
      { jobTitle: newJob.title, attachmentsCount: newJob.attachments.length },
      currentProject.id,
      currentProject.name
    );

    if (autoLaunch) {
      onClose();
      onLaunchBusinessResearch(currentProject.id, newJob.id);
    } else {
      setSaveSuccessMsg(`单项业务【${newJob.title}】已建立就绪！已自动激活为当前研究主题。`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    }
  };

  // Set active business job and start research
  const handleLaunchExistingJob = (job: BusinessJob) => {
    if (!currentProject) return;
    const updatedProj: ProjectItem = {
      ...currentProject,
      activeJobId: job.id,
      status: 'running',
    };
    onUpdateProject(updatedProj);
    onClose();
    onLaunchBusinessResearch(currentProject.id, job.id);
  };

  // Filter projects list
  const filteredProjects = projects.filter((p) => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.targetRole.toLowerCase().includes(q) ||
        p.level.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getAttachmentIcon = (type: BusinessAttachment['type']) => {
    switch (type) {
      case 'ppt':
        return <Presentation className="w-3.5 h-3.5 text-amber-500" />;
      case 'pdf':
        return <FileText className="w-3.5 h-3.5 text-rose-500" />;
      case 'word':
        return <FileText className="w-3.5 h-3.5 text-blue-500" />;
      case 'excel':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />;
      case 'markdown':
        return <FileCode className="w-3.5 h-3.5 text-purple-500" />;
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />;
      case 'txt':
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          theme === 'developer_black'
            ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-blue-500/5'
            : theme === 'soft_pink'
            ? 'bg-rose-50/95 border-rose-200 text-rose-950 shadow-rose-200/50'
            : 'bg-white border-gray-300 text-gray-900 shadow-xl'
        }`}
      >
        {/* Top Header */}
        <div className={`p-4 border-b flex items-center justify-between gap-3 ${themeConfig.modalHeaderClass}`}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg tracking-tight">
                  项目管理中心 · Agent 与 Skill 统一管理与单项业务工作台
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-mono bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  已收录 {projects.length} 个项目
                </span>
              </div>
              <p className={`text-xs ${themeConfig.textMutedClass}`}>
                支持项目重置、删除、名称与指令提示词修改、完整项目包导出，以及在各项目中建立单项业务（如“锂电池全球产业研究”等）并上传资料后启动研究。
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className={`flex items-center justify-between border-b px-4 py-2 text-xs font-semibold gap-2 overflow-x-auto ${themeConfig.subBarBgClass}`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('business')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'business'
                  ? themeConfig.accentBtnClass
                  : theme === 'developer_black'
                  ? 'hover:bg-slate-800 text-slate-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>建立单项业务与资料上传 (重点功能)</span>
              {currentProject?.businessJobs && currentProject.businessJobs.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                  {currentProject.businessJobs.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'projects'
                  ? themeConfig.accentBtnClass
                  : theme === 'developer_black'
                  ? 'hover:bg-slate-800 text-slate-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>项目列表与状态管控</span>
            </button>

            <button
              onClick={() => setActiveTab('prompt_edit')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'prompt_edit'
                  ? themeConfig.accentBtnClass
                  : theme === 'developer_black'
                  ? 'hover:bg-slate-800 text-slate-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>名称与核心提示词修改</span>
            </button>

            <button
              onClick={() => setActiveTab('export_import')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'export_import'
                  ? themeConfig.accentBtnClass
                  : theme === 'developer_black'
                  ? 'hover:bg-slate-800 text-slate-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>项目包导出与恢复</span>
            </button>
          </div>

          {/* Quick Project Switcher */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className={`text-[11px] ${themeConfig.textMutedClass}`}>操作对象:</span>
            <select
              value={selectedProjId}
              onChange={(e) => handleSelectProj(e.target.value)}
              className={`text-xs px-2 py-1 rounded-md border font-medium max-w-[200px] truncate ${
                theme === 'developer_black'
                  ? 'bg-slate-800 border-slate-700 text-slate-100'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.category}] {p.name} ({p.level})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {saveSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <span className="font-semibold">{saveSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: 建立单项业务与资料上传 (核心需求) */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              {/* Context Banner */}
              <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                theme === 'developer_black'
                  ? 'bg-slate-800/40 border-slate-700/80'
                  : theme === 'soft_pink'
                  ? 'bg-white/80 border-rose-200'
                  : 'bg-blue-50/50 border-blue-100'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-600 text-white">
                    {currentProject?.category === 'Agent' ? <Bot className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/20 text-blue-600 border border-blue-500/30">
                        {currentProject?.level}
                      </span>
                      <h4 className="text-sm font-bold">{currentProject?.name}</h4>
                      <span className={`text-xs ${themeConfig.textMutedClass}`}>({currentProject?.targetRole})</span>
                    </div>
                    <p className={`text-xs mt-0.5 ${themeConfig.textMutedClass}`}>
                      {currentProject?.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onSelectProject(currentProject.id);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-colors ${
                      theme === 'developer_black'
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm'
                    }`}
                  >
                    <span>切换至此项目</span>
                  </button>
                  <button
                    onClick={() => onOpenContract(currentProject)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 shadow"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>查看第2层运行契约</span>
                  </button>
                </div>
              </div>

              {/* Form: 新建单项业务项目 */}
              <div className={`p-5 rounded-2xl border ${
                theme === 'developer_black'
                  ? 'bg-slate-800/60 border-slate-700'
                  : theme === 'soft_pink'
                  ? 'bg-white border-rose-200 shadow-sm'
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b mb-4">
                  <div className="flex items-center space-x-2">
                    <PlusCircle className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-bold">新建单项业务项目 (如：“锂电池全球产业研究”)</h4>
                  </div>
                  <span className={`text-xs ${themeConfig.textMutedClass}`}>
                    录入文字并上传 PPT / PDF / Word / Excel / Markdown / TXT / 图片后，才能正常启动研究
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="mb-4">
                  <label className={`block text-xs font-semibold mb-1.5 ${themeConfig.textMutedClass}`}>
                    快速加载典型单项业务模版：
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewJobTitle('锂电池全球产业研究');
                        setNewJobBackground(
                          '针对全球动力及储能锂电池全产业链（包括上游锂矿/碳酸锂提炼、中游正负极材料/隔膜/电解液/电芯封装，以及下游新能源汽车和特种储能电站）进行深度竞争格局与供应链穿透研究，评估全球产能利用率周期、固态电池技术路线演进、欧美通胀削减法案(IRA)与新电池法规壁垒。'
                        );
                        setNewJobScope('全球 Top 10 动力电池厂商（宁德时代、比亚迪、LG新能源、中创新航、松下等）及核心材料供应商');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs border font-medium bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                    >
                      ⚡ 锂电池全球产业研究 (指定范例)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewJobTitle('某跨国半导体高频芯片收购案反垄断与出口管制穿透');
                        setNewJobBackground(
                          '针对境外高频 SAW 压电滤波模块厂商 100% 股权收购案，全面排查美国 EAR 实体清单、CCL 目录与欧盟两用物项目录，制定受限专利横向剥离信托方案与欧盟/德国反垄断强制申报时间表。'
                        );
                        setNewJobScope('涵盖标的公司旗下 14 项涉案专利、全球股权架构及过去三年财务审计报表');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs border font-medium bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                    >
                      🛡️ 半导体海外收购合规穿透
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewJobTitle('特大型海上风电工程升压站电气设备招投标清标核查');
                        setNewJobBackground(
                          '抓取 220kV 变压器与 GIS 气体绝缘组合电器技术规格书，计算投标人关键参数负偏离度（绝缘温升、短路耐受时间、空载损耗），核查 3 家投标方围标串标与雷同瑕疵。'
                        );
                        setNewJobScope('全部标书★实质性条款，排查 12 个关键工程量清单');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs border font-medium bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    >
                      🏗️ 工程招投标技术偏离度清标
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Job Title */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      单项业务名称 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      placeholder="例如：锂电池全球产业研究"
                      className={`w-full px-3 py-2 rounded-lg text-xs border font-medium ${
                        theme === 'developer_black'
                          ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Manual Text Input 1: Background & Objectives */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      手动输入文字：业务背景、研究目标与核心要求 <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={newJobBackground}
                      onChange={(e) => setNewJobBackground(e.target.value)}
                      placeholder="详细输入本项业务的具体研究任务、行业现状、背景事实与决策诉求..."
                      className={`w-full px-3 py-2 rounded-lg text-xs border leading-relaxed font-mono ${
                        theme === 'developer_black'
                          ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Manual Text Input 2: Target Scope & Constraints */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      手动输入文字：对标范围、关注企业/对象与特定约束 (选填)
                    </label>
                    <input
                      type="text"
                      value={newJobScope}
                      onChange={(e) => setNewJobScope(e.target.value)}
                      placeholder="例如：全球 Top 10 动力电池厂商及核心正负极材料供应商..."
                      className={`w-full px-3 py-2 rounded-lg text-xs border ${
                        theme === 'developer_black'
                          ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Local Upload Attachments: PPT, PDF, Word, Excel, Markdown, TXT, Images */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold flex items-center space-x-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                        <span>本地上传资料附件（包括但不限于 PPT、PDF、Word、Excel、Markdown、TXT、图片）</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1 shadow transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        <span>选择本地文件上传</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".ppt,.pptx,.pdf,.doc,.docx,.xls,.xlsx,.csv,.md,.txt,.png,.jpg,.jpeg,.webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Drag-and-drop simulated zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                        theme === 'developer_black'
                          ? 'border-slate-700 hover:border-blue-500/80 bg-slate-900/50'
                          : 'border-gray-300 hover:border-blue-500 bg-gray-50/60'
                      }`}
                    >
                      <Upload className="w-6 h-6 mx-auto mb-1 text-blue-500 opacity-80" />
                      <p className="text-xs font-medium">点击或将本地文件拖拽至此上传</p>
                      <p className={`text-[11px] mt-0.5 ${themeConfig.textMutedClass}`}>
                        支持格式：.pptx, .ppt, .pdf, .docx, .doc, .xlsx, .xls, .md, .txt, .png, .jpg
                      </p>
                    </div>

                    {/* Uploaded Attachments List */}
                    {newJobAttachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-[11px] font-semibold text-slate-500">
                          已挂载文件 ({newJobAttachments.length} 个)：
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {newJobAttachments.map((att) => (
                            <div
                              key={att.id}
                              className={`p-2.5 rounded-lg border flex items-start justify-between gap-2 text-xs ${
                                theme === 'developer_black'
                                  ? 'bg-slate-900/80 border-slate-700'
                                  : 'bg-white border-gray-200 shadow-sm'
                              }`}
                            >
                              <div className="flex items-start space-x-2 min-w-0">
                                <div className="p-1 rounded bg-black/5 dark:bg-white/5 mt-0.5">
                                  {getAttachmentIcon(att.type)}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold truncate max-w-[240px]" title={att.name}>
                                    {att.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                                    <span className="uppercase font-mono">{att.type}</span>
                                    <span>•</span>
                                    <span>{(att.size / (1024 * 1024)).toFixed(1)} MB</span>
                                    <span>•</span>
                                    <span>{att.uploadedAt.substring(11, 19)}</span>
                                  </div>
                                  {att.contentSnippet && (
                                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                      {att.contentSnippet}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeAttachment(att.id)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-500/10 transition-colors"
                                title="移除附件"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions to Save and Launch */}
                  <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => handleCreateBusinessJob(false)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        theme === 'developer_black'
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm'
                      }`}
                    >
                      保存为业务底稿 (待启动)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCreateBusinessJob(true)}
                      className="px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 flex items-center space-x-2 active:scale-95 transition-all"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>保存并立即启动项目研究</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Business Jobs List for this Project */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    本项目已归档单项业务列表 ({currentProject?.businessJobs?.length || 0})
                  </h4>
                </div>

                {(!currentProject?.businessJobs || currentProject.businessJobs.length === 0) ? (
                  <div className={`text-center py-8 rounded-xl border border-dashed text-xs ${themeConfig.textMutedClass}`}>
                    当前项目暂未建立单项业务，请使用上方表单输入文字并上传资料后新建。
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentProject.businessJobs.map((job) => {
                      const isActiveJob = currentProject.activeJobId === job.id;
                      return (
                        <div
                          key={job.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isActiveJob
                              ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5'
                              : theme === 'developer_black'
                              ? 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
                              : 'bg-white border-gray-200 shadow-sm hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center space-x-2">
                              {isActiveJob && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white animate-pulse">
                                  当前执行中
                                </span>
                              )}
                              <h5 className="font-bold text-sm">{job.title}</h5>
                              <span className="text-[11px] text-slate-400 font-mono">
                                创建于 {job.createdAt}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleLaunchExistingJob(job)}
                                className="px-3 py-1 rounded-md text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1 shadow transition-all active:scale-95"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>启动该业务研究</span>
                              </button>
                            </div>
                          </div>

                          <p className="text-xs leading-relaxed text-slate-400 mb-2">
                            {job.backgroundDescription}
                          </p>

                          {job.targetScope && (
                            <div className="text-[11px] text-slate-500 mb-3 font-mono">
                              关注范围: {job.targetScope}
                            </div>
                          )}

                          {/* Attachments Pills */}
                          {job.attachments && job.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-black/5 dark:border-white/5">
                              {job.attachments.map((att) => (
                                <span
                                  key={att.id}
                                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center space-x-1 text-slate-300"
                                >
                                  {getAttachmentIcon(att.type)}
                                  <span className="truncate max-w-[150px]">{att.name}</span>
                                  <span className="text-[9px] opacity-70">
                                    ({(att.size / (1024 * 1024)).toFixed(1)}MB)
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: 项目列表与状态管控 */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {/* Controls: Search, Filter, Add */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索项目名称、适用角色、契约等级..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs border ${
                        theme === 'developer_black'
                          ? 'bg-slate-900 border-slate-700 text-slate-100'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div className="flex items-center space-x-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg text-xs">
                    <button
                      onClick={() => setFilterCategory('all')}
                      className={`px-2 py-1 rounded ${filterCategory === 'all' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'}`}
                    >
                      全部 ({projects.length})
                    </button>
                    <button
                      onClick={() => setFilterCategory('Agent')}
                      className={`px-2 py-1 rounded ${filterCategory === 'Agent' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'}`}
                    >
                      Agent ({projects.filter((p) => p.category === 'Agent').length})
                    </button>
                    <button
                      onClick={() => setFilterCategory('Skill')}
                      className={`px-2 py-1 rounded ${filterCategory === 'Skill' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'}`}
                    >
                      Skill ({projects.filter((p) => p.category === 'Skill').length})
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenImportModal();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 shadow"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>新建/导入项目</span>
                  </button>
                </div>
              </div>

              {/* Projects Table / Card Grid */}
              <div className="space-y-3">
                {filteredProjects.map((p) => {
                  const isCurrent = p.id === activeProjectId;
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-500/5 shadow-sm'
                          : theme === 'developer_black'
                          ? 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800/70'
                          : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/20 text-blue-600 border border-blue-500/30">
                            {p.level}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            p.category === 'Agent' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-cyan-500/20 text-cyan-400'
                          }`}>
                            {p.category}
                          </span>
                          <h4 className="font-bold text-sm truncate">{p.name}</h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                              主视窗当前激活
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-1">
                          {p.description}
                        </p>

                        <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-mono">
                          <span>角色: {p.targetRole}</span>
                          <span>•</span>
                          <span>节点数: {p.contract?.topology?.nodes?.length || 0}</span>
                          <span>•</span>
                          <span>产出成果: {p.deliverables?.length || 0}</span>
                          <span>•</span>
                          <span>单项业务: {p.businessJobs?.length || 0}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 flex-wrap">
                        <button
                          onClick={() => {
                            onSelectProject(p.id);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1 shadow"
                          title="在主屏运行此项目"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>进入运行</span>
                        </button>

                        <button
                          onClick={() => {
                            handleSelectProj(p.id);
                            setActiveTab('business');
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 flex items-center space-x-1"
                          title="管理单项业务"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>单项业务</span>
                        </button>

                        <button
                          onClick={() => {
                            handleSelectProj(p.id);
                            setActiveTab('prompt_edit');
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-700 hover:bg-slate-700/50 flex items-center space-x-1"
                          title="修改名称与提示词"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>修改提示词</span>
                        </button>

                        <button
                          onClick={() => onResetProject(p.id)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 flex items-center space-x-1"
                          title="重置流水线执行状态和产出"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>重置</span>
                        </button>

                        <button
                          onClick={() => handleExportPackage(p)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-700 hover:bg-slate-700/50 flex items-center space-x-1"
                          title="导出完整项目包 JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>导出包</span>
                        </button>

                        {projects.length > 1 && (
                          <button
                            onClick={() => onDeleteProject(p.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="删除项目"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: 名称与核心提示词修改 */}
          {activeTab === 'prompt_edit' && currentProject && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs flex items-center space-x-2">
                <Edit3 className="w-4 h-4 flex-shrink-0" />
                <span>
                  当前正在修改项目：<strong>【{currentProject.name}】</strong> 的核心属性、角色定位与系统提示词/方法论指令。
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    项目名称
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs border font-medium ${
                      theme === 'developer_black'
                        ? 'bg-slate-900 border-slate-700 text-slate-100'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    适用场景角色 (Target Role)
                  </label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs border font-medium ${
                      theme === 'developer_black'
                        ? 'bg-slate-900 border-slate-700 text-slate-100'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    项目类型分类
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ProjectCategory)}
                    className={`w-full px-3 py-2 rounded-lg text-xs border font-medium ${
                      theme === 'developer_black'
                        ? 'bg-slate-900 border-slate-700 text-slate-100'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Agent">Agent 综合体 (自主状态机闭环)</option>
                    <option value="Skill">Skill 专业技能与组件</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    项目简要描述
                  </label>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs border font-medium ${
                      theme === 'developer_black'
                        ? 'bg-slate-900 border-slate-700 text-slate-100'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* System Prompt / Instructions Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold flex items-center space-x-1.5">
                    <FileCode className="w-3.5 h-3.5 text-blue-500" />
                    <span>核心提示词 / 指令方法论 (System Prompt & Methodology)</span>
                  </label>

                  <div className="flex items-center space-x-1.5 text-[10px]">
                    <span className="text-slate-400">插入参数:</span>
                    <button
                      type="button"
                      onClick={() => setEditSystemPrompt((p) => p + '\n{{BUSINESS_INPUT}}\n')}
                      className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 hover:bg-blue-500/20 text-blue-400"
                    >
                      + 业务输入
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditSystemPrompt((p) => p + '\n{{MATERIALS}}\n')}
                      className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 hover:bg-blue-500/20 text-blue-400"
                    >
                      + 资料附件
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditSystemPrompt((p) => p + '\n{{VERIFICATION_CRITERIA}}\n')}
                      className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 hover:bg-blue-500/20 text-blue-400"
                    >
                      + 验收标准
                    </button>
                  </div>
                </div>

                <textarea
                  rows={12}
                  value={editSystemPrompt}
                  onChange={(e) => setEditSystemPrompt(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono leading-relaxed border ${
                    theme === 'developer_black'
                      ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                <button
                  onClick={() => setEditSystemPrompt(getDefaultPromptForProject(currentProject))}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
                >
                  恢复缺省指令规范
                </button>
                <button
                  onClick={handleSaveProjectInfo}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>保存修改并更新</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: 项目包导出与恢复 */}
          {activeTab === 'export_import' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  theme === 'developer_black'
                    ? 'bg-slate-800/40 border-slate-700'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm">完整项目包导出</h4>
                    <p className={`text-xs leading-relaxed ${themeConfig.textMutedClass}`}>
                      将选定项目（包含第2层契约结构、节点依赖拓扑、核心提示词、单项业务及所有防伪证据成果）打包为标准 ASI 项目包 (.json) 离线留存或跨端流转。
                    </p>
                    <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5 text-xs font-mono space-y-1">
                      <div>导出目标: <strong>{currentProject?.name}</strong></div>
                      <div>包含业务: {currentProject?.businessJobs?.length || 0} 个</div>
                      <div>包含成果: {currentProject?.deliverables?.length || 0} 项</div>
                    </div>
                  </div>

                  <button
                    onClick={() => currentProject && handleExportPackage(currentProject)}
                    className="mt-4 w-full py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>立即导出项目包 (.json)</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  theme === 'developer_black'
                    ? 'bg-slate-800/40 border-slate-700'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-500 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm">导入已有项目包</h4>
                    <p className={`text-xs leading-relaxed ${themeConfig.textMutedClass}`}>
                      选择此前导出的 ASI 项目包 JSON 文件，一键恢复全部契约、Prompt 指令规范、单项业务需求与历史证据链。
                    </p>
                    <input
                      ref={packageImportInputRef}
                      type="file"
                      accept=".json"
                      onChange={handlePackageFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => packageImportInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                    >
                      <Upload className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
                      <span className="text-xs font-medium">点击浏览本地项目包并导入</span>
                    </div>
                  </div>

                  <button
                    onClick={() => packageImportInputRef.current?.click()}
                    className="mt-4 w-full py-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>选择项目包文件</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone: Project Reset */}
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <div>
                    <h5 className="font-bold text-xs text-rose-500">危险操作区 · 项目重置</h5>
                    <p className="text-[11px] text-slate-400">
                      将【{currentProject?.name}】重置为初始待命状态，清空所有节点运行记录与成果物。
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => currentProject && onResetProject(currentProject.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow"
                >
                  确认重置该项目
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-3 border-t flex items-center justify-between text-xs ${themeConfig.modalHeaderClass}`}>
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-mono">ASI 智能契约与业务底座 V0.3</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            完成并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
