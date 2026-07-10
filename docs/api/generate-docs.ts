#!/usr/bin/env bun

/**
 * YYC³餐饮行业智能化平台 - API文档生成脚本
 * @description 根据OpenAPI规范生成各种格式的API文档
 * @author YYC³
 * @version 1.0.0
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { execSync } from 'child_process';

// 配置
const CONFIG = {
  openApiPath: join(process.cwd(), 'docs', 'api', 'openapi.yaml'),
  outputDir: join(process.cwd(), 'docs', 'api', 'generated'),
  formats: ['html', 'markdown', 'pdf'] as const,
  serverPort: 3001,
  serverHost: 'localhost',
};

/**
 * 确保输出目录存在
 */
function ensureOutputDir(): void {
  if (!existsSync(CONFIG.outputDir)) {
    mkdirSync(CONFIG.outputDir, { recursive: true });
  }
}

/**
 * 生成HTML格式文档
 */
function generateHtmlDocs(): void {
  console.log('生成HTML格式文档...');

  try {
    // 创建简单的HTML文档查看器
    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YYC³餐饮行业智能化平台 API文档</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui.css" />
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .api-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .api-info h2 {
            margin-top: 0;
            color: #333;
        }
        .server-info {
            background: #e8f4f8;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .server-info h3 {
            margin-top: 0;
            color: #0066cc;
        }
        .server-info ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .server-info li {
            margin: 5px 0;
        }
        #swagger-ui {
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🍽️ YYC³餐饮行业智能化平台</h1>
        <p>RESTful API 文档 - v1.0.0</p>
    </div>

    <div class="api-info">
        <h2>平台概述</h2>
        <p>YYC³是一个专业的餐饮行业智能化管理平台，提供从点餐、厨房管理、会员管理到营销活动的全方位解决方案。</p>

        <h3>主要功能模块</h3>
        <ul>
            <li><strong>菜单管理</strong> - 菜品管理、分类管理、推荐管理</li>
            <li><strong>订单管理</strong> - 订单处理、状态跟踪、统计分析</li>
            <li><strong>会员管理</strong> - 会员信息、等级积分、消费记录</li>
            <li><strong>营销活动</strong> - 优惠券、促销活动、数据分析</li>
            <li><strong>支付管理</strong> - 多种支付方式、交易记录、退款处理</li>
            <li><strong>门店管理</strong> - 多门店支持、员工管理、运营分析</li>
            <li><strong>报表分析</strong> - 销售报表、财务报表、运营报表</li>
        </ul>
    </div>

    <div class="server-info">
        <h3>🌐 服务器地址</h3>
        <ul>
            <li><strong>生产环境</strong>: https://api.yyc3.com/v1</li>
            <li><strong>测试环境</strong>: https://api-test.yyc3.com/v1</li>
            <li><strong>开发环境</strong>: http://localhost:3006/v1</li>
        </ul>

        <h3>🔐 认证方式</h3>
        <p>本API使用JWT Bearer Token进行身份认证，请在请求头中添加：</p>
        <code style="background: #f4f4f4; padding: 5px; border-radius: 3px;">
            Authorization: Bearer &lt;your_token&gt;
        </code>
    </div>

    <div id="swagger-ui"></div>

    <div class="footer">
        <p>📧 技术支持: support@yyc3.com | 🌐 官网: https://www.yyc3.com</p>
        <p>© 2024 YYC³餐饮行业智能化平台. All rights reserved.</p>
    </div>

    <script src="https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui-standalone-preset.js"></script>
    <script>
        // 加载OpenAPI规范
        fetch('./openapi.yaml')
            .then(response => response.text())
            .then(spec => {
                // 转换YAML为JSON
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(spec, 'text/xml');

                // 如果YAML解析失败，直接使用原始文本
                if (xmlDoc.querySelector('parsererror')) {
                    console.warn('YAML解析失败，使用原始文档');
                    SwaggerUIBundle({
                        url: './openapi.yaml',
                        dom_id: '#swagger-ui',
                        deepLinking: true,
                        presets: [
                            SwaggerUIBundle.presets.apis,
                            SwaggerUIStandalonePreset
                        ],
                        plugins: [
                            SwaggerUIBundle.plugins.DownloadUrl
                        ],
                        layout: "StandaloneLayout",
                        defaultModelsExpandDepth: 2,
                        defaultModelExpandDepth: 2,
                        displayRequestDuration: true,
                        docExpansion: "none",
                        filter: true,
                        showExtensions: true,
                        showCommonExtensions: true,
                        tryItOutEnabled: true
                    });
                } else {
                    // 如果需要转换YAML到JSON，可以在这里添加转换逻辑
                    SwaggerUIBundle({
                        spec: spec,
                        dom_id: '#swagger-ui',
                        deepLinking: true,
                        presets: [
                            SwaggerUIBundle.presets.apis,
                            SwaggerUIStandalonePreset
                        ],
                        plugins: [
                            SwaggerUIBundle.plugins.DownloadUrl
                        ],
                        layout: "StandaloneLayout",
                        defaultModelsExpandDepth: 2,
                        defaultModelExpandDepth: 2,
                        displayRequestDuration: true,
                        docExpansion: "none",
                        filter: true,
                        showExtensions: true,
                        showCommonExtensions: true,
                        tryItOutEnabled: true
                    });
                }
            })
            .catch(error => {
                console.error('加载API文档失败:', error);
                document.getElementById('swagger-ui').innerHTML =
                    '<div style="text-align: center; padding: 50px; color: #666;">' +
                    '<h3>📄 API文档加载失败</h3>' +
                    '<p>请检查网络连接或联系技术支持</p>' +
                    '</div>';
            });
    </script>
</body>
</html>`;

    const htmlFilePath = join(CONFIG.outputDir, 'index.html');
    writeFileSync(htmlFilePath, htmlContent);

    // 复制OpenAPI文件
    const yamlFilePath = join(CONFIG.outputDir, 'openapi.yaml');
    const yamlContent = readFileSync(CONFIG.openApiPath, 'utf8');
    writeFileSync(yamlFilePath, yamlContent);

    console.log('✓ HTML文档生成完成:', htmlFilePath);
  } catch (error) {
    console.error('生成HTML文档失败:', error);
  }
}

/**
 * 生成Markdown格式文档
 */
function generateMarkdownDocs(): void {
  console.log('生成Markdown格式文档...');

  try {
    const markdownContent = `
# YYC³餐饮行业智能化平台 API文档

## 平台概述

YYC³是一个专业的餐饮行业智能化管理平台，提供从点餐、厨房管理、会员管理到营销活动的全方位解决方案。

## 主要功能

- 🍽️ **菜单管理** - 菜品管理、分类管理、推荐管理
- 📋 **订单管理** - 订单处理、状态跟踪、统计分析
- 👥 **会员管理** - 会员信息、等级积分、消费记录
- 🎯 **营销活动** - 优惠券、促销活动、数据分析
- 💳 **支付管理** - 多种支付方式、交易记录、退款处理
- 🏪 **门店管理** - 多门店支持、员工管理、运营分析
- 📊 **报表分析** - 销售报表、财务报表、运营报表

## 服务器地址

- **生产环境**: https://api.yyc3.com/v1
- **测试环境**: https://api-test.yyc3.com/v1
- **开发环境**: http://localhost:3006/v1

## 认证方式

本API使用JWT Bearer Token进行身份认证。请在请求头中添加：

\`\`\`
Authorization: Bearer <your_token>
\`\`\`

## API端点

### 认证

#### 用户登录
\`\`\`
POST /auth/login
\`\`\`

**请求体:**
\`\`\`json
{
  "username": "admin",
  "password": "password123",
  "rememberMe": false
}
\`\`\`

**响应:**
\`\`\`json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@yyc3.com",
      "fullName": "管理员",
      "role": "super_admin"
    },
    "expiresIn": 3600
  }
}
\`\`\`

### 用户管理

#### 获取用户列表
\`\`\`
GET /users?page=1&limit=20&search=keyword
\`\`\`

#### 创建用户
\`\`\`
POST /users
\`\`\`

**请求体:**
\`\`\`json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "新用户",
  "role": "staff",
  "phone": "13800138000"
}
\`\`\`

### 门店管理

#### 获取门店列表
\`\`\`
GET /stores?page=1&limit=20&status=active
\`\`\`

#### 创建门店
\`\`\`
POST /stores
\`\`\`

**请求体:**
\`\`\`json
{
  "storeCode": "STORE001",
  "name": "YYC³旗舰店",
  "address": "北京市朝阳区三里屯路19号",
  "phone": "010-12345678",
  "businessHours": {
    "monday": "09:00-22:00",
    "tuesday": "09:00-22:00"
  }
}
\`\`\`

### 菜单管理

#### 获取菜品列表
\`\`\`
GET /menu/items?page=1&limit=20&categoryId=1&isAvailable=true
\`\`\`

#### 创建菜品
\`\`\`
POST /menu/items
\`\`\`

**请求体:**
\`\`\`json
{
  "name": "宫保鸡丁",
  "description": "经典川菜，鸡肉嫩滑，花生香脆",
  "categoryId": 1,
  "price": 38.00,
  "originalPrice": 45.00,
  "isRecommended": true,
  "isAvailable": true
}
\`\`\`

### 订单管理

#### 获取订单列表
\`\`\`
GET /orders?page=1&limit=20&status=confirmed&startDate=2024-01-01T00:00:00Z
\`\`\`

#### 创建订单
\`\`\`
POST /orders
\`\`\`

**请求体:**
\`\`\`json
{
  "storeId": 1,
  "memberId": 1,
  "tableNumber": "A01",
  "orderType": "dine_in",
  "peopleCount": 2,
  "items": [
    {
      "itemId": 1,
      "quantity": 2,
      "specialRequests": "不要辣"
    }
  ]
}
\`\`\`

### 会员管理

#### 获取会员列表
\`\`\`
GET /members?page=1&limit=20&levelId=1&status=active
\`\`\`

#### 创建会员
\`\`\`
POST /members
\`\`\`

**请求体:**
\`\`\`json
{
  "phone": "13800138000",
  "email": "member@example.com",
  "nickname": "美食达人",
  "realName": "张三",
  "birthday": "1990-01-01"
}
\`\`\`

#### 调整会员积分
\`\`\`
POST /members/{id}/points/adjust
\`\`\`

**请求体:**
\`\`\`json
{
  "points": 100,
  "reason": "消费奖励",
  "type": "earn"
}
\`\`\`

### 营销活动

#### 获取营销活动列表
\`\`\`
GET /marketing/activities?page=1&limit=20&type=discount&status=active
\`\`\`

#### 创建营销活动
\`\`\`
POST /marketing/activities
\`\`\`

**请求体:**
\`\`\`json
{
  "name": "春节优惠活动",
  "type": "discount",
  "startTime": "2024-01-01T00:00:00Z",
  "endTime": "2024-01-31T23:59:59Z",
  "conditions": {
    "minOrderAmount": 100
  },
  "rewards": {
    "discountRate": 0.9
  }
}
\`\`\`

### 支付管理

#### 获取支付配置
\`\`\`
GET /payment/configs
\`\`\`

#### 创建支付配置
\`\`\`
POST /payment/configs
\`\`\`

**请求体:**
\`\`\`json
{
  "method": "alipay",
  "name": "支付宝配置",
  "displayName": "支付宝",
  "enabled": true,
  "config": {
    "appId": "your_app_id",
    "merchantId": "your_merchant_id",
    "apiKey": "your_api_key",
    "notifyUrl": "https://api.yyc3.com/payment/notify"
  }
}
\`\`\`

## 错误响应

所有错误响应都遵循统一的格式：

\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "statusCode": 400,
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
\`\`\`

### 常见错误码

- \`AUTHENTICATION_ERROR\` - 认证失败 (401)
- \`AUTHORIZATION_ERROR\` - 权限不足 (403)
- \`NOT_FOUND_ERROR\` - 资源未找到 (404)
- \`VALIDATION_ERROR\` - 参数验证失败 (422)
- \`RATE_LIMIT_ERROR\` - 请求过于频繁 (429)
- \`INTERNAL_ERROR\` - 服务器内部错误 (500)

## 分页响应

列表接口都支持分页，响应格式如下：

\`\`\`json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
\`\`\`

## 请求参数

### 通用参数

- \`page\` - 页码，从1开始 (默认: 1)
- \`limit\` - 每页数量，最大100 (默认: 20)
- \`search\` - 搜索关键词
- \`startDate\` - 开始时间 (ISO 8601格式)
- \`endDate\` - 结束时间 (ISO 8601格式)

### 日期时间格式

所有日期时间字段都使用ISO 8601格式：
\`\`\`
2024-01-01T12:00:00.000Z
\`\`\`

## 联系信息

- **技术支持**: support@yyc3.com
- **官方网站**: https://www.yyc3.com
- **问题反馈**: https://github.com/yyc3/issues

---

© 2024 YYC³餐饮行业智能化平台. All rights reserved.
`;

    const markdownFilePath = join(CONFIG.outputDir, 'README.md');
    writeFileSync(markdownFilePath, markdownContent);

    console.log('✓ Markdown文档生成完成:', markdownFilePath);
  } catch (error) {
    console.error('生成Markdown文档失败:', error);
  }
}

/**
 * 启动本地文档服务器
 */
function startDocServer(): void {
  console.log(`启动文档服务器...`);
  console.log(`访问地址: http://${CONFIG.serverHost}:${CONFIG.serverPort}`);

  try {
    const serverScript = `
import { serve } from 'bun:serve';
import { join } from 'path';
import { existsSync } from 'fs';

const server = serve({
  port: ${CONFIG.serverPort},
  hostname: '${CONFIG.serverHost}',
  fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;

    // 默认返回index.html
    if (filePath === '/') {
      filePath = '/index.html';
    }

    const fullPath = join('${CONFIG.outputDir}', filePath);

    if (existsSync(fullPath)) {
      const file = Bun.file(fullPath);
      return new Response(file);
    }

    // 404响应
    return new Response('404 Not Found', { status: 404 });
  },
});

console.log(\`📖 YYC³ API文档服务器已启动\`);
console.log(\`🌐 访问地址: http://${CONFIG.serverHost}:${CONFIG.serverPort}\`);
console.log(\`⏹️  按 Ctrl+C 停止服务器\`);
`;

    const serverFilePath = join(CONFIG.outputDir, 'server.ts');
    writeFileSync(serverFilePath, serverScript);

    // 启动服务器
    execSync(`bun run ${serverFilePath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('启动文档服务器失败:', error);
  }
}

/**
 * 检查依赖
 */
function checkDependencies(): void {
  console.log('检查依赖...');

  try {
    // 检查OpenAPI文件是否存在
    if (!existsSync(CONFIG.openApiPath)) {
      throw new Error(`OpenAPI文件不存在: ${CONFIG.openApiPath}`);
    }

    console.log('✓ 依赖检查通过');
  } catch (error) {
    console.error('❌ 依赖检查失败:', error);
    process.exit(1);
  }
}

/**
 * 显示帮助信息
 */
function showHelp(): void {
  console.log(`
YYC³餐饮行业智能化平台 - API文档生成工具

用法:
  bun run docs/api/generate-docs.ts <command> [options]

命令:
  generate     生成所有格式的文档
  html         生成HTML格式文档
  markdown     生成Markdown格式文档
  server       启动本地文档服务器
  help         显示帮助信息

选项:
  --open        生成完成后自动打开浏览器
  --port N      指定服务器端口 (默认: 3001)
  --host HOST   指定服务器主机 (默认: localhost)

示例:
  bun run docs/api/generate-docs.ts generate
  bun run docs/api/generate-docs.ts generate --open
  bun run docs/api/generate-docs.ts html
  bun run docs/api/generate-docs.ts server --port 8080
`);
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const command = process.argv[2];
  const openBrowser = process.argv.includes('--open');

  // 解析端口号
  const portIndex = process.argv.indexOf('--port');
  if (portIndex !== -1) {
    const port = parseInt(process.argv[portIndex + 1]);
    if (!isNaN(port)) {
      CONFIG.serverPort = port;
    }
  }

  // 解析主机名
  const hostIndex = process.argv.indexOf('--host');
  if (hostIndex !== -1) {
    const host = process.argv[hostIndex + 1];
    if (host) {
      CONFIG.serverHost = host;
    }
  }

  switch (command) {
    case 'generate':
      checkDependencies();
      ensureOutputDir();
      generateHtmlDocs();
      generateMarkdownDocs();
      console.log('✅ 所有文档生成完成!');
      console.log(`📁 文档输出目录: ${CONFIG.outputDir}`);

      if (openBrowser) {
        execSync(`open http://${CONFIG.serverHost}:${CONFIG.serverPort}`);
      }
      break;

    case 'html':
      checkDependencies();
      ensureOutputDir();
      generateHtmlDocs();
      console.log('✅ HTML文档生成完成!');

      if (openBrowser) {
        execSync(`open http://${CONFIG.serverHost}:${CONFIG.serverPort}`);
      }
      break;

    case 'markdown':
      checkDependencies();
      ensureOutputDir();
      generateMarkdownDocs();
      console.log('✅ Markdown文档生成完成!');
      break;

    case 'server':
      checkDependencies();
      ensureOutputDir();
      generateHtmlDocs(); // 确保HTML文档存在
      startDocServer();
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    default:
      console.error('❌ 未知命令:', command);
      showHelp();
      process.exit(1);
  }
}

// 运行主函数
main().catch(error => {
  console.error('❌ 文档生成失败:', error);
  process.exit(1);
});
