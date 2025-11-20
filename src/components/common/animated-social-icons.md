# 掉落回弹社交图标组件使用指南

## 组件介绍

这个组件库提供了两个主要组件：
- `AnimatedSocialIcons`: 完全可配置的掉落回弹社交图标组件
- `SimpleSocialIcons`: 简化版本，提供预设配置

## 动画效果

组件实现了类似“添加购物车”的掉落回弹效果：
1. 图标从上方开始掉落
2. 掉落到低点（图标高度一半的位置）
3. 然后回弹到正常位置

## 动画触发方式

组件支持三种动画触发方式：
- **auto**（默认）：页面加载后自动执行一次
- **hover**：悬停在图标上时触发动画
- **click**：点击容器区域时触发动画（可多次触发）
4. 动画只执行一次，页面加载后触发

## 基本使用

### 1. 简单使用（推荐）

```tsx
import { SimpleSocialIcons } from '@/components/common';
import { LineMdGithub, LineMdTwitter, LineMdTiktok } from '@/components/features/icon';

const icons = [
  {
    id: 'github',
    component: LineMdGithub,
    jumpLink: 'https://github.com/yourname',
    label: 'GitHub Profile'
  },
  {
    id: 'twitter',
    component: LineMdTwitter,
    jumpLink: 'https://twitter.com/yourname',
    label: 'Twitter Profile'
  }
];

// 自动执行（默认）
<SimpleSocialIcons icons={icons} />

// Hover 触发
<SimpleSocialIcons 
  icons={icons} 
  trigger="hover"
  size="large" 
  variant="bouncy" 
/>

// Click 触发
<SimpleSocialIcons 
  icons={icons} 
  trigger="click"
  size="large" 
  variant="bouncy" 
/>

// 垂直布局
<SimpleSocialIcons 
  icons={icons} 
  direction="vertical" 
  variant="smooth" 
/>
```

### 2. 完全自定义配置

```tsx
import { AnimatedSocialIcons } from '@/components/common';

<AnimatedSocialIcons
  icons={icons}
  iconSize={60}
  animationDelay={0.3}
  animationTrigger="hover"
  hoverScale={1.4}
  direction="horizontal"
  gap={24}
  className="hover:text-blue-500"
/>
```

## 配置选项

### SimpleSocialIcons 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| icons | SocialIconData[] | - | 图标数据数组 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 图标尺寸预设 |
| variant | 'default' \| 'bouncy' \| 'smooth' | 'default' | 动画效果预设 |
| direction | 'horizontal' \| 'vertical' | 'horizontal' | 布局方向 |
| trigger | 'auto' \| 'hover' \| 'click' | 'auto' | 动画触发方式 |
| className | string | '' | 自定义样式类 |

### AnimatedSocialIcons 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| icons | SocialIconData[] | - | 图标数据数组 |
| iconSize | number | 50 | 图标大小（像素） |
| animationDelay | number | 0.2 | 每个图标动画延迟（秒） |
| animationTrigger | 'auto' \| 'hover' \| 'click' | 'auto' | 动画触发方式 |
| hoverScale | number | 1.1 | 悬停放大比例 |
| direction | 'horizontal' \| 'vertical' | 'horizontal' | 布局方向 |
| gap | number | 16 | 图标间距（像素） |

### SocialIconData 接口

```tsx
interface SocialIconData {
  id: string; // 唯一标识符
  component: ComponentType<SVGProps<SVGSVGElement>>; // 图标组件
  jumpLink: string; // 跳转链接
  label?: string; // 无障碍标签
}
```

## 预设配置

### 尺寸预设
- `small`: 32px 图标，12px 间距
- `medium`: 50px 图标，16px 间距  
- `large`: 64px 图标，20px 间距

### 变体预设
- `default`: 标准掉落动画，适中悬停效果
- `bouncy`: 更慢的掉落效果，更大的悬停放大
- `smooth`: 更快的掉落动画，较小的悬停效果

## 在现有页面中替换

将原有的静态图标替换为动画图标：

```tsx
// 原有代码
<div className='flex gap-4'>
  {Object.entries(iconMap).map(([key, iconData]) => (
    <a key={key} href={iconData.jumpLink}>
      <Icon icon={iconData.component} size={50} />
    </a>
  ))}
</div>

// 替换为
import { SimpleSocialIcons } from '@/components/common';

const icons = Object.entries(iconMap).map(([key, iconData]) => ({
  id: key,
  component: iconData.component,
  jumpLink: iconData.jumpLink,
  label: `${key} profile`
}));

<SimpleSocialIcons icons={icons} variant="bouncy" />
```

## 响应式支持

组件自动支持响应式布局，可以通过 Tailwind CSS 类进行进一步定制：

```tsx
<SimpleSocialIcons 
  icons={icons}
  size="medium"
  className="sm:text-blue-500 md:text-green-500 lg:text-purple-500"
  direction="vertical"
  // 在小屏幕上可以切换为垂直布局
/>
```

## 无障碍支持

- 自动生成 `aria-label` 属性
- 支持键盘导航
- 提供焦点指示器
- 符合 WCAG 无障碍标准