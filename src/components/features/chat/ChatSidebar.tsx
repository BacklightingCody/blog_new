'use client';

import { useState } from 'react';
import { Plus, Search, MessageSquare, Trash2, Edit3, MoreHorizontal, Pin, Archive, Hash, Users, Lock, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChatSession } from '@/zustand/stores/chatStore';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onCreateSession: (sessionType?: 'public' | 'private') => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  onTogglePin: (sessionId: string) => void;
  onChangeSessionType: (sessionId: string, sessionType: 'public' | 'private') => void;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onCreateSession,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onTogglePin,
  onChangeSessionType
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [publicExpanded, setPublicExpanded] = useState(true);
  const [privateExpanded, setPrivateExpanded] = useState(true);

  // 按类型分组会话
  const groupedSessions = sessions.reduce((groups, session) => {
    const type = session.sessionType || 'private';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(session);
    return groups;
  }, {} as Record<string, ChatSession[]>);

  // 过滤和排序会话
  const filterAndSortSessions = (sessionList: ChatSession[]) => {
    return sessionList
      .filter(session =>
        session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.messages.some(msg => 
          typeof msg.content === 'string' && 
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .sort((a, b) => {
        // 置顶会话优先
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        // 按更新时间排序
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  };

  const publicSessions = filterAndSortSessions(groupedSessions.public || []);
  const privateSessions = filterAndSortSessions(groupedSessions.private || []);

  // 开始编辑会话名称
  const startEditing = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditingName(session.name);
  };

  // 保存编辑
  const saveEdit = () => {
    if (editingSessionId && editingName.trim()) {
      onRenameSession(editingSessionId, editingName.trim());
    }
    setEditingSessionId(null);
    setEditingName('');
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingSessionId(null);
    setEditingName('');
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}小时前`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}天前`;
    
    return date.toLocaleDateString('zh-CN', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // 获取会话预览文本
  const getSessionPreview = (session: ChatSession) => {
    if (session.messages.length === 0) return '新对话';
    
    const lastMessage = session.messages[session.messages.length - 1];
    const content = typeof lastMessage.content === 'string' 
      ? lastMessage.content 
      : '多媒体消息';
    
    return content.length > 60 ? content.substring(0, 60) + '...' : content;
  };

  // 获取会话状态颜色
  const getSessionStatusColor = (session: ChatSession) => {
    const messageCount = session.messages.length;
    if (messageCount === 0) return 'bg-gray-100 text-gray-600';
    if (messageCount < 5) return 'bg-blue-100 text-blue-600';
    if (messageCount < 15) return 'bg-green-100 text-green-600';
    return 'bg-purple-100 text-purple-600';
  };

  // 渲染会话项
  const renderSessionItem = (session: ChatSession, index: number) => (
    <div
      key={session.id}
      className={cn(
        "group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border",
        "hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5",
        currentSessionId === session.id
          ? "to-purple-50/80 border-primary/20 shadow-md shadow-primary/10"
          : "hover:bg-muted/40 border-transparent hover:border-border/50",
        session.pinned && "ring-1 ring-yellow-200 bg-yellow-50/30"
      )}
      onClick={() => onSelectSession(session.id)}
      style={{
        animationDelay: `${Math.min(index * 50, 300)}ms`
      }}
    >
      {/* 置顶标识 */}
      {session.pinned && (
        <div className="absolute top-2 right-2">
          <Pin className="w-3 h-3 text-yellow-600 fill-current" />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-2">
          {/* 会话名称 */}
          {editingSessionId === session.id ? (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              className="h-7 text-sm font-medium border-none p-0 focus:ring-1 focus:ring-primary/50 rounded"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className="font-semibold text-sm truncate mb-2 group-hover:text-primary transition-colors">
              {session.name}
            </h3>
          )}
          
          {/* 会话元信息 */}
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant="secondary" 
              className={cn("text-xs px-2 py-0.5 rounded-full", getSessionStatusColor(session))}
            >
              {session.messages.length} 条消息
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTime(session.updatedAt)}
            </span>
          </div>

          {/* 会话预览 */}
          <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {getSessionPreview(session)}
          </p>

          {/* 标签 */}
          {session.tags && session.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Hash className="w-3 h-3 text-muted-foreground/50" />
              <div className="flex gap-1">
                {session.tags.slice(0, 2).map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
                {session.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    +{session.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 操作菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-7 w-7 p-0 hover:bg-background/80 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                startEditing(session);
              }}
              className="text-sm"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              重命名
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(session.id);
              }}
              className="text-sm"
            >
              <Pin className="w-4 h-4 mr-2" />
              {session.pinned ? '取消置顶' : '置顶对话'}
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                const newType = session.sessionType === 'public' ? 'private' : 'public';
                onChangeSessionType(session.id, newType);
              }}
              className="text-sm"
            >
              {session.sessionType === 'public' ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  转为私人对话
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  转为共享对话
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="text-sm text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              删除对话
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="w-80 h-full border-r bg-gradient-to-b from-background to-muted/20 flex flex-col">
      {/* 头部区域 */}
      <div className="p-4 border-b bg-background/95 backdrop-blur-sm">
        <div className="space-y-3">
          {/* 新建对话按钮 */}
          <div className="flex gap-2">
            <Button
              onClick={() => onCreateSession('private')}
              className="flex-1 h-11 bg-theme-primary text-white cursor-pointer hover:bg-theme-accent transition-all duration-300 rounded-xl font-medium"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              新建对话
            </Button>
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="搜索对话内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-background/80 border-muted-foreground/20 focus:border-primary/50 transition-all duration-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 会话列表 */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* 共享对话组 */}
          <Collapsible open={publicExpanded} onOpenChange={setPublicExpanded}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                {publicExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">共享对话</span>
                <Badge variant="secondary" className="text-xs">
                  {publicSessions.length}
                </Badge>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {publicSessions.length > 0 ? (
                publicSessions.map((session, index) => renderSessionItem(session, index))
              ) : (
                <div className="text-center py-6 px-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    暂无共享对话
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    可将私人对话转为共享
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* 私人对话组 */}
          <Collapsible open={privateExpanded} onOpenChange={setPrivateExpanded}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                {privateExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">私人对话</span>
                <Badge variant="secondary" className="text-xs">
                  {privateSessions.length}
                </Badge>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {privateSessions.length > 0 ? (
                privateSessions.map((session, index) => renderSessionItem(session, index))
              ) : (
                <div className="text-center py-6 px-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/30 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    暂无私人对话
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    点击上方按钮创建新对话
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* 空状态 */}
          {sessions.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {searchQuery ? '未找到匹配的对话' : '还没有对话记录'}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {searchQuery ? '尝试使用其他关键词搜索' : '点击上方按钮开始新的对话'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 底部统计信息 */}
      <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>共 {sessions.length} 个对话</span>
          {searchQuery && (
            <span>找到 {publicSessions.length + privateSessions.length} 个结果</span>
          )}
        </div>
      </div>
    </div>
  );
}