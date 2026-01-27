/**
 * Decodes HTML entities in a string
 * Common entities: &#8217; (apostrophe), &#8220; (left quote), &#8221; (right quote), 
 * &#8211; (en dash), &hellip; (ellipsis), etc.
 */
export function decodeHtmlEntities(text: string): string {
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
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entityMap)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }

  // Also handle numeric entities like &#8217;
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });

  // Handle hex entities like &#x2019;
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
}
