import { Deliverable } from '../types';

/**
 * Downloads deliverable as Markdown (.md)
 */
export function exportDeliverableAsMarkdown(deliverable: Deliverable, projectName = 'ASI 项目') {
  const content = `---
title: ${deliverable.title}
project: ${projectName}
deliverable_id: ${deliverable.id}
step_index: ${deliverable.stepIndex}
type: ${deliverable.type}
created_at: ${deliverable.createdAt}
evidence_hash: ${deliverable.evidenceHash}
verification_score: ${deliverable.verificationScore}%
verified: ${deliverable.verified}
---

# ${deliverable.title}

- **所属项目**: ${projectName}
- **节点步骤**: 步骤 ${deliverable.stepIndex}
- **成果类型**: ${deliverable.type}
- **生成时间**: ${deliverable.createdAt}
- **证据哈希**: \`${deliverable.evidenceHash}\`
- **防伪验真评分**: ${deliverable.verificationScore}% (${deliverable.verified ? '已终验' : '待验真'})

---

## 一、成果核心概要
${deliverable.summary}

---

## 二、详细成果内容
${deliverable.content}

---

## 三、不可篡改证据链 (Evidence Chain)
${(deliverable.evidenceChain || [])
  .map(
    (e, idx) =>
      `${idx + 1}. **[${e.status}]** ${e.item}  \n   *溯源证据库*: ${e.source}`
  )
  .join('\n\n')}

${
  deliverable.auditDetails
    ? `\n---\n\n## 四、底座防幻觉审计记录\n- **审计引擎**: ${deliverable.auditDetails.auditedBy}\n- **防幻觉测试**: ${
        deliverable.auditDetails.antiHallucinationCheck ? '通过 (零幻觉检出)' : '未通过'
      }\n- **对标要素**: ${deliverable.auditDetails.evidencePoints.join('、')}`
    : ''
}
`;

  downloadBlob(
    content,
    `${safeFileName(deliverable.title)}_步骤${deliverable.stepIndex}.md`,
    'text/markdown;charset=utf-8'
  );
}

/**
 * Downloads deliverable as Word document (.doc)
 * Generates an HTML-based MS Word document with styling, tables, headers, and footer.
 */
export function exportDeliverableAsWord(deliverable: Deliverable, projectName = 'ASI 项目') {
  // Convert Markdown content roughly to HTML for Word
  const bodyHtml = markdownToWordHtml(deliverable.content);
  const summaryHtml = deliverable.summary.replace(/\n/g, '<br/>');

  const evidenceRows = (deliverable.evidenceChain || [])
    .map(
      (e, idx) => `
    <tr>
      <td style="border:1px solid #d0d7de;padding:8px 12px;font-size:10.5pt;">${idx + 1}</td>
      <td style="border:1px solid #d0d7de;padding:8px 12px;font-size:10.5pt;font-weight:bold;color:${
        e.status === 'VERIFIED' ? '#1a7f37' : '#9a6700'
      };">${e.status}</td>
      <td style="border:1px solid #d0d7de;padding:8px 12px;font-size:10.5pt;">${e.item}</td>
      <td style="border:1px solid #d0d7de;padding:8px 12px;font-size:10.5pt;color:#57606a;">${e.source}</td>
    </tr>
  `
    )
    .join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${deliverable.title}</title>
      <style>
        body { font-family: 'Segoe UI', 'Microsoft YaHei', SimSun, sans-serif; line-height: 1.6; color: #24292f; margin: 40px; }
        h1 { font-size: 20pt; color: #0969da; border-bottom: 2px solid #0969da; padding-bottom: 8px; margin-bottom: 16px; }
        h2 { font-size: 14pt; color: #1f2328; border-bottom: 1px solid #d0d7de; padding-bottom: 4px; margin-top: 24px; }
        h3 { font-size: 12pt; color: #333; margin-top: 16px; }
        .meta-box { background-color: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 16px; margin-bottom: 24px; font-size: 10pt; }
        .summary-box { background-color: #e6f6ff; border-left: 4px solid #0969da; padding: 12px 16px; margin-bottom: 24px; font-size: 11pt; color: #0550ae; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th { background-color: #f6f8fa; border: 1px solid #d0d7de; padding: 8px 12px; text-align: left; font-size: 10.5pt; font-weight: bold; }
        td { border: 1px solid #d0d7de; padding: 8px 12px; font-size: 10.5pt; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 9pt; font-weight: bold; }
        .badge-verified { background-color: #dafbe1; color: #1a7f37; border: 1px solid #aceebb; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px dashed #d0d7de; font-size: 9pt; color: #6e7781; text-align: center; }
      </style>
    </head>
    <body>
      <h1>${deliverable.title}</h1>
      
      <div class="meta-box">
        <strong>所属项目：</strong>${projectName}<br/>
        <strong>执行节点：</strong>第 ${deliverable.stepIndex} 步骤交付物<br/>
        <strong>成果类型：</strong>${deliverable.type.toUpperCase()}<br/>
        <strong>生成时间：</strong>${deliverable.createdAt}<br/>
        <strong>防伪数字签名 (SHA-256)：</strong><code style="font-family:Consolas,monospace;background:#eaeef2;padding:2px 4px;">${deliverable.evidenceHash}</code><br/>
        <strong>底座可信验真：</strong><span class="badge badge-verified">验真通过 (${deliverable.verificationScore} 分)</span>
      </div>

      <div class="summary-box">
        <strong>【核心概要】</strong><br/>
        ${summaryHtml}
      </div>

      <h2>详细成果主体</h2>
      <div>
        ${bodyHtml}
      </div>

      <h2>不可篡改证据链条 (Evidence Chain)</h2>
      <table>
        <thead>
          <tr>
            <th style="width:40px;">#</th>
            <th style="width:90px;">状态</th>
            <th>核验证据事项</th>
            <th>源材料/数据库出处</th>
          </tr>
        </thead>
        <tbody>
          ${evidenceRows}
        </tbody>
      </table>

      <div class="footer">
        本文档由 ASI Agent-Skill Intelligence 通用智能底座自动导出 · 防伪证据链数字存证有效
      </div>
    </body>
    </html>
  `;

  downloadBlob(
    wordHtml,
    `${safeFileName(deliverable.title)}_步骤${deliverable.stepIndex}.doc`,
    'application/msword;charset=utf-8'
  );
}

/**
 * Downloads deliverable as Excel spreadsheet (.csv or .xls with UTF-8 BOM)
 * Parses markdown tables or generates tabular metrics format.
 */
export function exportDeliverableAsExcel(deliverable: Deliverable, projectName = 'ASI 项目') {
  // Check if content has Markdown table
  const lines = deliverable.content.split('\n');
  const tableRows: string[][] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Ignore separator row like |:---|:---|
      if (trimmed.replace(/[\|\s\-:]/g, '') === '') {
        continue;
      }
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim().replace(/"/g, '""'));
      tableRows.push(cells);
    }
  }

  let csvContent = '\uFEFF'; // UTF-8 BOM for Excel Chinese support

  if (tableRows.length >= 2) {
    // Has a markdown table!
    csvContent += `项目名称,"${projectName.replace(/"/g, '""')}"\n`;
    csvContent += `成果名称,"${deliverable.title.replace(/"/g, '""')}"\n`;
    csvContent += `生成时间,"${deliverable.createdAt}"\n`;
    csvContent += `证据哈希,"${deliverable.evidenceHash}"\n\n`;

    for (const row of tableRows) {
      csvContent += row.map((c) => `"${c}"`).join(',') + '\n';
    }

    // Append evidence chain
    csvContent += '\n不可篡改证据链清单\n';
    csvContent += '序号,状态,核验证据事项,来源出处\n';
    (deliverable.evidenceChain || []).forEach((e, idx) => {
      csvContent += `${idx + 1},"${e.status}","${e.item.replace(/"/g, '""')}","${e.source.replace(/"/g, '""')}"\n`;
    });
  } else {
    // No markdown table: generate structured key-value & sections spreadsheet
    csvContent += `项目名称,"${projectName.replace(/"/g, '""')}"\n`;
    csvContent += `成果名称,"${deliverable.title.replace(/"/g, '""')}"\n`;
    csvContent += `步骤序号,步骤 ${deliverable.stepIndex}\n`;
    csvContent += `成果类型,"${deliverable.type}"\n`;
    csvContent += `生成时间,"${deliverable.createdAt}"\n`;
    csvContent += `防伪哈希,"${deliverable.evidenceHash}"\n`;
    csvContent += `验真评分,${deliverable.verificationScore}%\n\n`;

    csvContent += '模块分类,研判内容与量化指标\n';
    csvContent += `"核心概要","${deliverable.summary.replace(/"/g, '""').replace(/\n/g, ' ')}"\n`;

    // Split sections in content
    const sections = deliverable.content.split(/###?\s+/);
    for (const sec of sections) {
      if (!sec.trim()) continue;
      const secLines = sec.trim().split('\n');
      const title = secLines[0] || '核心条目';
      const body = secLines.slice(1).join(' ').trim().replace(/"/g, '""').replace(/\n/g, ' ');
      csvContent += `"${title.replace(/"/g, '""')}","${body}"\n`;
    }

    csvContent += '\n证据链清单\n';
    csvContent += '序号,状态,证据核验项,原始凭证出处\n';
    (deliverable.evidenceChain || []).forEach((e, idx) => {
      csvContent += `${idx + 1},"${e.status}","${e.item.replace(/"/g, '""')}","${e.source.replace(/"/g, '""')}"\n`;
    });
  }

  downloadBlob(
    csvContent,
    `${safeFileName(deliverable.title)}_步骤${deliverable.stepIndex}.csv`,
    'text/csv;charset=utf-8'
  );
}

// Helper: Markdown to basic HTML for Word
function markdownToWordHtml(md: string): string {
  let html = md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code style="background:#f6f8fa;padding:2px 4px;font-family:Consolas,monospace;">$1</code>');

  // Convert tables
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  const resultLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (trimmed.replace(/[\|\s\-:]/g, '') === '') {
        continue; // separator
      }
      const cells = trimmed.slice(1, -1).split('|').map((c) => c.trim());
      if (!inTable) {
        inTable = true;
        tableHtml = '<table><thead><tr>' + cells.map((c) => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr>' + cells.map((c) => `<td>${c}</td>`).join('') + '</tr>';
      }
    } else {
      if (inTable) {
        tableHtml += '</tbody></table>';
        resultLines.push(tableHtml);
        inTable = false;
        tableHtml = '';
      }
      if (trimmed.startsWith('- ')) {
        resultLines.push(`<li>${trimmed.substring(2)}</li>`);
      } else if (trimmed) {
        resultLines.push(`<p>${trimmed}</p>`);
      }
    }
  }

  if (inTable) {
    tableHtml += '</tbody></table>';
    resultLines.push(tableHtml);
  }

  return resultLines.join('\n');
}

function safeFileName(str: string): string {
  return str.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_').substring(0, 50);
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
