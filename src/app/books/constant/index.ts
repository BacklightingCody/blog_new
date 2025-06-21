'use client'
import { BookOpen, Code, BookText, Sparkles, X } from "lucide-react"
import { useFixedId } from '@/hooks'
export const categories = [
  { key: "programming", label: "编程", icon: Code },
  { key: "novels", label: "小说", icon: BookText },
  { key: "philosophy", label: "哲学", icon: Sparkles },
]

const bookList = {
  programming: [
    {
      id: 1,
      title: "JavaScript权威指南",
      cover: "/books/programming/Javascript权威指南.avif",
      progress: 80,
      description:
        "《JavaScript权威指南》被誉为“犀牛书”，是前端开发者的必备参考书。它系统讲解了JavaScript的基础语法、对象、函数、正则表达式、DOM和事件等，同时深入解析闭包、原型链、异步编程等高级概念。书中不仅涵盖了语言规范，还提供了大量实用示例和最佳实践，对于想要全面掌握JavaScript、提升开发水平的读者来说，这本书是不可或缺的。",
      author: "David Flanagan",
      tags: ["JavaScript", "前端开发", "权威指南"],
    },
    {
      id: 2,
      title: "JavaScript高级程序设计",
      cover: "/books/programming/javascript高级程序设计.avif",
      progress: 80,
      description:
        "《JavaScript高级程序设计》以全面而细致的方式，介绍了JavaScript的语言核心、浏览器环境和最新标准。它包括面向对象编程、函数式编程、事件处理、DOM操作、BOM、异步编程、模块化和ES6+新特性。书中大量代码示例和实践技巧有助于读者快速理解和应用，是提升JavaScript编程能力、迈向中高级开发的权威指南，被誉为“红宝书”。",
      author: "Nicholas C. Zakas",
      tags: ["JavaScript", "前端开发", "高级技巧"],
    },
    {
      id: 3,
      title: "你不知道的JavaScript（卷1）",
      cover: "/books/programming/你不知道的JavaScript上卷.avif",
      progress: 80,
      description:
        "本书专注于JavaScript的核心机制，如作用域、闭包、this、原型链等。作者通过清晰的讲解、直观的代码示例和实际场景，带领读者深入理解JavaScript运行背后的原理，帮助读者摆脱表层语法的束缚，真正理解语言本质。它适合有一定JavaScript基础、希望提升到更高水平的开发者。",
      author: "Kyle Simpson",
      tags: ["JavaScript", "进阶学习", "语言机制"],
    },
    {
      id: 4,
      title: "你不知道的JavaScript（卷2）",
      cover: "/books/programming/你不知道的JavaScript中卷.avif",
      progress: 80,
      description:
        "延续前一卷的深入分析，本卷聚焦JavaScript中的异步编程，包括回调、Promise、生成器、协程等内容。作者通过丰富的实例和清晰的讲解，帮助读者掌握并发、事件循环、异步流程控制等概念。适合希望深入理解现代JavaScript中异步机制的开发者，提升在实际项目中的问题解决能力。",
      author: "Kyle Simpson",
      tags: ["JavaScript", "异步编程", "进阶"],
    },
    {
      id: 5,
      title: "你不知道的JavaScript（卷3）",
      cover: "/books/programming/你不知道的JavaScript下卷.avif",
      progress: 80,
      description:
        "本卷主要讲述ES6及之后的JavaScript新特性，包括模块、类、箭头函数、迭代器、生成器、Proxy、Symbol等。作者通过实用案例和深入剖析，帮助读者掌握这些特性的使用场景及实现原理，使读者能够编写出更加现代、高效、易维护的JavaScript代码。",
      author: "Kyle Simpson",
      tags: ["JavaScript", "ES6+", "新特性"],
    },
    {
      id: 6,
      title: "Vue.js的设计与实现",
      cover: "/books/programming/Vue.js设计与实现.avif",
      progress: 100,
      description:
        "这本书全面解析了Vue.js的内部实现，包括响应式系统、虚拟DOM、模板编译、组件机制、依赖收集和调度机制。通过源码级的讲解和图示，帮助读者理解Vue背后的设计思想及工程实现。无论是框架开发者还是想深入掌握Vue的前端工程师，都能从中获得系统化的知识。",
      author: "尤雨溪",
      tags: ["Vue.js", "前端框架", "设计原理"],
    },
    {
      id: 7,
      title: "坐标React星：React核心思维模型",
      cover: "/books/programming/坐标React星-React核心思维模型.avif",
      progress: 100,
      description:
        "本书深入讲解React的组件化、声明式UI、Hooks、状态管理、虚拟DOM及调和算法。它帮助读者理解React设计背后的理念，掌握构建复杂应用的核心技能。适合希望系统掌握React、优化应用性能和开发效率的前端开发者。",
      author: "Dan Abramov",
      tags: ["React", "前端框架", "最佳实践"],
    },
    {
      id: 8,
      title: "React学习手册（第二版）",
      cover: "/books/programming/React学习手册（第二版）.avif",
      progress: 90,
      description:
        "《React学习手册》涵盖从基础到进阶的React知识，包括JSX、组件、Hooks、Context、React Router、状态管理、测试及性能优化。通过实战案例，作者带领读者一步步构建现代前端应用，是React开发者不可或缺的学习资料。",
      author: "Robin Wieruch",
      tags: ["React", "前端开发", "学习指南"],
    },
  ],
  novels: [
    {
      id: 9,
      title: "十日终焉",
      cover: "/books/novel/default.jpg",
      progress: 100,
      description:
        "当我以为这只是寻常的一天时，却发现自己被捉到了终焉之地。\n当我以为只需要不断的参加死亡游戏就可以逃脱时，却发现众人开始觉醒超自然之力。\n当我以为这里是「造神之地」时,一切却又奔着湮灭走去",
      author: "杀虫队队员",
      tags: ["末世", "科幻", "求生"],
    },
    {
      id: 10,
      title: "我不是戏神",
      cover: "/books/novel/default.jpg",
      progress: 100,
      description:
        `赤色流星划过天际后，人类文明陷入停滞，从那天起，人们再也无法制造一枚火箭，一颗核弹,一架飞机,一台汽车....近代科学堆砌而成的文明金字塔轰然坍塌，而灾难，远不止此。\n 灰色的世界随着赤色流星降临,像是镜面后的鬼魅倒影，将文明世界一点点拖入无序的深渊。\n 在这个时代，人命渺如尘埃； \n 在这个时代，人类灿若星辰。\n大厦将倾,有人见一戏子屹立文明废墟之上,红帔似血，时笑时哭，时代的帘幕在他身后缓缓打开,他张开双臂，对着累累众生轻声低语-好戏.…开场。`,
      author: "三九音域",
      tags: ["都市", "逆袭", "娱乐圈"],
    },
    {
      id: 11,
      title: "我在精神病院学斩神",
      cover: "/books/novel/default.jpg",
      progress: 30,
      description:
        "你是否想过,在霓虹璀璨的都市之下,潜藏着来自古老神话的怪物?\n你是否想过,在那高悬于世人头顶的月亮之上，伫立着守望人间的神明?\n你是否想过,在人潮汹涌的现代城市之中,存在代替神明行走人间的超凡之人?\n人类统治的社会中，潜伏着无数诡异;在那些无人问津的生命禁区，居住着古老的神明。而属于大夏的神明，究竟去了何处?\n在这属于“人”的世界，“神秘”需要被肃清!",
      author: "三九音域",
      tags: ["都市", "悬疑", "异能"],
    },
    {
      id: 12,
      title: "万古神帝",
      cover: "/books/novel/default.jpg",
      progress: 100,
      description:
        "一个从地狱般修炼中崛起的少年，誓要打破万古枷锁，称霸诸天万界，镇压一切敌手。",
      author: "飞天鱼",
      tags: ["玄幻", "修炼", "热血"],
    },
    {
      id: 13,
      title: "龙王出狱",
      cover: "/books/novel/default.jpg",
      progress: 100,
      description:
        "他曾是令世界颤抖的龙王，为爱归隐。多年后，家族欺辱、至亲蒙冤，他强势出狱，王者归来！",
      author: "会说话的香烟",
      tags: ["都市", "逆袭", "热血"],
    },
    {
      id: 14,
      title: "龙王出狱",
      cover: "/books/novel/default.jpg",
      progress: 100,
      description:
        "他曾是令世界颤抖的龙王，为爱归隐。多年后，家族欺辱、至亲蒙冤，他强势出狱，王者归来！",
      author: "会说话的香烟",
      tags: ["都市", "逆袭", "热血"],
    },
    {
      id: 15,
      title: "诸神愚戏",
      cover: "/books/novel/default.jpg",
      progress: 0,
      description:
        "《诸神愚戏》是一部奇幻题材小说，讲述少年主角在众神主宰的世界中觉醒力量、逆天改命的热血成长故事。剧情跌宕起伏，融合冒险、斗争与成长元素，深受玄幻读者喜爱。",
      author: "番茄小说作者",
      tags: ["玄幻", "奇幻冒险", "成长"],
    },
    {
      id: 16,
      title: "斗破苍穹",
      cover: "/books/novel/default.jpg",
      progress: 100,
      description:
        "《斗破苍穹》讲述了天才少年萧炎自废、逆袭、称霸斗气大陆的故事。小说世界观庞大，设定独特，战斗场面热血澎湃，被誉为网络玄幻巅峰之作。",
      author: "天蚕土豆",
      tags: ["玄幻", "热血", "成长逆袭"],
    },
    {
      id: 17,
      title: "斗罗大陆",
      cover: "/books/novel/default.jpg",
      progress: 100,
      description:
        "《斗罗大陆》讲述唐三穿越到斗罗大陆，凭借双生武魂一路成长、问鼎巅峰的故事。小说设定丰富、战斗精彩，深受青少年读者喜爱。",
      author: "唐家三少",
      tags: ["玄幻", "武魂", "成长冒险"],
    },
    {
      id: 18,
      title: "完美世界",
      cover: "/books/novel/default.jpg",
      progress: 100,
      description:
        "《完美世界》是一部讲述石昊横扫万族、追求完美大道的热血玄幻小说。作者以磅礴的世界观、惊心动魄的战斗场面构建出一个瑰丽多彩的修炼世界。",
      author: "辰东",
      tags: ["玄幻", "修炼", "热血争霸"],
    },
    {
      id: 19,
      title: "遮天",
      cover: "/books/novel/default.jpg",
      progress: 100,
      description:
        "《遮天》围绕叶凡和他的伙伴探索星空、登临仙路、逆天改命的冒险之旅展开。小说情节跌宕起伏，仙侠与玄幻完美结合，被誉为网络小说经典之作。",
      author: "辰东",
      tags: ["仙侠", "玄幻", "热血冒险"],
    },
    {
      id: 20,
      title: "圣墟",
      cover: "/books/novel/default.jpg",
      progress: 100,
      description:
        "《圣墟》讲述主角楚风在一个复苏的末世探索前世因果、踏上巅峰之路的故事。小说融合热血、悬疑与神秘元素，构建出一个宏大的修炼世界。",
      author: "辰东",
      tags: ["玄幻", "末世", "热血修炼"],
    },
    {
      id: 21,
      title: "牧神记",
      cover: "/books/novel/default.jpg",
      progress: 100,
      description:
        "《牧神记》讲述了少年秦牧自小村走出，在神魔乱世中成长、探索天地奥秘、成就无上大道的故事。小说文笔细腻，世界观新颖，充满东方奇幻色彩。",
      author: "宅猪",
      tags: ["玄幻", "神魔", "成长冒险"],
    }

  ],
}
export const books = {
  programming: bookList.programming.map((book) => ({
    ...book,
    id: useFixedId(book.title),
  })),
  novels: bookList.novels.map((book) => ({
    ...book,
    id: useFixedId(book.title),
  })),
}