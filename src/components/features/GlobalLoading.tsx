"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// 添加随机选择动画效果的工具函数
export const getRandomVariant = () => {
  const variants = ["rotating", "breathing", "exploding", "morphing"] as const
  return variants[Math.floor(Math.random() * variants.length)]
}

interface Cube3DLoadingProps {
  size?: "sm" | "md" | "lg"
  variant?: "rotating" | "breathing" | "exploding" | "morphing"
  text?: string
  className?: string
}

export default function Cube3DLoading({ size = "md", variant = "rotating", text, className }: Cube3DLoadingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeConfig = {
    sm: {
      containerSize: 200,
      cubeSize: 30,
      gap: 2,
      perspective: 800,
    },
    md: {
      containerSize: 300,
      cubeSize: 45,
      gap: 3,
      perspective: 1200,
    },
    lg: {
      containerSize: 400,
      cubeSize: 60,
      gap: 4,
      perspective: 1600,
    },
  }

  const config = sizeConfig[size]

  // 生成3x3x3魔方的所有27个小立方体
  const generateRubiksCube = () => {
    const cubes = []

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const distance = Math.sqrt(x * x + y * y + z * z)

          const faceColorMap: FaceColorMap = {}

          // 设置每个朝向的颜色（标准魔方配色）
          if (x === 1) faceColorMap.right = "bg-red-500"      // 右侧：红色
          if (x === -1) faceColorMap.left = "bg-orange-500"   // 左侧：橙色

          if (y === -1) faceColorMap.top = "bg-white"         // 上方：白色 ✅
          if (y === 1) faceColorMap.bottom = "bg-yellow-400"  // 下方：黄色 ✅

          if (z === 1) faceColorMap.front = "bg-green-500"    // 前面：绿色
          if (z === -1) faceColorMap.back = "bg-blue-500"     // 后面：蓝色

          cubes.push({
            x,
            y,
            z,
            distance,
            faceColorMap,
            key: `${x}-${y}-${z}`,
          })
        }
      }
    }
    return cubes
  }

  const cubes = generateRubiksCube()

  // 渲染单个立方体的6个面
  type FaceColorMap = Partial<Record<"front" | "back" | "left" | "right" | "top" | "bottom", string>>

  const renderCubeFaces = (faceColors: FaceColorMap, cubeSize: number) => {
    const faces = [
      { name: "front" as const, transform: `translateZ(${cubeSize / 2}px)` },
      { name: "back" as const, transform: `rotateY(180deg) translateZ(${cubeSize / 2}px)` },
      { name: "right" as const, transform: `rotateY(90deg) translateZ(${cubeSize / 2}px)` },
      { name: "left" as const, transform: `rotateY(-90deg) translateZ(${cubeSize / 2}px)` },
      { name: "top" as const, transform: `rotateX(90deg) translateZ(${cubeSize / 2}px)` },
      { name: "bottom" as const, transform: `rotateX(-90deg) translateZ(${cubeSize / 2}px)` },
    ]

    return faces.map((face) => {
      const colorClass = faceColors[face.name] ?? "bg-gray-300" // 默认内部灰色

      return (
        <div
          key={face.name}
          className={cn("absolute w-full h-full border-2 border-gray-800", colorClass)}
          style={{
            transform: face.transform,
            backfaceVisibility: "hidden",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          {/* 魔方方块表面的阴影效果 */}
          <div className="absolute inset-2 bg-black/10 rounded-sm" />
          <div className="absolute inset-1 border border-black/20 rounded-sm" />
        </div>
      )
    })
  }

  // 旋转魔方效果
  const renderRotatingCube = () => (
    <div
      className="cube-3d-container relative mx-auto"
      style={{
        width: `${config.containerSize}px`,
        height: `${config.containerSize}px`,
        perspective: `${config.perspective}px`,
      }}
    >
      <div
        className="cube-3d-scene relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          animation: "cube3d-rotate 12s linear infinite",
        }}
      >
        {cubes.map((cube) => (
          <div
            key={cube.key}
            className="cube-3d-piece absolute"
            style={{
              width: `${config.cubeSize}px`,
              height: `${config.cubeSize}px`,
              transformStyle: "preserve-3d",
              transform: `translate3d(${cube.x * (config.cubeSize + config.gap)}px, ${cube.y * (config.cubeSize + config.gap)}px, ${cube.z * (config.cubeSize + config.gap)}px)`,
              left: "50%",
              top: "50%",
              marginLeft: `-${config.cubeSize / 2}px`,
              marginTop: `-${config.cubeSize / 2}px`,
            }}
          >
            {renderCubeFaces(cube.faceColorMap, config.cubeSize)}
          </div>
        ))}
      </div>
    </div>
  )

  // 呼吸魔方效果
  const renderBreathingCube = () => (
    <div
      className="cube-3d-container relative mx-auto"
      style={{
        width: `${config.containerSize}px`,
        height: `${config.containerSize}px`,
        perspective: `${config.perspective}px`,
      }}
    >
      <div
        className="cube-3d-scene relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(-15deg) rotateY(25deg)",
        }}
      >
        {cubes.map((cube) => {
          const animationDelay = cube.distance * 0.1
          const baseX = cube.x * (config.cubeSize + config.gap)
          const baseY = cube.y * (config.cubeSize + config.gap)
          const baseZ = cube.z * (config.cubeSize + config.gap)

          return (
            <div
              key={cube.key}
              className="cube-3d-piece absolute"
              style={{
                width: `${config.cubeSize}px`,
                height: `${config.cubeSize}px`,
                transformStyle: "preserve-3d",
                transform: `translate3d(${baseX}px, ${baseY}px, ${baseZ}px)`,
                animation: `cube3d-breathing 3s infinite ease-in-out`,
                animationDelay: `${animationDelay}s`,
                left: "50%",
                top: "50%",
                marginLeft: `-${config.cubeSize / 2}px`,
                marginTop: `-${config.cubeSize / 2}px`,
                "--x": `${baseX}px`,
                "--y": `${baseY}px`,
                "--z": `${baseZ}px`,
                "--scale": "1",
              } as any}
            >
              {renderCubeFaces(cube.faceColorMap, config.cubeSize)}
            </div>
          )
        })}
      </div>
    </div>
  )

  // 爆炸魔方效果
  const renderExplodingCube = () => (
    <div
      className="cube-3d-container relative mx-auto"
      style={{
        width: `${config.containerSize}px`,
        height: `${config.containerSize}px`,
        perspective: `${config.perspective}px`,
      }}
    >
      <div
        className="cube-3d-scene relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(-10deg) rotateY(20deg)",
        }}
      >
        {cubes.map((cube) => {
          const animationDelay = Math.random() * 0.5
          const baseX = cube.x * (config.cubeSize + config.gap)
          const baseY = cube.y * (config.cubeSize + config.gap)
          const baseZ = cube.z * (config.cubeSize + config.gap)

          return (
            <div
              key={cube.key}
              className="cube-3d-piece absolute"
              style={{
                width: `${config.cubeSize}px`,
                height: `${config.cubeSize}px`,
                transformStyle: "preserve-3d",
                transform: `translate3d(${baseX}px, ${baseY}px, ${baseZ}px)`,
                animation: `cube3d-exploding 2s infinite ease-in-out`,
                animationDelay: `${animationDelay}s`,
                left: "50%",
                top: "50%",
                marginLeft: `-${config.cubeSize / 2}px`,
                marginTop: `-${config.cubeSize / 2}px`,
                "--x": `${baseX}px`,
                "--y": `${baseY}px`,
                "--z": `${baseZ}px`,
              } as any}
            >
              {renderCubeFaces(cube.faceColorMap, config.cubeSize)}
            </div>
          )
        })}
      </div>
    </div>
  )

  // 变形魔方效果
  const renderMorphingCube = () => (
    <div
      className="cube-3d-container relative mx-auto"
      style={{
        width: `${config.containerSize}px`,
        height: `${config.containerSize}px`,
        perspective: `${config.perspective}px`,
      }}
    >
      <div
        className="cube-3d-scene relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          animation: "cube3d-morphing 8s infinite ease-in-out",
        }}
      >
        {cubes.map((cube) => {
          const animationDelay = (cube.x + cube.y + cube.z + 3) * 0.1
          const baseX = cube.x * (config.cubeSize + config.gap)
          const baseY = cube.y * (config.cubeSize + config.gap)
          const baseZ = cube.z * (config.cubeSize + config.gap)

          return (
            <div
              key={cube.key}
              className="cube-3d-piece absolute"
              style={{
                width: `${config.cubeSize}px`,
                height: `${config.cubeSize}px`,
                transformStyle: "preserve-3d",
                transform: `translate3d(${baseX}px, ${baseY}px, ${baseZ}px)`,
                animation: `cube3d-piece-morph 4s infinite ease-in-out`,
                animationDelay: `${animationDelay}s`,
                left: "50%",
                top: "50%",
                marginLeft: `-${config.cubeSize / 2}px`,
                marginTop: `-${config.cubeSize / 2}px`,
                "--x": `${baseX}px`,
                "--y": `${baseY}px`,
                "--z": `${baseZ}px`,
              } as any}
            >
              {renderCubeFaces(cube.faceColorMap, config.cubeSize)}
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderCube = () => {
    switch (variant) {
      case "rotating":
        return renderRotatingCube()
      case "breathing":
        return renderBreathingCube()
      case "exploding":
        return renderExplodingCube()
      case "morphing":
        return renderMorphingCube()
      default:
        return renderRotatingCube()
    }
  }

  if (!mounted) return null

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full",
        className,
      )}
      style={{ height: `${config.containerSize + 100}px` }}
    >
      {renderCube()}

      {text && (
        <h1 className="mt-8 text-2xl font-semibold text-theme-primary animate-pulse">{text}</h1>
      )}

      <style jsx global>{`
        @keyframes cube3d-rotate {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
          }
        }

        @keyframes cube3d-breathing {
          0%, 100% {
            transform: translate3d(var(--x), var(--y), var(--z)) scale3d(1, 1, 1);
            --scale: 1;
          }
          50% {
            transform: translate3d(
              calc(var(--x) * 1.2),
              calc(var(--y) * 1.2),
              calc(var(--z) * 1.2)
            ) scale3d(0.8, 0.8, 0.8);
            --scale: 0.8;
          }
        }

        .cube3d-piece {
          transform-style: preserve-3d;
        }

        .cube3d-piece > div {
          transform-style: preserve-3d;
          transform: scale3d(var(--scale), var(--scale), var(--scale));
        }

        @keyframes cube3d-exploding {
          0%, 100% {
            transform: translate3d(var(--x), var(--y), var(--z)) scale3d(1, 1, 1);
            opacity: 1;
          }
          50% {
            transform: translate3d(
              calc(var(--x) * 3),
              calc(var(--y) * 3),
              calc(var(--z) * 3)
            ) scale3d(0.5, 0.5, 0.5);
            opacity: 0.5;
          }
        }

        @keyframes cube3d-morphing {
          0%, 100% {
            transform: rotateX(-10deg) rotateY(20deg) scale3d(1, 1, 1);
          }
          25% {
            transform: rotateX(45deg) rotateY(90deg) scale3d(1.2, 1.2, 1.2);
          }
          50% {
            transform: rotateX(180deg) rotateY(180deg) scale3d(0.8, 0.8, 0.8);
          }
          75% {
            transform: rotateX(270deg) rotateY(270deg) scale3d(1.1, 1.1, 1.1);
          }
        }

        @keyframes cube3d-piece-morph {
          0%, 100% {
            transform: translate3d(var(--x), var(--y), var(--z)) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
          }
          25% {
            transform: translate3d(var(--x), var(--y), var(--z)) rotateX(90deg) rotateY(90deg) scale3d(1.2, 1.2, 1.2);
          }
          50% {
            transform: translate3d(var(--x), var(--y), var(--z)) rotateX(180deg) rotateY(180deg) scale3d(0.8, 0.8, 0.8);
          }
          75% {
            transform: translate3d(var(--x), var(--y), var(--z)) rotateX(270deg) rotateY(270deg) scale3d(1.1, 1.1, 1.1);
          }
        }
      `}</style>
    </div>
  )
}
