/**
 * 服务层统一导出
 */

// 基础服务
export { BaseService, ClientService, ServerService } from './base';

// 客户端服务
export { ArticlesClientService, articlesClientService } from './articles-client';
export { CommentsClientService, commentsClientService } from './comments-client';

// 现有的服务（向后兼容）
export * from './articles';
