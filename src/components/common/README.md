# 通用组件 (Common Components)

这个目录包含项目中可复用的基础组件。这些组件通常是对UI组件的简单包装，添加了一些特定于项目的样式或行为。

## 组件列表

### 🎯 动画社交图标组件
- **AnimatedSocialIcons**: 完全可配置的掉落回弹社交图标组件
- **SimpleSocialIcons**: 简化版本，提供预设配置
- 支持从上方掉落回弹入场动画、Hover效果、响应式布局
- 类似"添加购物车"的掉落回弹效果，只执行一次
- 详细文档：[animated-social-icons.md](./animated-social-icons.md)
- 在线演示：[/demo/social-icons](/demo/social-icons)

### 🔐 其他组件
- **OAuth**: OAuth认证组件
- **DropdownMenu**: 下拉菜单组件
- **Signature**: 签名组件

## 组件规范

1. 组件应该是相对独立的，专注于解决单一问题
2. 组件应该有明确的接口和文档
3. 组件应该支持自定义样式和行为
4. 命名应该简洁明了，反映组件的用途
5. 提供TypeScript类型定义
6. 支持无障碍访问标准 