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
  // Placeholder to protect URLs from being mangled by other regex
  const urlPlaceholders: string[] = [];
  
  // First, extract and protect all markdown links [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    const placeholder = `__LINK_${urlPlaceholders.length}__`;
    urlPlaceholders.push(`<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`);
    return placeholder;
  });
  
  // Then, extract and protect plain URLs (only those not already in a link)
  text = text.replace(/(?<!href="|">)(https?:\/\/[^\s<>]+)/g, (match, url) => {
    // Clean up any trailing punctuation that shouldn't be part of URL
    const cleanUrl = url.replace(/[.,;:!?)]+$/, '');
    const trailing = url.slice(cleanUrl.length);
    const placeholder = `__LINK_${urlPlaceholders.length}__`;
    urlPlaceholders.push(`<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>`);
    return placeholder + trailing;
  });
  
  // Bold: **text** or __text__
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  
  // Italic: *text* or _text_ (avoid matching if part of bold or in URLs)
  // Only match underscore italic if surrounded by spaces or at word boundaries
  text = text.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
  // For underscores, be more conservative - require word boundaries
  text = text.replace(/(?<=\s|^)_([^_\n]+?)_(?=\s|$|[.,!?])/g, '<em>$1</em>');
  
  // Code: `text`
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Restore protected links
  for (let i = 0; i < urlPlaceholders.length; i++) {
    text = text.replace(`__LINK_${i}__`, urlPlaceholders[i]);
  }
  
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
  // IMPORTANT: Preserve newlines for markdown parsing!
  decoded = decoded
    .replace(/[^\S\n]+/g, ' ') // Multiple spaces to single (but preserve newlines)
    .replace(/\n{3,}/g, '\n\n') // 3+ newlines to double
    .trim();

  return decoded;
}
