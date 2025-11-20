/**
 * 文档API的Mock数据
 * 用于开发和测试
 */

import { Doc, DocCategory, DocsResponse, CategoriesResponse } from '@/lib/api/docs';

// Mock文档数据
export const mockDocs: Doc[] = [
  {
    id: '1',
    title: 'Next.js 入门指南',
    content: '这是一篇关于Next.js的入门指南...',
    category: '前端开发',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'backlighting',
    tags: ['Next.js', 'React', '前端']
  },
  {
    id: '2',
    title: 'TypeScript 最佳实践',
    content: '这是一篇关于TypeScript最佳实践的文章...',
    category: '前端开发',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    author: 'backlighting',
    tags: ['TypeScript', '最佳实践']
  },
  {
    id: '3',
    title: 'Node.js 服务端开发',
    content: '这是一篇关于Node.js服务端开发的文章...',
    category: '后端开发',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    author: 'backlighting',
    tags: ['Node.js', '后端', 'JavaScript']
  },
  {
    id: '4',
    title: 'Docker 容器化部署',
    content: '这是一篇关于Docker容器化部署的文章...',
    category: '运维部署',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
    author: 'backlighting',
    tags: ['Docker', '容器化', '部署']
  },
  {
    id: '5',
    title: 'React Hooks 深入理解',
    content: '这是一篇关于React Hooks的深入理解文章...',
    category: '前端开发',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    author: 'backlighting',
    tags: ['React', 'Hooks', '前端']
  }
];

// Mock分类数据
export const mockCategories: DocCategory[] = [
  {
    id: '1',
    name: '前端开发',
    description: '前端开发相关技术文档',
    count: 3
  },
  {
    id: '2',
    name: '后端开发',
    description: '后端开发相关技术文档',
    count: 1
  },
  {
    id: '3',
    name: '运维部署',
    description: '运维和部署相关文档',
    count: 1
  }
];

// Mock API响应函数
export const mockDocsApi = {
  // 获取所有文档
  getAllDocs: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): DocsResponse => {
    let filteredDocs = [...mockDocs];
    
    // 搜索过滤
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => 
        doc.title.toLowerCase().includes(searchLower) ||
        doc.content.toLowerCase().includes(searchLower) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // 分页
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDocs = filteredDocs.slice(startIndex, endIndex);
    
    return {
      docs: paginatedDocs,
      total: filteredDocs.length,
      page,
      pageSize
    };
  },

  // 根据分类获取文档
  getDocsByCategory: (categoryName: string, params?: {
    page?: number;
    pageSize?: number;
  }): DocsResponse => {
    const filteredDocs = mockDocs.filter(doc => doc.category === categoryName);
    
    // 分页
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDocs = filteredDocs.slice(startIndex, endIndex);
    
    return {
      docs: paginatedDocs,
      total: filteredDocs.length,
      page,
      pageSize
    };
  },

  // 获取分类列表
  getCategories: (): CategoriesResponse => {
    return {
      categories: mockCategories
    };
  },

  // 根据ID获取文档
  getDocById: (id: string): Doc | null => {
    return mockDocs.find(doc => doc.id === id) || null;
  },

  // 搜索文档
  searchDocs: (query: string, params?: {
    category?: string;
    page?: number;
    pageSize?: number;
  }): DocsResponse => {
    let filteredDocs = [...mockDocs];
    
    // 分类过滤
    if (params?.category) {
      filteredDocs = filteredDocs.filter(doc => doc.category === params.category);
    }
    
    // 搜索过滤
    const searchLower = query.toLowerCase();
    filteredDocs = filteredDocs.filter(doc => 
      doc.title.toLowerCase().includes(searchLower) ||
      doc.content.toLowerCase().includes(searchLower) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
    
    // 分页
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDocs = filteredDocs.slice(startIndex, endIndex);
    
    return {
      docs: paginatedDocs,
      total: filteredDocs.length,
      page,
      pageSize
    };
  }
};