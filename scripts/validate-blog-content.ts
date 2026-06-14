#!/usr/bin/env tsx
/**
 * Pre-commit validation for blog content
 * Checks for common formatting issues that break rendering
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

interface ValidationError {
  file: string;
  line?: number;
  issue: string;
  severity: 'error' | 'warning';
}

const errors: ValidationError[] = [];

/**
 * Validate a single blog post
 */
function validateBlogPost(filePath: string): void {
  const filename = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');

  try {
    const { data: frontmatter, content: body } = matter(content);

    // Check frontmatter
    if (!frontmatter.title) {
      errors.push({
        file: filename,
        issue: 'Missing title in frontmatter',
        severity: 'error',
      });
    }

    if (!frontmatter.date) {
      errors.push({
        file: filename,
        issue: 'Missing date in frontmatter',
        severity: 'error',
      });
    }

    if (!frontmatter.summary) {
      errors.push({
        file: filename,
        issue: 'Missing summary in frontmatter',
        severity: 'warning',
      });
    }

    // Check canonical_url matches filename
    if (frontmatter.canonical_url) {
      const slug = filename.replace(/\.mdx?$/, '');
      const expectedUrl = `https://ripxg.com/blog/${slug}`;
      const expectedUrlWww = `https://www.ripxg.com/blog/${slug}`;
      if (frontmatter.canonical_url !== expectedUrl && frontmatter.canonical_url !== expectedUrlWww) {
        errors.push({
          file: filename,
          issue: `canonical_url mismatch: got "${frontmatter.canonical_url}", expected "${expectedUrl}"`,
          severity: 'error',
        });
      }
    }

    // Check for broken link placeholders (the bug we're fixing)
    const linkPlaceholderPattern = /__LINK_\d+__/g;
    const brokenLinks = body.match(linkPlaceholderPattern);
    if (brokenLinks) {
      errors.push({
        file: filename,
        issue: `Found broken link placeholders: ${brokenLinks.join(', ')}`,
        severity: 'error',
      });
    }

    // Check for malformed markdown links
    const lines = body.split('\n');
    lines.forEach((line, idx) => {
      // Detect unmatched brackets in links
      const unmatchedBracket = /\[([^\]]+)\([^)]*$|\[([^\]]*$)/;
      if (unmatchedBracket.test(line)) {
        errors.push({
          file: filename,
          line: idx + 1,
          issue: 'Malformed markdown link (unmatched brackets)',
          severity: 'error',
        });
      }

      // Detect links with missing URL
      const emptyLink = /\[([^\]]+)\]\(\s*\)/;
      if (emptyLink.test(line)) {
        errors.push({
          file: filename,
          line: idx + 1,
          issue: 'Markdown link with empty URL',
          severity: 'error',
        });
      }
    });

    // Check for common AI writing patterns (warnings, not errors)
    const aiPatterns = [
      { pattern: /—/g, name: 'em-dash (—)' },
      { pattern: /It's not .+, it's .+\./gi, name: '"It\'s not X, it\'s Y" construction' },
      { pattern: /The (key|insight) is (simple|clear):/gi, name: '"The key/insight is..." framing' },
    ];

    aiPatterns.forEach(({ pattern, name }) => {
      const matches = body.match(pattern);
      if (matches && matches.length > 2) {
        errors.push({
          file: filename,
          issue: `Potential AI writing pattern detected: ${name} (${matches.length} occurrences)`,
          severity: 'warning',
        });
      }
    });
  } catch (err) {
    errors.push({
      file: filename,
      issue: `Failed to parse file: ${err}`,
      severity: 'error',
    });
  }
}

/**
 * Run validation on all blog posts
 */
function validateAll(): void {
  console.log('🔍 Validating blog content...\n');

  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`❌ Blog directory not found: ${BLOG_DIR}`);
    process.exit(1);
  }

  const blogFiles = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => path.join(BLOG_DIR, f))
    .sort();

  console.log(`Found ${blogFiles.length} blog posts\n`);

  for (const filePath of blogFiles) {
    validateBlogPost(filePath);
  }

  // Report results
  const errorCount = errors.filter((e) => e.severity === 'error').length;
  const warningCount = errors.filter((e) => e.severity === 'warning').length;

  if (errors.length === 0) {
    console.log('✅ All blog posts validated successfully!\n');
    process.exit(0);
  }

  // Group errors by file
  const errorsByFile: Record<string, ValidationError[]> = {};
  errors.forEach((err) => {
    if (!errorsByFile[err.file]) {
      errorsByFile[err.file] = [];
    }
    errorsByFile[err.file].push(err);
  });

  // Print errors
  Object.entries(errorsByFile).forEach(([file, fileErrors]) => {
    console.log(`\n📄 ${file}:`);
    fileErrors.forEach((err) => {
      const icon = err.severity === 'error' ? '❌' : '⚠️';
      const location = err.line ? ` (line ${err.line})` : '';
      console.log(`  ${icon} ${err.issue}${location}`);
    });
  });

  console.log(`\n📊 Summary:`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Warnings: ${warningCount}`);

  if (errorCount > 0) {
    console.log('\n❌ Validation failed. Fix errors before committing.\n');
    process.exit(1);
  } else {
    console.log('\n⚠️  Warnings found. Review before committing.\n');
    process.exit(0);
  }
}

// Run validation
validateAll();
