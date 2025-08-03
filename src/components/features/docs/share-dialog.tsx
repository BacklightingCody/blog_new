/**
 * 文章分享对话框组件
 * 支持多种分享方式
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Copy, 
  Check, 
  Share2,
  MessageCircle,
  Mail,
  Link,
  QrCode,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Article } from '@/types/article';
import QRCode from 'qrcode';

interface ShareDialogProps {
  article: Article;
  onClose: () => void;
}

export function ShareDialog({ article, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState(false);

  // 生成文章链接
  const articleUrl = `${window.location.origin}/docs/${article.category}/${article.slug}`;
  
  // 生成分享文本
  const shareText = `推荐一篇好文章：《${article.title}》\n\n${article.summary || article.content.substring(0, 100)}...\n\n阅读链接：${articleUrl}`;

  // 复制链接
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 复制分享文本
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 生成二维码
  const handleGenerateQrCode = async () => {
    try {
      const qrUrl = await QRCode.toDataURL(articleUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrUrl);
      setShowQrCode(true);
    } catch (error) {
      console.error('生成二维码失败:', error);
    }
  };

  // 下载二维码
  const handleDownloadQrCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${article.title}-二维码.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 分享到社交平台
  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(articleUrl);
    const encodedText = encodeURIComponent(`《${article.title}》 - ${article.summary || ''}`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'wechat':
        // 微信分享通常需要特殊处理，这里只是示例
        alert('请复制链接后在微信中分享');
        handleCopyLink();
        break;
      case 'weibo':
        shareUrl = `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedText}`;
        break;
      case 'qq':
        shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedText}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedText}&body=${encodeURIComponent(shareText)}`;
        break;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md mx-4"
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  分享文章
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* 文章信息 */}
              <div className="p-6 pb-4 space-y-2">
                <h4 className="font-medium line-clamp-2">{article.title}</h4>
                {article.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.summary}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {article.viewCount} 次阅读
                  </span>
                </div>
              </div>

              <Separator />

              {/* Tab 布局 */}
              <Tabs defaultValue="link" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mt-4">
                  <TabsTrigger value="link" className="gap-2">
                    <Link className="h-4 w-4" />
                    链接
                  </TabsTrigger>
                  <TabsTrigger value="social" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    社交
                  </TabsTrigger>
                  <TabsTrigger value="qrcode" className="gap-2">
                    <QrCode className="h-4 w-4" />
                    二维码
                  </TabsTrigger>
                </TabsList>

                {/* 链接分享 */}
                <TabsContent value="link" className="px-6 pb-6 space-y-4">
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">复制链接</h5>
                    <div className="flex gap-2">
                      <Input
                        value={articleUrl}
                        readOnly
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyLink}
                        className="gap-2 shrink-0"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            复制
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">分享文本</h5>
                    <div className="bg-muted p-3 rounded-md text-sm max-h-24 overflow-y-auto">
                      <p>{shareText}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyText}
                      className="gap-2 w-full"
                    >
                      <Copy className="h-4 w-4" />
                      复制分享文本
                    </Button>
                  </div>
                </TabsContent>

                {/* 社交分享 */}
                <TabsContent value="social" className="px-6 pb-6">
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">分享到社交平台</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSocialShare('wechat')}
                        className="gap-2 h-12"
                      >
                        <MessageCircle className="h-5 w-5" />
                        微信
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSocialShare('weibo')}
                        className="gap-2 h-12"
                      >
                        <Share2 className="h-5 w-5" />
                        微博
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSocialShare('qq')}
                        className="gap-2 h-12"
                      >
                        <MessageCircle className="h-5 w-5" />
                        QQ
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSocialShare('email')}
                        className="gap-2 h-12"
                      >
                        <Mail className="h-5 w-5" />
                        邮件
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* 二维码分享 */}
                <TabsContent value="qrcode" className="px-6 pb-6">
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium">二维码分享</h5>
                    {!showQrCode ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateQrCode}
                        className="gap-2 w-full h-12"
                      >
                        <QrCode className="h-5 w-5" />
                        生成二维码
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <img
                            src={qrCodeUrl}
                            alt="文章二维码"
                            className="border rounded-md"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadQrCode}
                          className="gap-2 w-full"
                        >
                          <Download className="h-4 w-4" />
                          下载二维码
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}