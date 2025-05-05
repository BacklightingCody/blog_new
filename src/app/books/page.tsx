"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import './css/index.css'
import { X, Share2, Book } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { categories, books } from './constant'
import { ShareBookCard } from "@/components/features/shared-card"

type Book = {
  id: number
  title: string
  cover: string
  progress: number
  description: string
  author: string
  tags: string[]
}

export default function BookStack() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentCategory, setCurrentCategory] = useState("programming")
  const [showShareCard, setShowShareCard] = useState(false)


  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
    setIsOpen(true)
    // 重置翻页状态，但添加短暂延迟以便Modal先显示
    setIsFlipped(false)
    setTimeout(() => {
      setIsFlipped(true)
    }, 300)
  }

  const handleClose = () => {
    setIsFlipped(false)
    // 添加延迟以便动画完成后再关闭Modal
    setTimeout(() => {
      setIsOpen(false)
    }, 500)
  }

  const handleShare = () => {
    // 先关闭书籍Modal，然后显示分享卡片
    handleClose()
    // 添加延迟以确保书籍Modal完全关闭后再显示分享卡片
    setTimeout(() => {
      setShowShareCard(true)
    }, 600)
  }

  return (
    <div>
      <h1 className="py-3 text-3xl font-bold mb-8 text-center text-theme-primary">书海拾贝</h1>

      <Tabs defaultValue="programming" value={currentCategory} onValueChange={setCurrentCategory}>
        <TabsList className="grid w-full grid-cols-3 mb-8 cursor-pointer bg-subtle-bg">
          {categories.map(({ key, label, icon: Icon }) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center gap-2 cursor-pointer hover:ring-1 ring-theme-primary data-[state=active]:bg-theme-primary/80 font-bold dark:data-[state=active]:bg-theme-primary/80 font-bold"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(books).map(([category, categoryBooks]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryBooks.map((book) => (
                <div
                  key={book.id}
                  className="rounded-lg inset-shadow-sm inset-shadow-theme-accent overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="p-4 flex flex-col items-center">
                    <div className="relative mb-4 book-cover-container">
                      <img
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        className="h-48 w-36 object-cover inset-shadow-sm inset-shadow-theme-primary rounded  transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-center">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 text-center">{book.author}</p>
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">阅读进度</span>
                        <span className="text-xs font-medium">{book.progress}%</span>
                      </div>
                      <Progress value={book.progress} className="h-1.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* 书籍详情弹窗 */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleClose()
          else setIsOpen(true)
        }}
      >
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-transparent border-none shadow-none">
          <button onClick={handleClose} className="absolute right-4 top-4 z-50 rounded-full text-white bg-theme-primary/90 p-2 cursor-pointer">
            <X className="h-4 w-4" />
          </button>

          {selectedBook && (
            <div className="book-container">
              {/* 书本结构 */}
              <div className="book">
                {/* 封面 */}
                <motion.div
                  className="book-cover"
                  initial={false}
                  animate={{ rotateY: isFlipped ? -180 : 0 }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 50,
                    damping: 20,
                  }}
                >
                  <div className="book-spine"></div>
                  <div className="book-front">
                    <img
                      src={selectedBook.cover || "/placeholder.svg"}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* 内页内容 - 使用AnimatePresence处理内容的显示/隐藏 */}
                <AnimatePresence>
                  {isFlipped && (
                    <>
                      {/* 左侧页面 */}
                      <motion.div
                        className="book-page-content left-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        <div className="flex flex-col items-center justify-center h-full p-8">
                          <img
                            src={selectedBook.cover || "/placeholder.svg"}
                            alt={selectedBook.title}
                            className="h-48 w-36 object-cover rounded shadow-lg mb-6"
                          />
                          <h3 className="text-xl font-bold text-center">{selectedBook.title}</h3>
                          <p className="text-primary-color text-sm text-center mt-2">{selectedBook.author}</p>
                          <div className="flex gap-2 mt-4 flex-wrap justify-center">
                            {selectedBook.tags.map((tag, index) => (
                              <span key={index} className="bg-theme-accent text-primary-color text-xs px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* 右侧页面 */}
                      <motion.div
                        className="book-page-content right-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        <div className="p-8 flex flex-col h-full">
                          <h3 className="text-xl font-bold mb-4 text-primary-color">关于这本书</h3>
                          <p className="text-primary-color mb-6 leading-relaxed whitespace-pre-wrap indent-8"> {selectedBook.description.split('\n').map((line, index) => (
                            <span key={index} className="block indent-8">
                              {line}
                            </span>
                          ))}</p>
                          <div className="mt-auto">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-primary-color">阅读进度</span>
                              <span className="text-sm font-medium">{selectedBook.progress}%</span>
                            </div>
                            <Progress value={selectedBook.progress} className="h-2" />
                            <div className="flex justify-center mt-6">
                              <motion.div
                                className="inline-flex items-center justify-center rounded-md bg-theme-accent text-primary-color px-4 py-2 text-sm font-medium hover:bg-theme-primary/70 cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShare}
                              >
                                <Share2 className="mr-2 h-4 w-4 text-theme-primary" />
                                推荐给朋友

                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* 分享卡片 */}
      <AnimatePresence>
        {showShareCard && selectedBook && <ShareBookCard book={selectedBook} onClose={() => setShowShareCard(false)} />}
      </AnimatePresence>
    </div>
  )
}
