'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface MediaImageProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
  className?: string
}

export function MediaImage({ src, alt, caption, width, height, className }: MediaImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setError(true)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const downloadImage = async () => {
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = alt || 'image'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download image:', err)
    }
  }

  if (error) {
    return (
      <div className="my-6 p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600 text-sm">图片加载失败: {alt}</p>
      </div>
    )
  }

  return (
    <>
      <figure className={`my-6 ${className || ''}`}>
        <div className="relative group">
          {isLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">加载中...</span>
            </div>
          )}
          
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="w-full h-auto rounded-lg shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={toggleFullscreen}
          />
          
          {/* 悬浮工具栏 */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1 bg-black/50 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadImage}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(src, '_blank')}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {caption && (
          <figcaption className="mt-2 text-sm text-muted-foreground text-center italic">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* 全屏模态框 */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={toggleFullscreen}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            ✕
          </Button>
        </div>
      )}
    </>
  )
}

interface MediaVideoProps {
  src: string
  poster?: string
  caption?: string
  width?: number
  height?: number
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}

export function MediaVideo({ 
  src, 
  poster, 
  caption, 
  width, 
  height, 
  autoplay = false, 
  loop = false, 
  muted = false,
  controls = true 
}: MediaVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    
    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    
    if (newVolume === 0) {
      setIsMuted(true)
      video.muted = true
    } else if (isMuted) {
      setIsMuted(false)
      video.muted = false
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <figure className="my-6">
      <div className="relative group bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          width={width}
          height={height}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          className="w-full h-auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {controls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* 进度条 */}
            <div className="mb-3">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
            </div>
            
            {/* 控制按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <div className="w-20">
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

interface MediaGifProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
  autoplay?: boolean
}

export function MediaGif({ src, alt, caption, width, height, autoplay = true }: MediaGifProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [staticSrc, setStaticSrc] = useState<string>('')

  useEffect(() => {
    // 生成静态版本的URL（通常是第一帧）
    if (src.endsWith('.gif')) {
      setStaticSrc(src.replace('.gif', '_static.jpg'))
    }
  }, [src])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <figure className="my-6">
      <div className="relative group">
        <img
          src={isPlaying ? src : staticSrc || src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto rounded-lg shadow-md"
        />
        
        {/* GIF 控制按钮 */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* GIF 标识 */}
        <div className="absolute top-2 right-2">
          <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
            GIF
          </span>
        </div>
      </div>
      
      {caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
