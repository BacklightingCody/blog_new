export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* 标题骨架 */}
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        
        {/* 统计信息骨架 */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        
        {/* 文章列表骨架 */}
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
                <div className="ml-6">
                  <div className="h-20 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 分页骨架 */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}