/**
 * A simple, lightweight Markdown parser for formatting local files into HTML.
 * Supports: Headers (h1, h2, h3), lists, blockquotes, tables, bold, and horizontal rules.
 */
export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  let html = '';
  let inList = false;
  let inTable = false;
  let tableHeaders: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Handle Lists
    if (line.startsWith('1. ') || line.startsWith('- ')) {
      if (!inList) {
        html += '<ul class="list-disc list-inside flex flex-col gap-2 my-4 pl-4 text-slate-650 dark:text-slate-350 font-medium">';
        inList = true;
      }
      const itemContent = line.replace(/^(1\.\s+|- )/, '');
      html += `<li>${parseInlineMarkdown(itemContent)}</li>`;
      continue;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
    }

    // Handle Tables
    if (line.startsWith('|')) {
      if (line.includes('---')) {
        // Skip separator lines
        continue;
      }
      
      const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');
      if (!inTable) {
        html += '<div class="overflow-x-auto my-6 border border-slate-200 dark:border-white/5 rounded-xl"><table class="w-full text-left text-xs md:text-sm border-collapse">';
        inTable = true;
        tableHeaders = cells;
        
        // Write header row
        html += '<thead class="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 text-slate-900 dark:text-white uppercase tracking-wider font-mono"><tr>';
        cells.forEach(cell => {
          html += `<th class="p-4 font-bold">${parseInlineMarkdown(cell)}</th>`;
        });
        html += '</tr></thead><tbody class="divide-y divide-slate-200 dark:divide-white/5 text-slate-600 dark:text-slate-400 font-medium">';
        continue;
      } else {
        // Write body row
        html += '<tr class="hover:bg-slate-50/50 dark:hover:bg-white/1">';
        cells.forEach(cell => {
          html += `<td class="p-4">${parseInlineMarkdown(cell)}</td>`;
        });
        html += '</tr>';
        continue;
      }
    } else {
      if (inTable) {
        html += '</tbody></table></div>';
        inTable = false;
      }
    }

    // Handle Empty Lines
    if (line === '') {
      continue;
    }

    // Handle Headers
    if (line.startsWith('# ')) {
      html += `<h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mt-8 mb-4">${parseInlineMarkdown(line.slice(2))}</h1>`;
    } else if (line.startsWith('## ')) {
      html += `<h2 class="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white mt-8 mb-4 border-l-4 border-industrial-orange pl-3">${parseInlineMarkdown(line.slice(3))}</h2>`;
    } else if (line.startsWith('### ')) {
      html += `<h3 class="text-xl md:text-2xl font-bold uppercase tracking-wide text-slate-900 dark:text-white mt-6 mb-3">${parseInlineMarkdown(line.slice(4))}</h3>`;
    } 
    // Handle Blockquotes
    else if (line.startsWith('> ')) {
      html += `<blockquote class="my-6 border-l-4 border-industrial-orange bg-slate-50 dark:bg-white/5 p-4 rounded-r-xl text-base italic text-slate-700 dark:text-slate-300 font-medium">${parseInlineMarkdown(line.slice(2))}</blockquote>`;
    }
    // Handle Horizontal Rules
    else if (line === '---') {
      html += '<hr class="my-8 border-slate-200 dark:border-white/5" />';
    }
    // Standard Paragraph
    else {
      html += `<p class="text-sm md:text-base leading-relaxed text-slate-650 dark:text-slate-350 my-4 font-medium">${parseInlineMarkdown(line)}</p>`;
    }
  }

  // Cleanup tags if EOF hits inside open block structures
  if (inList) html += '</ul>';
  if (inTable) html += '</tbody></table></div>';

  return html;
}

function parseInlineMarkdown(text: string): string {
  let formatted = text;

  // Bold (**text**)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');

  // Code (`code`)
  formatted = formatted.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 font-mono text-xs text-industrial-orange font-bold">$1</code>');

  // Links ([text](url))
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-industrial-orange hover:underline font-semibold">$1</a>');

  return formatted;
}
