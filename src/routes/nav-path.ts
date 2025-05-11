const navPath = [
  {
    path: '/',          // 首页路由
    name: '首页'        // 路由名称
  },
  {
    path: '/demo',      // demo页面路由
    name: 'Demo'        // 路由名称
  },
  {
    path: '/chat',
    name: 'Chat',
  },
  {
    path: '/docs',
    name: '文稿',
    children: [
      {
        path: '/docs/programming',
        name: '编程'
      },
      {
        path: '/docs/ai',
        name: 'AI'
      },
      {
        path: '/docs/recipe',
        name: '菜谱'
      }
    ]
  },
  {
    path: '/books',
    name: '书栈',
  },
  {
    path: '/about',
    name: '关于',
  }
]

export default navPath;
