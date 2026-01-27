/**
 * Converts markdown content to HTML with proper formatting
 * Handles paragraphs, headings, lists, links, and blockquotes
 */
export function markdownToHtml(markdown: string): string {
  // Decode HTML entities first
  let html = decodeHtmlEntities(markdown);
  
  // Split into lines for processing - preserve original line structure
  const lines = html.split(/\r?\n/);
  const result: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let inBlockquote = false;
  let currentParagraph: string[] = [];
  
  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const paraText = currentParagraph.join(' ').trim();
      if (paraText && paraText.length > 0) {
        // Clean up any double spaces or formatting artifacts
        const cleanedText = paraText.replace(/\s+/g, ' ').trim();
        if (cleanedText.length > 0) {
          result.push(`<p>${processInlineMarkdown(cleanedText)}</p>`);
        }
      }
      currentParagraph = [];
    }
  }
  
  function flushList() {
    if (inList && listType) {
      result.push(`</${listType}>`);
      inList = false;
      listType = null;
    }
  }
  
  function flushBlockquote() {
    if (inBlockquote) {
      result.push('</blockquote>');
      inBlockquote = false;
    }
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Empty line - flush current paragraph/list/blockquote
    if (!trimmed || trimmed.length === 0) {
      flushParagraph();
      flushList();
      flushBlockquote();
      continue;
    }
    
    // Headings - check for #### first (h4), then ### (h3), then ## (h2), then # (h1)
    // Must be at the start of the trimmed line
    if (/^####\s/.test(trimmed)) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const text = trimmed.replace(/^####\s+/, '').trim();
      if (text) {
        result.push(`<h4>${processInlineMarkdown(text)}</h4>`);
      }
      continue;
    }
    
    if (/^###\s/.test(trimmed)) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const text = trimmed.replace(/^###\s+/, '').trim();
      if (text) {
        result.push(`<h3>${processInlineMarkdown(text)}</h3>`);
      }
      continue;
    }
    
    if (/^##\s/.test(trimmed)) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const text = trimmed.replace(/^##\s+/, '').trim();
      if (text) {
        result.push(`<h2>${processInlineMarkdown(text)}</h2>`);
      }
      continue;
    }
    
    if (/^#\s/.test(trimmed)) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const text = trimmed.replace(/^#\s+/, '').trim();
      if (text) {
        result.push(`<h1>${processInlineMarkdown(text)}</h1>`);
      }
      continue;
    }
    
    // Blockquote (lines starting with >)
    if (/^>\s/.test(trimmed)) {
      flushParagraph();
      flushList();
      if (!inBlockquote) {
        result.push('<blockquote>');
        inBlockquote = true;
      }
      const text = trimmed.replace(/^>\s+/, '').trim();
      if (text) {
        result.push(`<p>${processInlineMarkdown(text)}</p>`);
      }
      continue;
    }
    
    // Unordered list items - must check before regular paragraph text
    // Handle both - and * as list markers, but ensure they're at the start
    // Check for - or * followed by space, but not --- (horizontal rule)
    if (/^[-*]\s/.test(trimmed) && !trimmed.startsWith('---')) {
      flushParagraph();
      flushBlockquote();
      if (!inList || listType !== 'ul') {
        flushList();
        result.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      const text = trimmed.replace(/^[-*]\s+/, '').trim();
      if (text) {
        result.push(`<li>${processInlineMarkdown(text)}</li>`);
      }
      continue;
    }
    
    // Numbered list items
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      flushParagraph();
      flushBlockquote();
      if (!inList || listType !== 'ol') {
        flushList();
        result.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      const text = numberedMatch[2].trim();
      if (text) {
        result.push(`<li>${processInlineMarkdown(text)}</li>`);
      }
      continue;
    }
    
    // Regular paragraph text
    flushList();
    flushBlockquote();
    if (trimmed) {
      currentParagraph.push(trimmed);
    }
  }
  
  // Flush any remaining content
  flushParagraph();
  flushList();
  flushBlockquote();
  
  // Join with double newlines for extra spacing between paragraphs
  return result.join('\n\n');
}

/**
 * Processes inline markdown (bold, italic, links)
 * Order matters - process links first, then bold, then italic
 */
function processInlineMarkdown(text: string): string {
  // Links: [text](url) - must be processed first
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Handle plain URLs (not in markdown link format) - convert to links
  text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Bold: **text** or __text__
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  
  // Italic: *text* or _text_ (avoid matching if part of bold)
  // Simple approach: match single asterisks/underscores
  text = text.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
  text = text.replace(/(?<!_)_([^_\n]+?)_(?!_)/g, '<em>$1</em>');
  
  // Code: `text`
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  return text;
}

/**
 * Decodes HTML entities and removes unnecessary special characters
 */
function decodeHtmlEntities(text: string): string {
  const entityMap: Record<string, string> = {
    '&#8217;': "'",
    '&#8216;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8211;': '–',
    '&#8212;': '—',
    '&hellip;': '…',
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&mdash;': '—',
    '&ndash;': '–',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
  };

  let decoded = text;
  
  // First decode named entities
  for (const [entity, char] of Object.entries(entityMap)) {
    decoded = decoded.replace(new RegExp(entity, 'gi'), char);
  }

  // Handle numeric entities like &#8217;
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    const code = parseInt(dec, 10);
    // Only decode common text entities, leave others as-is for safety
    if (code >= 32 && code <= 126 || code >= 160 && code <= 255 || code >= 8192 && code <= 8303) {
      return String.fromCharCode(code);
    }
    return match;
  });

  // Handle hex entities like &#x2019;
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/gi, (match, hex) => {
    const code = parseInt(hex, 16);
    if (code >= 32 && code <= 126 || code >= 160 && code <= 255 || code >= 8192 && code <= 8303) {
      return String.fromCharCode(code);
    }
    return match;
  });

  // Clean up any remaining formatting artifacts
  decoded = decoded
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double
    .trim();

  return decoded;
}
