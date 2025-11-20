/**
 * Demo页面的mock数据
 */
export interface DemoItem {
  id: string;
  title: string;
  description: string;
  href: string;
  coverImage?: string;
  date: string;
  tags?: string[];
}

export const demos: DemoItem[] = [
  {
    id: 'demo-1',
    title: 'React动画效果展示',
    description: '使用Framer Motion实现的流畅动画效果，包括页面过渡、元素动画和交互反馈。',
    href: '/demo/react-animations',
    coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    date: '2024-01-15',
    tags: ['React', 'Animation', 'Framer Motion']
  },
  {
    id: 'demo-2',
    title: 'CSS Grid布局实验',
    description: '探索CSS Grid的强大功能，创建复杂的响应式布局和网格系统。',
    href: '/demo/css-grid-layouts',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    date: '2024-01-12',
    tags: ['CSS', 'Grid', 'Layout', 'Responsive']
  },
  {
    id: 'demo-3',
    title: 'JavaScript性能优化',
    description: '展示各种JavaScript性能优化技巧，包括防抖、节流、虚拟滚动等。',
    href: '/demo/js-performance',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    date: '2024-01-10',
    tags: ['JavaScript', 'Performance', 'Optimization']
  },
  {
    id: 'demo-4',
    title: 'Three.js 3D场景',
    description: '使用Three.js创建交互式3D场景，包括几何体、材质、光照和动画。',
    href: '/demo/threejs-scene',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    date: '2024-01-08',
    tags: ['Three.js', '3D', 'WebGL', 'Animation']
  },
  {
    id: 'demo-5',
    title: 'Canvas绘图实验',
    description: '使用HTML5 Canvas API创建各种绘图效果，包括粒子系统和图形动画。',
    href: '/demo/canvas-drawing',
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop',
    date: '2024-01-05',
    tags: ['Canvas', 'Drawing', 'Particles', 'Animation']
  },
  {
    id: 'demo-6',
    title: 'Web Components实践',
    description: '探索原生Web Components技术，创建可复用的自定义元素。',
    href: '/demo/web-components',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    date: '2024-01-03',
    tags: ['Web Components', 'Custom Elements', 'Shadow DOM']
  },
  {
    id: 'demo-7',
    title: 'PWA应用示例',
    description: '构建渐进式Web应用，支持离线访问、推送通知和应用安装。',
    href: '/demo/pwa-example',
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    date: '2024-01-01',
    tags: ['PWA', 'Service Worker', 'Offline', 'Mobile']
  },
  {
    id: 'demo-8',
    title: 'WebRTC视频通话',
    description: '实现基于WebRTC的实时视频通话功能，支持多人会议和屏幕共享。',
    href: '/demo/webrtc-video',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    date: '2023-12-28',
    tags: ['WebRTC', 'Video', 'Real-time', 'Communication']
  },
  {
    id: 'demo-9',
    title: 'D3.js数据可视化',
    description: '使用D3.js创建交互式数据可视化图表，包括柱状图、折线图和力导向图。',
    href: '/demo/d3-visualization',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    date: '2023-12-25',
    tags: ['D3.js', 'Data Visualization', 'Charts', 'Interactive']
  },
  {
    id: 'demo-10',
    title: 'WebGL着色器实验',
    description: '探索WebGL着色器编程，创建各种视觉效果和图形渲染技术。',
    href: '/demo/webgl-shaders',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    date: '2023-12-22',
    tags: ['WebGL', 'Shaders', 'Graphics', 'GLSL']
  },
  {
    id: 'demo-11',
    title: 'React Hook Form表单',
    description: '使用React Hook Form构建高性能表单，包括验证、条件渲染和动态字段。',
    href: '/demo/react-hook-form',
    coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
    date: '2023-12-20',
    tags: ['React', 'Forms', 'Validation', 'Hook Form']
  },
  {
    id: 'demo-12',
    title: 'Tailwind CSS组件库',
    description: '基于Tailwind CSS构建的可复用组件库，包括按钮、卡片、模态框等。',
    href: '/demo/tailwind-components',
    coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    date: '2023-12-18',
    tags: ['Tailwind CSS', 'Components', 'UI Library', 'Design System']
  }
];