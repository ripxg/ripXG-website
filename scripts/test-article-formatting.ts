#!/usr/bin/env bun
/**
 * TDD Tests: Article Formatting Quality
 * 
 * Validates that blog articles have proper markdown formatting:
 * - Headers to break up content (h2/h3)
 * - Lists where appropriate
 * - Blockquotes for key insights
 * - Bold for emphasis
 * - Reasonable paragraph lengths
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

interface ArticleAnalysis {
  filename: string;
  title: string;
  wordCount: number;
  paragraphCount: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  listItemCount: number;
  blockquoteCount: number;
  boldCount: number;
  avgParagraphLength: number;
  longParagraphs: number; // paragraphs > 100 words
  issues: string[];
  score: number; // 0-100
}

function analyzeArticle(filepath: string): ArticleAnalysis {
  const filename = path.basename(filepath);
  const fileContent = fs.readFileSync(filepath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);
  
  const lines = content.split('\n');
  const issues: string[] = [];
  
  // Count formatting elements
  const h2Count = (content.match(/^## /gm) || []).length;
  const h3Count = (content.match(/^### /gm) || []).length;
  const h4Count = (content.match(/^#### /gm) || []).length;
  const listItemCount = (content.match(/^[-*] |^\d+\. /gm) || []).length;
  const blockquoteCount = (content.match(/^> /gm) || []).length;
  const boldCount = (content.match(/\*\*[^*]+\*\*/g) || []).length;
  
  // Extract paragraphs (non-empty lines that aren't headers, lists, or blockquotes)
  const paragraphs = lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (/^#{1,4} /.test(trimmed)) return false;
    if (/^[-*] |^\d+\. /.test(trimmed)) return false;
    if (/^> /.test(trimmed)) return false;
    return true;
  });
  
  const paragraphCount = paragraphs.length;
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  
  // Calculate average paragraph length
  const paragraphLengths = paragraphs.map(p => p.split(/\s+/).length);
  const avgParagraphLength = paragraphLengths.length > 0 
    ? paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length 
    : 0;
  
  const longParagraphs = paragraphLengths.filter(len => len > 100).length;
  
  // Scoring and issue detection
  let score = 100;
  
  // Check for headers (articles > 300 words should have at least 1 h2)
  if (wordCount > 300 && h2Count === 0) {
    issues.push('No h2 headers - article needs section breaks');
    score -= 25;
  }
  
  // Check for lists in longer articles
  if (wordCount > 500 && listItemCount === 0) {
    issues.push('No bullet/numbered lists - consider adding for readability');
    score -= 10;
  }
  
  // Check for emphasis
  if (wordCount > 300 && boldCount === 0) {
    issues.push('No bold emphasis - key terms should stand out');
    score -= 10;
  }
  
  // Check for blockquotes (nice to have for key insights)
  if (wordCount > 500 && blockquoteCount === 0) {
    issues.push('No blockquotes - consider highlighting key insights');
    score -= 5;
  }
  
  // Check for very long paragraphs
  if (longParagraphs > 0) {
    issues.push(`${longParagraphs} paragraph(s) over 100 words - break them up`);
    score -= longParagraphs * 5;
  }
  
  // Check header density for long articles
  const totalHeaders = h2Count + h3Count + h4Count;
  if (wordCount > 800 && totalHeaders < 3) {
    issues.push('Low header density for article length - needs more structure');
    score -= 15;
  }
  
  return {
    filename,
    title: frontmatter.title || filename,
    wordCount,
    paragraphCount,
    h2Count,
    h3Count,
    h4Count,
    listItemCount,
    blockquoteCount,
    boldCount,
    avgParagraphLength: Math.round(avgParagraphLength),
    longParagraphs,
    issues,
    score: Math.max(0, score),
  };
}

function runTests(): void {
  console.log('🧪 Article Formatting Tests\n');
  console.log('=' .repeat(70));
  
  const articleFiles = fs
    .readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.md') && f !== '.gitkeep')
    .map(f => path.join(ARTICLES_DIR, f))
    .sort();
  
  let totalScore = 0;
  let passCount = 0;
  let failCount = 0;
  const results: ArticleAnalysis[] = [];
  
  for (const filepath of articleFiles) {
    const analysis = analyzeArticle(filepath);
    results.push(analysis);
    
    const passed = analysis.score >= 70;
    const status = passed ? '✅ PASS' : '❌ FAIL';
    
    if (passed) passCount++;
    else failCount++;
    
    totalScore += analysis.score;
    
    console.log(`\n${status} [${analysis.score}/100] ${analysis.filename}`);
    console.log(`  Title: ${analysis.title}`);
    console.log(`  Words: ${analysis.wordCount} | Paragraphs: ${analysis.paragraphCount} | Avg para length: ${analysis.avgParagraphLength} words`);
    console.log(`  Headers: h2=${analysis.h2Count} h3=${analysis.h3Count} h4=${analysis.h4Count}`);
    console.log(`  Lists: ${analysis.listItemCount} items | Blockquotes: ${analysis.blockquoteCount} | Bold: ${analysis.boldCount}`);
    
    if (analysis.issues.length > 0) {
      console.log(`  Issues:`);
      for (const issue of analysis.issues) {
        console.log(`    ⚠️  ${issue}`);
      }
    }
  }
  
  console.log('\n' + '=' .repeat(70));
  console.log('\n📊 SUMMARY');
  console.log(`  Articles: ${articleFiles.length}`);
  console.log(`  Passed: ${passCount} | Failed: ${failCount}`);
  console.log(`  Average Score: ${Math.round(totalScore / articleFiles.length)}/100`);
  
  if (failCount > 0) {
    console.log('\n❌ Some articles need formatting improvements.\n');
    process.exit(1);
  } else {
    console.log('\n✅ All articles pass formatting requirements!\n');
    process.exit(0);
  }
}

runTests();
