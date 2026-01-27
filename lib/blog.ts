import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { decodeHtmlEntities } from './html-entities';

const blogDir = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags: string[];
}

export function getBlogPosts(): BlogPost[] {
  const filenames = fs.readdirSync(blogDir);

  const posts = filenames.map((filename) => {
    const filePath = path.join(blogDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(/\.mdx$/, ''),
      title: decodeHtmlEntities(data.title || ''),
      date: data.date,
      summary: data.summary ? decodeHtmlEntities(data.summary) : undefined,
      tags: (data.tags as string[]) || [],
    };
  });

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getRecentPosts(count: number = 3): BlogPost[] {
  return getBlogPosts().slice(0, count);
}
