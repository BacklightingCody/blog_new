'use client';

import { useState } from 'react';
import { Settings, Trash2, Share2, Download, MoreHorizontal, Sparkles, Zap, Brain, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatSession } from '@/zustand/stores/chatStore';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  currentSession: ChatSession | null;
  onClearMessages: () => void;
  onShowSettings: () => void;
  onShareSession?: () => void;
  onExportSession?: () => void;
  onToggleSidebar?: () => void;
}

export function ChatHeader({
  currentSession,
  onClearMessages,
  onShowSettings,
  onShareSession,
  onExportSession,
  onToggleSidebar
}: ChatHeaderProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 获取模型显示信息
  const getModelInfo = (modelName: string) => {
    const modelMap: Record<string, { name: string; icon: React.ReactNode; color: string }> = {
      'gemini-2.0-flash': { 
        name: 'Gemini 2.0 Flash', 
        icon: <Sparkles className="w-3 h-3" />, 
        color: 'bg-indigo-100 text-indigo-700 border-indigo-200' 
      }
    };
    return modelMap[modelName] || { 
      name: modelName, 
      icon: <Brain className="w-3 h-3" />, 
      color: 'bg-gray-100 text-gray-700 border-gray-200' 
    };
  };

  // 获取会话状态
  const getSessionStatus = () => {
    if (!currentSession) return null;
    
    const messageCount = currentSession.messages.length;
    const lastActivity = new Date(currentSession.updatedAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60));

    if (messageCount === 0) {
      return { 
        text: '新对话', 
        color: 'bg-blue-50 text-blue-600 border-blue-200',
        pulse: true 
      };
    }
    
    if (currentSession.isModelCompare) {
      return {
        text: '对比模式',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        pulse: true,
      };
    }
    if (diffInMinutes < 5) {
      return { 
        text: '活跃中', 
        color: 'bg-green-50 text-green-600 border-green-200',
        pulse: true 
      };
    }
    
    if (diffInMinutes < 60) {
      return { 
        text: `${diffInMinutes}分钟前`, 
        color: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        pulse: false 
      };
    }
    
    return { 
      text: '历史对话', 
      color: 'bg-gray-50 text-gray-600 border-gray-200',
      pulse: false 
    };
  };

  // 格式化创建时间
  const formatCreatedTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentSession) {
    return (
      <div className="h-16 border-b bg-gradient-to-r from-background via-background to-muted/20 flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">请选择或创建一个对话</span>
        </div>
      </div>
    );
  }

  const sessionStatus = getSessionStatus();
  const modelInfo = getModelInfo(currentSession.modelConfig.model);

  return (
    <div 
      className={cn(
        "h-16 border-b bg-gradient-to-r from-background via-background to-muted/20 transition-all duration-300",
        isHovered && "from-background via-muted/10 to-muted/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* 左侧：折叠按钮 + 会话信息 */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* {onToggleSidebar && (
            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-lg cursor-pointer" onClick={onToggleSidebar}>
              <span className="text-sm">侧边栏</span>
            </Button>
          )} */}
          {/* 会话头像 */}
          <div className="relative">
            <Avatar className="w-10 h-10 border-2 border-background shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {currentSession.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* {sessionStatus?.pulse && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
            )} */}
          </div>

          {/* 会话详情 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-bold text-lg truncate text-foreground max-w-xs">
                {currentSession.name}
              </h1>
              
              {sessionStatus && (
                <Badge 
                  variant="outline" 
                  className={cn("text-xs px-2 py-1 font-medium border", sessionStatus.color)}
                >
                  {sessionStatus.text}
                </Badge>
              )}

              {currentSession.pinned && (
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                  置顶
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* 模型信息 */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-xs px-2 py-1 border", modelInfo.color)}>
                  {modelInfo.icon}
                  <span className="ml-1">{modelInfo.name}</span>
                </Badge>
                {/* <span className="text-xs">•</span> */}
                {/* <span className="text-xs">温度 {currentSession.modelConfig.temperature}</span> */}
              </div>
              
              {/* 消息统计 */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs">•</span>
                <span className="text-xs">{currentSession.messages.length} 条消息</span>
                <span className="text-xs">•</span>
                <span className="text-xs">创建于 {formatCreatedTime(currentSession.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：操作区域 */}
        <div className="flex items-center gap-2">
          {/* 快捷操作按钮 - 桌面端显示 */}
          <div className="hidden lg:flex items-center gap-1">
            {onShowSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowSettings}
                className="h-9 px-3 rounded-lg cursor-pointer hover:text-theme-primary"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span className="text-sm">设置</span>
              </Button>
            )}
            
            {onShareSession && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShareSession}
                className="h-9 px-3 cursor-pointer hover:text-theme-primary rounded-lg"
              >
                <Share2 className="w-4 h-4 mr-2" />
                <span className="text-sm">分享</span>
              </Button>
            )}
          </div>

          {/* 更多操作菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 cursor-pointer hover:text-theme-primary rounded-lg"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {/* 桌面端隐藏的操作 */}
              <div className="lg:hidden">
                {onShowSettings && (
                  <DropdownMenuItem onClick={onShowSettings}>
                    <Settings className="w-4 h-4 mr-3" />
                    模型设置
                  </DropdownMenuItem>
                )}
                
                {onShareSession && (
                  <DropdownMenuItem onClick={onShareSession}>
                    <Share2 className="w-4 h-4 mr-3" />
                    分享对话
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
              </div>
              
              {onExportSession && (
                <DropdownMenuItem onClick={onExportSession}>
                  <Download className="w-4 h-4 mr-3" />
                  导出对话
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={onClearMessages}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-3" />
                清空消息
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
}