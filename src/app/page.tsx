import ThemeController from "@/components/ui/ThemeController";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">主题系统演示</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="themed-card p-6">
          <h2 className="text-2xl font-semibold mb-4 text-text">主题设置</h2>
          <ThemeController />
        </div>

        <div className="themed-card p-6">
          <h2 className="text-2xl font-semibold mb-4 text-text">效果预览</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-md border border-border-color">
              <h3 className="text-xl font-medium mb-2 text-primary">主要颜色</h3>
              <p className="text-text">文本使用当前主题的文本颜色</p>
              <div className="mt-3 flex space-x-2">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity">
                  按钮
                </button>
                <a href="#" className="themed-link px-4 py-2 border border-primary text-primary rounded-md">
                  链接
                </a>
              </div>
            </div>
            
            <div className="p-4 rounded-md border border-border-color">
              <h3 className="text-xl font-medium mb-2">背景效果</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-primary text-white rounded-md">主题背景</div>
                <div className="p-3 bg-subtle-bg border border-border-color text-text rounded-md">次要背景</div>
              </div>
            </div>
            
            <div className="p-4 rounded-md border border-border-color">
              <h3 className="text-xl font-medium mb-2">链接样式</h3>
              <p className="text-text mb-2">支持更多交互效果:</p>
              <div className="space-x-4">
                <a href="#" className="text-primary themed-link">悬停下划线</a>
                <a href="#" className="text-primary hover:text-opacity-80 transition-all">透明度变化</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
