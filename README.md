# 本地城市信息管理系统

## 项目简介

本地城市信息管理系统是一个综合性的本地信息发布与管理平台，旨在为用户提供房屋租售、二手物品交易、车辆买卖和生活服务等信息的发布与管理功能。系统采用前后端分离架构，具有完善的管理后台和用户中心，支持金币系统、审核机制和用户管理等功能。

## 功能亮点

### 1. 多模块信息管理
- **房屋租售**：支持发布和管理房屋出租、出售信息，包含详细的房屋信息和图片上传
- **二手物品**：支持发布和管理二手物品交易信息，包含分类、品牌、新旧程度等详细信息
- **车辆买卖**：支持发布和管理车辆交易信息，包含品牌、型号、年份、里程等详细信息
- **生活服务**：支持发布和管理各类生活服务信息，包含分类、地区、有效期等详细信息

### 2. 金币系统
- 用户注册后自动获得 100 初始金币
- 发布信息需要扣除 5 金币
- 管理员可以为用户充值金币
- 金币余额实时显示在用户中心

### 3. 审核机制
- 用户发布的信息需要经过管理员审核
- 管理员可以集中处理所有待审核内容
- 支持审核通过和拒绝操作
- 审核状态实时更新

### 4. 用户管理
- 支持个人用户和机构用户注册
- 管理员可以编辑用户信息
- 支持金币充值功能
- 用户信息实时同步到数据库

### 5. 网站设置
- 联系我们管理：公司信息、联系方式、付款二维码上传
- 会员与广告服务管理：会员权益、广告服务设置
- 网站简介管理：网站介绍、使用说明等内容管理

### 6. 技术特色
- 前后端分离架构
- 响应式设计，适配不同屏幕尺寸
- 模块化组件开发
- 完善的错误处理和数据验证
- 实时数据同步
- Pinia 状态管理，提供统一的状态管理方案
- TypeScript 类型系统，提供更好的代码质量和开发体验

## 技术栈

### 前端技术
- **框架**：Vue 3
- **路由**：Vue Router
- **网络请求**：Axios
- **样式**：CSS3 (Scoped Styles)
- **构建工具**：Vue CLI

### 后端技术
- **运行环境**：Node.js
- **Web 框架**：Express
- **数据库**：MySQL
- **ORM**：Sequelize
- **文件上传**：Multer
- **跨域处理**：CORS
- **类型系统**：TypeScript

## 项目结构

```
local-city-website/
├── client/              # 前端项目
│   ├── public/          # 静态资源
│   │   └── uploads/     # 上传的图片
│   ├── src/             # 源代码
│   │   ├── views/        # 页面组件
│   │   │   ├── admin-components/  # 管理后台组件
│   │   ├── stores/       # Pinia 状态管理
│   │   ├── router.js     # 路由配置
│   │   └── main.js       # 入口文件
│   ├── package.json      # 前端依赖
│   └── vue.config.js     # Vue 配置
├── server.ts             # 后端服务器 (TypeScript)
├── server.js             # 后端服务器 (JavaScript, 备用)
├── tsconfig.json         # TypeScript 配置
├── package.json          # 项目依赖
└── README.md             # 项目说明
```

## 快速开始

### 环境要求
- Node.js 12.0+
- MySQL 5.7+

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <项目地址>
   cd local-city-website
   ```

2. **安装后端依赖**
   ```bash
   npm install
   ```

3. **安装前端依赖**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **配置数据库**
   - 确保 MySQL 服务正在运行
   - 系统会自动创建 `localcity` 数据库
   - 默认数据库配置：
     - 主机：localhost
     - 端口：3306
     - 用户名：root
     - 密码：123456
   - 如需修改配置，请编辑 `server.ts` 文件中的 `dbConfig` 对象
   - 注意：在宝塔面板部署时，需要将用户名改为 `localcity_user`（宝塔面板不允许使用root用户）

5. **构建前端**
   ```bash
   cd client
   npm run build
   cd ..
   ```

6. **启动服务器**
   ```bash
   npm start
   ```

7. **访问系统**
   - 前端：http://localhost:3001
   - 管理后台：http://localhost:3001/admin
   - 管理员账号：admin / 123456

## 核心功能使用指南

### 管理后台

1. **登录**：访问 http://localhost:3001/admin，使用默认账号密码登录

2. **房屋管理**：
   - 添加房屋信息，包括标题、价格、面积、类型等详细信息
   - 支持多图片上传
   - 编辑和删除房屋信息
   - 修改发布时间
   - 按联系电话搜索房屋信息

3. **二手物品管理**：
   - 添加二手物品信息，包括标题、价格、分类、品牌等详细信息
   - 支持多图片上传
   - 编辑和删除二手物品信息
   - 修改发布时间
   - 按联系电话搜索二手物品信息

4. **车辆管理**：
   - 添加车辆信息，包括标题、价格、品牌、型号、年份、里程等详细信息
   - 支持多图片上传
   - 编辑和删除车辆信息
   - 修改发布时间
   - 按联系电话搜索车辆信息

5. **生活服务管理**：
   - 添加生活服务信息，包括标题、分类、价格、地区等详细信息
   - 支持多图片上传
   - 编辑和删除生活服务信息
   - 修改发布时间
   - 按联系电话搜索生活服务信息

6. **审核管理**：
   - 查看所有待审核的信息
   - 支持审核通过和拒绝操作
   - 按联系电话搜索待审核信息

7. **用户管理**：
   - 查看所有用户信息
   - 编辑用户信息
   - 为用户充值金币
   - 删除用户
   - 按联系电话搜索用户

8. **联系我们管理**：
   - 编辑公司信息、联系方式
   - 上传付款二维码

9. **会员与广告服务管理**：
   - 编辑会员权益说明
   - 编辑广告服务内容

10. **网站简介管理**：
    - 编辑网站介绍内容
    - 编辑使用说明

### 用户中心

1. **注册**：支持个人用户和机构用户注册

2. **登录**：使用用户名和密码登录

3. **我的信息**：查看和编辑个人信息

4. **我的发布**：查看自己发布的所有信息

5. **金币充值**：查看金币余额，了解充值规则

6. **发布信息**：发布各类信息，扣除相应金币

## 注意事项

1. **数据库配置**：
   - 确保 MySQL 服务正在运行
   - 默认使用 root 用户和 123456 密码，如需修改请编辑 `server.ts` 文件

2. **端口设置**：
   - 后端服务器默认使用 3001 端口
   - 如需修改端口，请编辑 `server.ts` 文件中的 `port` 变量

3. **文件上传**：
   - 图片上传默认保存在 `client/public/uploads/` 目录
   - 单个图片大小限制为 5MB
   - 最多支持上传 4 张图片

4. **安全注意**：
   - 生产环境中请修改默认管理员密码
   - 建议启用 HTTPS
   - 定期备份数据库

5. **性能优化**：
   - 图片上传后会占用服务器空间，定期清理不需要的图片
   - 数据库查询可以根据实际情况添加索引

6. **常见问题**：
   - **端口被占用**：使用 `taskkill /F /IM node.exe` 终止占用端口的进程
   - **数据库连接失败**：检查 MySQL 服务是否运行，连接配置是否正确
   - **图片上传失败**：检查 uploads 目录权限，确保有写入权限

## 技术支持

如果在使用过程中遇到问题，请联系技术支持：
- 联系电话：<联系电话>
- 邮箱：<联系邮箱>
- 地址：<公司地址>

## 宝塔面板部署指南

宝塔面板是一款简单易用的服务器管理工具，可以帮助您快速部署和管理项目。以下是使用宝塔面板部署本项目的详细步骤：

### 1. 安装宝塔面板

1. **登录服务器**：使用 SSH 工具（如 PuTTY）登录您的服务器

2. **安装宝塔面板**：执行以下命令安装宝塔面板（CentOS 系统）
   ```bash
   yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
   ```
   
   对于 Ubuntu/Debian 系统：
   ```bash
   wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh
   ```

3. **获取登录信息**：安装完成后，会显示宝塔面板的登录地址、用户名和密码，请保存好这些信息

### 2. 环境配置

1. **登录宝塔面板**：在浏览器中访问宝塔面板登录地址，输入用户名和密码登录

2. **安装必要组件**：
   - 进入「软件商店」
   - 安装 **MySQL 5.7+**
   - 安装 **Nginx**

3. **手动安装Node.js**：
   - 进入「终端」
   - 执行以下命令安装Node.js 16（推荐版本）：
     ```bash
     # 下载Node.js 16
     wget https://nodejs.org/dist/v16.20.0/node-v16.20.0-linux-x64.tar.xz
     
     # 解压文件
     tar -xvf node-v16.20.0-linux-x64.tar.xz
     
     # 移动到/usr/local目录
     mv node-v16.20.0-linux-x64 /usr/local/node
     
     # 配置环境变量
     echo 'export NODE_HOME=/usr/local/node' >> /etc/profile
     echo 'export PATH=$NODE_HOME/bin:$PATH' >> /etc/profile
     source /etc/profile
     
     # 验证安装
     node -v
     npm -v
     ```

4. **创建数据库**：
   - 进入「数据库」
   - 点击「添加数据库」
   - 数据库名：`localcity`
   - 用户名：`localcity_user`（宝塔面板不允许使用root用户，请使用普通用户名）
   - 密码：`123456`（生产环境请使用强密码）
   - 点击「提交」

### 3. 项目部署

1. **创建网站**：
   - 进入「网站」
   - 点击「添加站点」
   - 域名：输入您的域名（如 `example.com`）
   - 根目录：选择一个目录（如 `/www/wwwroot/localcity`）
   - PHP版本：选择「纯静态」
   - 点击「提交」

2. **上传项目文件**：
   - 进入「文件」
   - 导航到网站根目录
   - 点击「上传」，上传项目的压缩包
   - 解压压缩包

3. **修改代码**：
   - **修改数据库连接配置**：
     - 编辑 `server.ts` 文件
     - 找到 `dbConfig` 部分，确保配置正确：
       ```typescript
       const dbConfig = {
         host: 'localhost',
         port: 3306,
         username: 'localcity_user',
         password: '123456', // 与宝塔面板中设置的密码一致
         database: 'localcity'
       };
       ```

   - **修改数据库初始化代码**：
     - 编辑 `server.ts` 文件
     - 找到 `initDatabase` 函数
     - 修改代码，跳过创建数据库的步骤，直接连接到已有的localcity数据库：
       ```typescript
       async function initDatabase(): Promise<boolean> {
         console.log('正在初始化数据库...');
         console.log(`连接配置: ${dbConfig.host}:${dbConfig.port}, 用户名: ${dbConfig.username}`);
         
         // 检测是否在沙箱环境中
         const isSandbox = isSandboxEnvironment();
         if (isSandbox) {
           console.log('⚠️  检测到沙箱环境，使用模拟数据库连接');
           // 在沙箱环境中模拟数据库连接成功
           console.log('✅ 模拟数据库连接成功');
           console.log('✅ 模拟数据库初始化完成');
           return true;
         }
         
         try {
           // 直接连接到localcity数据库，跳过创建数据库的步骤
           console.log('正在连接到localcity数据库...');
           global.sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
             host: dbConfig.host,
             port: dbConfig.port,
             dialect: 'mysql',
             logging: false,
             dialectOptions: {
               connectTimeout: 10000
             },
             pool: {
               max: 5,
               min: 0,
               acquire: 30000,
               idle: 10000
             }
           });
           
           await global.sequelize.authenticate();
           console.log('✅ 连接到localcity数据库成功');
           
           // 定义模型（保持原有的模型定义代码）
           // ...
           
           // 同步数据库模型
           console.log('开始同步数据库模型...');
           await global.sequelize.sync({ alter: true });
           console.log('✅ 数据库模型同步成功');
           
           // 初始化管理员账户
           const admin = await global.Admin.findOne({ where: { username: 'admin' } });
           if (!admin) {
             await global.Admin.create({ username: 'admin', password: '123456' });
             console.log('✅ 管理员账户初始化成功');
           }
           
           console.log('✅ 数据库初始化完成');
           return true;
         } catch (err) {
           console.error('❌ 数据库初始化失败:', (err as Error).message);
           console.error('请检查：');
           console.error('1. MySQL服务是否正在运行');
           console.error('2. 数据库连接配置是否正确');
           console.error('3. 网络连接是否正常');
           console.log('服务器将在没有数据库连接的情况下启动');
           return false;
         }
       }
       ```

   - **修改前端代理配置**：
     - 编辑 `client/vue.config.js` 文件
     - 确保代理配置指向正确的后端端口：
       ```javascript
       module.exports = {
         devServer: {
           proxy: {
             '/api': {
               target: 'http://localhost:3001', // 确保端口与后端一致
               changeOrigin: true,
               pathRewrite: {
                 '^/api': ''
               }
             }
           }
         }
       };
       ```

4. **安装依赖**：
   - 进入「终端」
   - 导航到项目根目录：`cd /www/wwwroot/localcity`
   - 安装后端依赖：`npm install`
   - 安装前端依赖：`cd client && npm install && npm run build && cd ..`

5. **配置进程管理**：
   - 进入「软件商店」
   - 安装 **PM2 管理器**
   - 进入 PM2 管理器
   - 点击「添加项目」
   - 项目名称：`localcity`
   - 启动文件：`npm`（使用npm来处理TypeScript文件）
   - 运行目录：`/www/wwwroot/localcity`
   - 运行用户：www
   - 端口：3001
   - 环境变量：NODE_ENV=production
   - 点击「提交」
   
   **注意**：如果遇到 "Interpreter bun is NOT AVAILABLE in PATH" 错误，请确保选择 `node` 作为解释器，而不是 `bun`，或者将启动文件设置为 `npm`。

6. **配置反向代理**：
   - 进入「网站」
   - 点击您的网站域名
   - 进入「反向代理」
   - 点击「添加反向代理」
   - 代理名称：`localcity-api`
   - 目标URL：`http://127.0.0.1:3001`
   - 发送域名：`$host`
   - 点击「提交」

### 4. 域名配置

1. **DNS解析**：在您的域名服务商处，将域名解析到服务器IP地址

2. **SSL证书**：
   - 进入「网站」
   - 点击您的网站域名
   - 进入「SSL」
   - 选择「Let's Encrypt」
   - 输入您的域名
   - 点击「申请」
   - 申请成功后，开启「强制HTTPS」

### 5. 访问系统

- 前端：`https://您的域名`
- 管理后台：`https://您的域名/admin`
- 管理员账号：`admin` / `123456`

### 6. 常见问题及解决方案

1. **PM2解释器问题**
   **问题**：PM2默认使用bun作为解释器，但系统中没有安装bun，导致启动失败。
   **解决方案**：在PM2添加项目时，将启动文件设置为`npm`，让npm来处理TypeScript文件的编译和运行。

2. **数据库连接问题**
   **问题**：服务器尝试使用root用户连接到MySQL，或尝试使用localcity_user用户连接到mysql数据库，导致权限被拒绝。
   **解决方案**：修改`server.ts`文件，跳过创建数据库的步骤，直接连接到已有的localcity数据库。

3. **数据库用户限制**
   **问题**：宝塔面板不允许使用root用户创建数据库。
   **解决方案**：使用`localcity_user`作为数据库用户名，而不是root用户。

4. **端口问题**
   **问题**：默认端口3000可能被占用。
   **解决方案**：在`server.ts`文件中使用端口3001，确保与前端代理配置一致。

5. **依赖安装问题**
   **问题**：缺少必要的依赖，如ts-node和typescript。
   **解决方案**：安装必要的依赖：
   ```bash
   npm install -g ts-node typescript
   ```

6. **文件权限问题**
   **问题**：上传文件夹权限不足，导致图片上传失败。
   **解决方案**：确保`client/public/uploads/`目录存在且有正确的权限。

7. **防火墙问题**
   **问题**：服务器防火墙阻止MySQL连接。
   **解决方案**：在宝塔面板的"安全"中开放3306端口。

8. **环境变量问题**
   **问题**：环境变量覆盖了数据库配置。
   **解决方案**：确保没有环境变量覆盖数据库配置，或在代码中明确指定配置。

## 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。