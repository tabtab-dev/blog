// 内容集合配置
import { defineCollection, z } from 'astro:content';

// 博客文章集合定义
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.union([z.string(), z.date()]).transform((val) => {
      if (typeof val === 'string') {
        // 将北京时间字符串解析为Date对象
        // 处理格式：2024-12-19 16:15:00
        const [datePart, timePart] = val.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);
        
        // 创建北京时间对象（注意月份从0开始）
        return new Date(year, month - 1, day, hour, minute, second);
      }
      return val; // 已经是Date对象
    }),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    author: z.string().default('TabTab'),
    draft: z.boolean().default(false),
  }),
});

// 说说集合定义
const shuoShuo = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    pubDate: z.union([z.string(), z.date()]).transform((val) => {
      if (typeof val === 'string') {
        // 将北京时间字符串解析为Date对象
        // 处理格式：2024-12-19 16:15:00
        const [datePart, timePart] = val.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);
        
        // 创建北京时间对象（注意月份从0开始）
        return new Date(year, month - 1, day, hour, minute, second);
      }
      return val; // 已经是Date对象
    }),
    updatedDate: z.date().optional(),
    images: z.array(z.string()).optional(),
    author: z.string().default(''),
    draft: z.boolean().default(false),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    location: z.string().optional(),
  }),
});

export const collections = {
  blog,
  'shuo-shuo': shuoShuo,
};