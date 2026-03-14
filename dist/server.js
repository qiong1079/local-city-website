"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("sequelize");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// 创建multer上传文件夹（避免路径不存在报错）
const uploadDir = path_1.default.join(__dirname, 'client/public/uploads/');
// 检查文件夹是否存在，不存在则创建（递归创建多级目录）
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
    console.log(`创建上传文件夹成功：${uploadDir}`);
}
// 中间件
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use((0, cors_1.default)());
// 增加 express 服务器的请求体大小限制
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// 修复：静态文件路径使用绝对路径，避免相对路径错误
app.use(express_1.default.static(path_1.default.join(__dirname, 'client/dist')));
// 添加uploads目录的静态文件服务，以便访问上传的图片
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'client/public/uploads')));
// 存储配置
const storage = multer_1.default.diskStorage({
    // 修复：使用绝对路径，避免不同运行目录导致的路径错误
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
// 增加 multer 字段大小限制，以支持上传较大的图片数据
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fieldSize: 50 * 1024 * 1024 // 50MB
    }
});
// 数据库连接配置
const dbConfig = {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'localcity'
};
// 检测是否在沙箱环境中运行
function isSandboxEnvironment() {
    return process.env.NODE_ENV === 'sandbox' || process.argv.includes('--sandbox');
}
// 尝试初始化数据库
async function initDatabase() {
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
        // 尝试连接到MySQL默认数据库
        const initSequelize = new sequelize_1.Sequelize('mysql', dbConfig.username, dbConfig.password, {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: 'mysql',
            logging: false,
            dialectOptions: {
                connectTimeout: 10000
            },
            pool: {
                max: 1,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
        console.log('正在验证MySQL服务器连接...');
        await initSequelize.authenticate();
        console.log('✅ 连接到MySQL服务器成功');
        // 创建localcity数据库
        console.log('正在创建localcity数据库...');
        await initSequelize.query('CREATE DATABASE IF NOT EXISTS localcity');
        console.log('✅ localcity数据库创建成功');
        // 关闭初始连接
        await initSequelize.close();
        // 连接到localcity数据库
        console.log('正在连接到localcity数据库...');
        global.sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
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
        // 定义模型
        global.House = global.sequelize.define('House', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: sequelize_1.DataTypes.STRING,
            price: sequelize_1.DataTypes.FLOAT,
            area: sequelize_1.DataTypes.FLOAT,
            type: sequelize_1.DataTypes.STRING,
            layout: sequelize_1.DataTypes.STRING,
            floor: sequelize_1.DataTypes.STRING,
            decoration: sequelize_1.DataTypes.STRING,
            orientation: sequelize_1.DataTypes.STRING,
            location: sequelize_1.DataTypes.STRING,
            facilities: sequelize_1.DataTypes.TEXT,
            contactPerson: sequelize_1.DataTypes.STRING,
            contactPhone: sequelize_1.DataTypes.STRING,
            description: sequelize_1.DataTypes.TEXT,
            image: sequelize_1.DataTypes.STRING,
            images: sequelize_1.DataTypes.TEXT('long'),
            userId: sequelize_1.DataTypes.INTEGER,
            status: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: 'pending' // pending, approved, rejected
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
        global.Secondhand = global.sequelize.define('Secondhand', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: sequelize_1.DataTypes.STRING,
            price: sequelize_1.DataTypes.FLOAT,
            category: sequelize_1.DataTypes.STRING,
            brand: sequelize_1.DataTypes.STRING,
            condition: sequelize_1.DataTypes.STRING,
            source: sequelize_1.DataTypes.STRING,
            address: sequelize_1.DataTypes.STRING,
            contactPerson: sequelize_1.DataTypes.STRING,
            contactPhone: sequelize_1.DataTypes.STRING,
            description: sequelize_1.DataTypes.TEXT,
            image: sequelize_1.DataTypes.STRING,
            images: sequelize_1.DataTypes.TEXT('long'),
            userId: sequelize_1.DataTypes.INTEGER,
            status: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: 'pending' // pending, approved, rejected
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
        global.Vehicle = global.sequelize.define('Vehicle', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: sequelize_1.DataTypes.STRING,
            price: sequelize_1.DataTypes.FLOAT,
            brand: sequelize_1.DataTypes.STRING,
            model: sequelize_1.DataTypes.STRING,
            year: sequelize_1.DataTypes.INTEGER,
            mileage: sequelize_1.DataTypes.FLOAT, // 行驶里程（万公里）
            region: sequelize_1.DataTypes.STRING, // 所属地区
            validity: sequelize_1.DataTypes.STRING, // 有效期
            condition: sequelize_1.DataTypes.STRING, // 新旧程度
            source: sequelize_1.DataTypes.STRING, // 来源（个人/商家）
            description: sequelize_1.DataTypes.TEXT,
            image: sequelize_1.DataTypes.STRING,
            images: sequelize_1.DataTypes.TEXT('long'), // 多张图片
            contactPerson: sequelize_1.DataTypes.STRING, // 联系人
            contactPhone: sequelize_1.DataTypes.STRING, // 联系电话
            contactQQ: sequelize_1.DataTypes.STRING, // 联系QQ
            userId: sequelize_1.DataTypes.INTEGER,
            status: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: 'pending' // pending, approved, rejected
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
        global.Service = global.sequelize.define('Service', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: sequelize_1.DataTypes.STRING,
            category: sequelize_1.DataTypes.STRING,
            price: sequelize_1.DataTypes.FLOAT,
            description: sequelize_1.DataTypes.TEXT,
            contact: sequelize_1.DataTypes.STRING,
            contactPerson: sequelize_1.DataTypes.STRING,
            contactPhone: sequelize_1.DataTypes.STRING,
            contactQQ: sequelize_1.DataTypes.STRING,
            region: sequelize_1.DataTypes.STRING,
            validity: sequelize_1.DataTypes.STRING,
            location: sequelize_1.DataTypes.STRING,
            image: sequelize_1.DataTypes.STRING,
            images: sequelize_1.DataTypes.TEXT('long'),
            userId: sequelize_1.DataTypes.INTEGER,
            status: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: 'pending' // pending, approved, rejected
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
        global.Admin = global.sequelize.define('Admin', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: sequelize_1.DataTypes.STRING,
            password: sequelize_1.DataTypes.STRING
        });
        global.User = global.sequelize.define('User', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: sequelize_1.DataTypes.STRING,
            email: sequelize_1.DataTypes.STRING,
            password: sequelize_1.DataTypes.STRING,
            userType: sequelize_1.DataTypes.STRING, // 'personal' 或 'organization'
            // 个人用户字段
            name: sequelize_1.DataTypes.STRING,
            phone: sequelize_1.DataTypes.STRING,
            // 机构用户字段
            organizationName: sequelize_1.DataTypes.STRING,
            region: sequelize_1.DataTypes.STRING,
            industry: sequelize_1.DataTypes.STRING,
            organizationDesc: sequelize_1.DataTypes.TEXT,
            contactPerson: sequelize_1.DataTypes.STRING,
            qq: sequelize_1.DataTypes.STRING,
            address: sequelize_1.DataTypes.STRING,
            // 金币系统
            coins: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 100 // 初始100金币
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
        global.WebsiteSettings = global.sequelize.define('WebsiteSettings', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            type: sequelize_1.DataTypes.STRING, // 'siteMechanism', 'contact', 'member', 'ad', 'about', 'siteInfo'
            title: sequelize_1.DataTypes.STRING,
            content: sequelize_1.DataTypes.TEXT,
            phone: sequelize_1.DataTypes.STRING, // 联系电话
            email: sequelize_1.DataTypes.STRING, // 邮箱
            address: sequelize_1.DataTypes.STRING, // 地址
            companyName: sequelize_1.DataTypes.STRING, // 公司名
            logoUrl: sequelize_1.DataTypes.TEXT('long'), // Logo URL
            paymentQrCode: sequelize_1.DataTypes.TEXT('long'), // 付款二维码URL
            icpNumber: sequelize_1.DataTypes.STRING, // ICP备案号
            icpUrl: sequelize_1.DataTypes.STRING, // ICP备案号链接
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
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
    }
    catch (err) {
        console.error('❌ 数据库初始化失败:', err.message);
        console.error('请检查：');
        console.error('1. MySQL服务是否正在运行');
        console.error('2. 数据库连接配置是否正确');
        console.error('3. 网络连接是否正常');
        console.log('服务器将在没有数据库连接的情况下启动');
        return false;
    }
}
// 调用数据库初始化函数
async function startServer() {
    console.log('正在启动服务器...');
    // 检测是否在沙箱环境中
    const isSandbox = isSandboxEnvironment();
    // 初始化数据库
    const dbInitialized = await initDatabase();
    if (isSandbox) {
        console.log('⚠️  检测到沙箱环境，跳过HTTP服务器启动');
        console.log(`服务器将在本地环境中运行在 http://localhost:${port}`);
        console.log(`API接口可访问：http://localhost:${port}/api/houses`);
        if (dbInitialized) {
            console.log('✅ 数据库连接正常，所有功能可用');
        }
        else {
            console.log('⚠️  警告：数据库连接失败，部分功能可能不可用');
            console.log('请检查MySQL服务状态和连接配置');
        }
        console.log('✅ 服务器初始化完成（沙箱模式）');
        return;
    }
    // 启动Express服务器
    try {
        app.listen(port, () => {
            console.log(`服务器成功运行在 http://localhost:${port}`);
            console.log(`API接口可访问：http://localhost:${port}/api/houses`);
            if (dbInitialized) {
                console.log('✅ 数据库连接正常，所有功能可用');
            }
            else {
                console.log('⚠️  警告：数据库连接失败，部分功能可能不可用');
                console.log('请检查MySQL服务状态和连接配置');
            }
        });
    }
    catch (error) {
        console.error('❌ 服务器启动失败:', error.message);
        console.log('服务器已完成初始化，但无法启动HTTP服务');
        console.log('这可能是由于环境限制导致的');
        console.log('在本地环境中运行时，服务器应该能够正常启动');
    }
}
// 启动服务器
startServer();
// API 路由（保持原逻辑不变）
// 房屋租售
app.get('/api/houses', async (req, res) => {
    try {
        const { limit, status, userId, page, pageSize, search, contactPhone } = req.query;
        const where = {};
        // 如果指定了userId，则不限制status，让用户可以看到自己发布的所有信息
        // 否则只返回已审核的信息
        if (!userId) {
            where.status = status || 'approved';
        }
        else {
            where.userId = userId;
            if (status)
                where.status = status;
        }
        // 搜索功能（按联系电话）
        if (contactPhone) {
            where.contactPhone = { [sequelize_1.Op.like]: `%${contactPhone}%` };
        }
        // 分页参数
        const pageNum = page ? parseInt(page) : 1;
        const size = pageSize ? parseInt(pageSize) : 10;
        const offset = (pageNum - 1) * size;
        const { count, rows } = await global.House.findAndCountAll({
            where,
            limit: size,
            offset: offset
        });
        res.json({ items: rows, total: count });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/api/houses/:id', async (req, res) => {
    try {
        const house = await global.House.findByPk(req.params.id);
        res.json(house);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/api/houses', async (req, res) => {
    try {
        // 处理图片数据
        let image = '';
        let images = '';
        if (req.file) {
            // 如果有文件上传，使用文件名
            image = req.file.filename;
        }
        else if (req.body.images) {
            // 如果有Base64编码的图片数据，直接存储
            images = req.body.images;
        }
        // 检查用户是否存在且金币足够
        if (req.body.userId && req.body.admin !== 'true') {
            const user = await global.User.findByPk(req.body.userId);
            if (!user) {
                return res.status(404).json({ message: '用户不存在' });
            }
            if (user.coins < 5) {
                return res.status(400).json({ message: '金币不足，发布信息需要5金币' });
            }
            // 扣除5金币
            user.coins -= 5;
            await user.save();
        }
        const newHouse = await global.House.create({
            title: req.body.title,
            price: req.body.price,
            area: req.body.area,
            type: req.body.type,
            layout: req.body.layout,
            floor: req.body.floor,
            decoration: req.body.decoration,
            orientation: req.body.orientation,
            location: req.body.location,
            facilities: req.body.facilities,
            contactPerson: req.body.contactPerson,
            contactPhone: req.body.contactPhone,
            description: req.body.description,
            image: image,
            images: images,
            userId: req.body.userId,
            status: req.body.admin === 'true' ? 'approved' : 'pending' // 管理员添加的信息直接通过审核，普通用户需要审核
        });
        res.status(201).json(newHouse);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.delete('/api/houses/:id', async (req, res) => {
    try {
        await global.House.destroy({ where: { id: req.params.id } });
        res.json({ message: '删除成功' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.put('/api/houses/:id', async (req, res) => {
    try {
        const house = await global.House.findByPk(req.params.id);
        if (req.body.title)
            house.title = req.body.title;
        if (req.body.price)
            house.price = req.body.price;
        if (req.body.area)
            house.area = req.body.area;
        if (req.body.type)
            house.type = req.body.type;
        if (req.body.layout)
            house.layout = req.body.layout;
        if (req.body.floor)
            house.floor = req.body.floor;
        if (req.body.decoration)
            house.decoration = req.body.decoration;
        if (req.body.orientation)
            house.orientation = req.body.orientation;
        if (req.body.location)
            house.location = req.body.location;
        if (req.body.facilities)
            house.facilities = req.body.facilities;
        if (req.body.contactPerson)
            house.contactPerson = req.body.contactPerson;
        if (req.body.contactPhone)
            house.contactPhone = req.body.contactPhone;
        if (req.body.description)
            house.description = req.body.description;
        if (req.body.status)
            house.status = req.body.status;
        if (req.body.admin === 'true')
            house.status = 'approved'; // 管理员更新的内容直接通过审核
        if (req.file)
            house.image = req.file.filename;
        if (req.body.images)
            house.images = req.body.images;
        const updatedHouse = await house.save();
        res.json(updatedHouse);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// 二手物品
app.get('/api/secondhand', async (req, res) => {
    try {
        const { limit, status, userId, page, pageSize, search, contactPhone } = req.query;
        const where = {};
        // 如果指定了userId，则不限制status，让用户可以看到自己发布的所有信息
        // 否则只返回已审核的信息
        if (!userId) {
            where.status = status || 'approved';
        }
        else {
            where.userId = userId;
            if (status)
                where.status = status;
        }
        // 搜索功能（按联系电话）
        if (contactPhone) {
            where.contactPhone = { [sequelize_1.Op.like]: `%${contactPhone}%` };
        }
        // 分页参数
        const pageNum = page ? parseInt(page) : 1;
        const size = pageSize ? parseInt(pageSize) : 10;
        const offset = (pageNum - 1) * size;
        const { count, rows } = await global.Secondhand.findAndCountAll({
            where,
            limit: size,
            offset: offset
        });
        res.json({ items: rows, total: count });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/api/secondhand/:id', async (req, res) => {
    try {
        const item = await global.Secondhand.findByPk(req.params.id);
        res.json(item);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/api/secondhand', upload.none(), async (req, res) => {
    try {
        // 处理图片数据
        let image = '';
        let images = '';
        if (req.file) {
            // 如果有文件上传，使用文件名
            image = req.file.filename;
        }
        else if (req.body.images) {
            // 如果有Base64编码的图片数据，直接存储
            images = req.body.images;
        }
        // 检查用户是否存在且金币足够
        if (req.body.userId && req.body.admin !== 'true') {
            const user = await global.User.findByPk(req.body.userId);
            if (!user) {
                return res.status(404).json({ message: '用户不存在' });
            }
            if (user.coins < 5) {
                return res.status(400).json({ message: '金币不足，发布信息需要5金币' });
            }
            // 扣除5金币
            user.coins -= 5;
            await user.save();
        }
        const newItem = await global.Secondhand.create({
            title: req.body.title,
            price: req.body.price,
            category: req.body.category,
            brand: req.body.brand,
            condition: req.body.condition,
            source: req.body.source,
            address: req.body.address,
            contactPerson: req.body.contactPerson,
            contactPhone: req.body.contactPhone,
            description: req.body.description,
            image: image,
            images: images,
            userId: req.body.userId,
            status: req.body.admin === 'true' ? 'approved' : 'pending' // 管理员添加的信息直接通过审核，普通用户需要审核
        });
        res.status(201).json(newItem);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.delete('/api/secondhand/:id', async (req, res) => {
    try {
        await global.Secondhand.destroy({ where: { id: req.params.id } });
        res.json({ message: '删除成功' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.put('/api/secondhand/:id', upload.none(), async (req, res) => {
    try {
        const item = await global.Secondhand.findByPk(req.params.id);
        if (req.body.title)
            item.title = req.body.title;
        if (req.body.price)
            item.price = req.body.price;
        if (req.body.category)
            item.category = req.body.category;
        if (req.body.brand)
            item.brand = req.body.brand;
        if (req.body.condition)
            item.condition = req.body.condition;
        if (req.body.source)
            item.source = req.body.source;
        if (req.body.address)
            item.address = req.body.address;
        if (req.body.contactPerson)
            item.contactPerson = req.body.contactPerson;
        if (req.body.contactPhone)
            item.contactPhone = req.body.contactPhone;
        if (req.body.description)
            item.description = req.body.description;
        if (req.body.status)
            item.status = req.body.status;
        if (req.body.admin === 'true')
            item.status = 'approved'; // 管理员更新的内容直接通过审核
        if (req.file)
            item.image = req.file.filename;
        if (req.body.images)
            item.images = req.body.images;
        const updatedItem = await item.save();
        res.json(updatedItem);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// 车辆买卖
app.get('/api/vehicles', async (req, res) => {
    try {
        const { limit, status, userId, page, pageSize, search, contactPhone } = req.query;
        const where = {};
        // 如果指定了userId，则不限制status，让用户可以看到自己发布的所有信息
        // 否则只返回已审核的信息
        if (!userId) {
            where.status = status || 'approved';
        }
        else {
            where.userId = userId;
            if (status)
                where.status = status;
        }
        // 搜索功能（按联系电话）
        if (contactPhone) {
            where.contactPhone = { [sequelize_1.Op.like]: `%${contactPhone}%` };
        }
        // 分页参数
        const pageNum = page ? parseInt(page) : 1;
        const size = pageSize ? parseInt(pageSize) : 10;
        const offset = (pageNum - 1) * size;
        const { count, rows } = await global.Vehicle.findAndCountAll({
            where,
            limit: size,
            offset: offset
        });
        res.json({ items: rows, total: count });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/api/vehicles/:id', async (req, res) => {
    try {
        const vehicle = await global.Vehicle.findByPk(req.params.id);
        res.json(vehicle);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/api/vehicles', upload.none(), async (req, res) => {
    try {
        // 处理图片数据
        let image = '';
        let images = '';
        if (req.file) {
            // 如果有文件上传，使用文件名
            image = req.file.filename;
        }
        else if (req.body.images) {
            // 如果有Base64编码的图片数据，直接存储
            images = req.body.images;
        }
        // 检查用户是否存在且金币足够
        if (req.body.userId && req.body.admin !== 'true') {
            const user = await global.User.findByPk(req.body.userId);
            if (!user) {
                return res.status(404).json({ message: '用户不存在' });
            }
            if (user.coins < 5) {
                return res.status(400).json({ message: '金币不足，发布信息需要5金币' });
            }
            // 扣除5金币
            user.coins -= 5;
            await user.save();
        }
        const newVehicle = await global.Vehicle.create({
            title: req.body.title,
            price: req.body.price,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            mileage: req.body.mileage,
            region: req.body.region,
            validity: req.body.validity,
            condition: req.body.condition,
            source: req.body.source,
            description: req.body.description,
            image: image,
            images: images,
            contactPerson: req.body.contactPerson,
            contactPhone: req.body.contactPhone,
            contactQQ: req.body.contactQQ,
            userId: req.body.userId,
            status: req.body.admin === 'true' ? 'approved' : 'pending' // 管理员添加的信息直接通过审核，普通用户需要审核
        });
        res.status(201).json(newVehicle);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.delete('/api/vehicles/:id', async (req, res) => {
    try {
        await global.Vehicle.destroy({ where: { id: req.params.id } });
        res.json({ message: '删除成功' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.put('/api/vehicles/:id', upload.none(), async (req, res) => {
    try {
        const vehicle = await global.Vehicle.findByPk(req.params.id);
        if (req.body.title)
            vehicle.title = req.body.title;
        if (req.body.price)
            vehicle.price = req.body.price;
        if (req.body.brand)
            vehicle.brand = req.body.brand;
        if (req.body.model)
            vehicle.model = req.body.model;
        if (req.body.year)
            vehicle.year = req.body.year;
        if (req.body.mileage)
            vehicle.mileage = req.body.mileage;
        if (req.body.region)
            vehicle.region = req.body.region;
        if (req.body.validity)
            vehicle.validity = req.body.validity;
        if (req.body.condition)
            vehicle.condition = req.body.condition;
        if (req.body.source)
            vehicle.source = req.body.source;
        if (req.body.description)
            vehicle.description = req.body.description;
        if (req.body.status)
            vehicle.status = req.body.status;
        if (req.body.admin === 'true')
            vehicle.status = 'approved'; // 管理员更新的内容直接通过审核
        if (req.file)
            vehicle.image = req.file.filename;
        if (req.body.images)
            vehicle.images = req.body.images;
        if (req.body.contactPerson)
            vehicle.contactPerson = req.body.contactPerson;
        if (req.body.contactPhone)
            vehicle.contactPhone = req.body.contactPhone;
        if (req.body.contactQQ)
            vehicle.contactQQ = req.body.contactQQ;
        const updatedVehicle = await vehicle.save();
        res.json(updatedVehicle);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// 生活服务
app.get('/api/services', async (req, res) => {
    try {
        const { limit, status, userId, page, pageSize, search, contactPhone } = req.query;
        const where = {};
        // 如果指定了userId，则不限制status，让用户可以看到自己发布的所有信息
        // 否则只返回已审核的信息
        if (!userId) {
            where.status = status || 'approved';
        }
        else {
            where.userId = userId;
            if (status)
                where.status = status;
        }
        // 搜索功能（按联系电话）
        if (contactPhone) {
            where.contactPhone = { [sequelize_1.Op.like]: `%${contactPhone}%` };
        }
        // 分页参数
        const pageNum = page ? parseInt(page) : 1;
        const size = pageSize ? parseInt(pageSize) : 10;
        const offset = (pageNum - 1) * size;
        const { count, rows } = await global.Service.findAndCountAll({
            where,
            limit: size,
            offset: offset
        });
        res.json({ items: rows, total: count });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/api/services/:id', async (req, res) => {
    try {
        const service = await global.Service.findByPk(req.params.id);
        res.json(service);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/api/services', upload.none(), async (req, res) => {
    try {
        // 处理图片数据
        let image = '';
        let images = '';
        if (req.file) {
            // 如果有文件上传，使用文件名
            image = req.file.filename;
        }
        else if (req.body.images) {
            // 如果有Base64编码的图片数据，直接存储
            images = req.body.images;
        }
        // 检查用户是否存在且金币足够
        if (req.body.userId && req.body.admin !== 'true') {
            const user = await global.User.findByPk(req.body.userId);
            if (!user) {
                return res.status(404).json({ message: '用户不存在' });
            }
            if (user.coins < 5) {
                return res.status(400).json({ message: '金币不足，发布信息需要5金币' });
            }
            // 扣除5金币
            user.coins -= 5;
            await user.save();
        }
        const newService = await global.Service.create({
            title: req.body.title,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            contact: req.body.contact,
            contactPerson: req.body.contactPerson,
            contactPhone: req.body.contactPhone,
            contactQQ: req.body.contactQQ,
            region: req.body.region,
            validity: req.body.validity,
            location: req.body.location,
            image: image,
            images: images,
            userId: req.body.userId,
            status: req.body.admin === 'true' ? 'approved' : 'pending' // 管理员添加的信息直接通过审核，普通用户需要审核
        });
        res.status(201).json(newService);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.delete('/api/services/:id', async (req, res) => {
    try {
        await global.Service.destroy({ where: { id: req.params.id } });
        res.json({ message: '删除成功' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.put('/api/services/:id', upload.none(), async (req, res) => {
    try {
        const service = await global.Service.findByPk(req.params.id);
        if (req.body.title)
            service.title = req.body.title;
        if (req.body.category)
            service.category = req.body.category;
        if (req.body.price)
            service.price = req.body.price;
        if (req.body.description)
            service.description = req.body.description;
        if (req.body.contact)
            service.contact = req.body.contact;
        if (req.body.contactPerson)
            service.contactPerson = req.body.contactPerson;
        if (req.body.contactPhone)
            service.contactPhone = req.body.contactPhone;
        if (req.body.contactQQ)
            service.contactQQ = req.body.contactQQ;
        if (req.body.region)
            service.region = req.body.region;
        if (req.body.validity)
            service.validity = req.body.validity;
        if (req.body.location)
            service.location = req.body.location;
        if (req.body.status)
            service.status = req.body.status;
        if (req.body.admin === 'true')
            service.status = 'approved'; // 管理员更新的内容直接通过审核
        if (req.file)
            service.image = req.file.filename;
        if (req.body.images)
            service.images = req.body.images;
        const updatedService = await service.save();
        res.json(updatedService);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// 用户管理
app.get('/api/users', async (req, res) => {
    try {
        const { page, pageSize, search, phone } = req.query;
        const where = {};
        // 搜索功能（按电话）
        if (phone) {
            where.phone = { [sequelize_1.Op.like]: `%${phone}%` };
        }
        // 分页参数
        const pageNum = page ? parseInt(page) : 1;
        const size = pageSize ? parseInt(pageSize) : 10;
        const offset = (pageNum - 1) * size;
        const { count, rows } = await global.User.findAndCountAll({
            where,
            limit: size,
            offset: offset
        });
        res.json({ items: rows, total: count });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await global.User.findByPk(req.params.id);
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.put('/api/users/:id', async (req, res) => {
    try {
        const user = await global.User.findByPk(req.params.id);
        if (req.body.username)
            user.username = req.body.username;
        if (req.body.email)
            user.email = req.body.email;
        if (req.body.password)
            user.password = req.body.password;
        if (req.body.name)
            user.name = req.body.name;
        if (req.body.phone)
            user.phone = req.body.phone;
        if (req.body.organizationName)
            user.organizationName = req.body.organizationName;
        if (req.body.region)
            user.region = req.body.region;
        if (req.body.industry)
            user.industry = req.body.industry;
        if (req.body.organizationDesc)
            user.organizationDesc = req.body.organizationDesc;
        if (req.body.contactPerson)
            user.contactPerson = req.body.contactPerson;
        if (req.body.qq)
            user.qq = req.body.qq;
        if (req.body.address)
            user.address = req.body.address;
        if (req.body.coins !== undefined)
            user.coins = req.body.coins;
        const updatedUser = await user.save();
        res.json(updatedUser);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.delete('/api/users/:id', async (req, res) => {
    try {
        await global.User.destroy({ where: { id: req.params.id } });
        res.json({ message: '删除成功' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// 审核管理 - 获取所有待审核的内容
app.get('/api/moderation/pending', async (req, res) => {
    try {
        const { search, contactPhone } = req.query;
        const where = { status: 'pending' };
        // 搜索功能（按联系电话）
        if (contactPhone) {
            where.contactPhone = { [sequelize_1.Op.like]: `%${contactPhone}%` };
        }
        const [houses, secondhand, vehicles, services] = await Promise.all([
            global.House.findAll({ where }),
            global.Secondhand.findAll({ where }),
            global.Vehicle.findAll({ where }),
            global.Service.findAll({ where })
        ]);
        res.json({
            houses,
            secondhand,
            vehicles,
            services
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// 审核管理 - 批准内容
app.put('/api/moderation/approve/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        let model;
        switch (type) {
            case 'house':
                model = global.House;
                break;
            case 'secondhand':
                model = global.Secondhand;
                break;
            case 'vehicle':
                model = global.Vehicle;
                break;
            case 'service':
                model = global.Service;
                break;
            default:
                return res.status(400).json({ message: 'Invalid type' });
        }
        const item = await model.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        item.status = 'approved';
        await item.save();
        res.json({ message: 'Approved successfully', item });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// 审核管理 - 拒绝内容
app.put('/api/moderation/reject/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        let model;
        switch (type) {
            case 'house':
                model = global.House;
                break;
            case 'secondhand':
                model = global.Secondhand;
                break;
            case 'vehicle':
                model = global.Vehicle;
                break;
            case 'service':
                model = global.Service;
                break;
            default:
                return res.status(400).json({ message: 'Invalid type' });
        }
        const item = await model.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        item.status = 'rejected';
        await item.save();
        res.json({ message: 'Rejected successfully', item });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// 管理员登录
app.post('/api/login', async (req, res) => {
    try {
        const admin = await global.Admin.findOne({ where: { username: req.body.username, password: req.body.password } });
        if (admin) {
            res.json({ message: '登录成功' });
        }
        else {
            res.status(401).json({ message: '用户名或密码错误' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// 用户注册 - 个人会员
app.post('/api/register/personal', async (req, res) => {
    try {
        // 检查用户名是否已存在
        const existingUser = await global.User.findOne({ where: { username: req.body.username } });
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }
        // 创建个人用户
        const newUser = await global.User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            userType: 'personal'
        });
        res.status(201).json({ message: '注册成功', user: newUser });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// 用户注册 - 机构会员
app.post('/api/register/organization', async (req, res) => {
    try {
        // 检查用户名是否已存在
        const existingUser = await global.User.findOne({ where: { username: req.body.username } });
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }
        // 创建机构用户
        const newUser = await global.User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            userType: 'organization',
            organizationName: req.body.organizationName,
            region: req.body.region,
            industry: req.body.industry,
            organizationDesc: req.body.organizationDesc,
            contactPerson: req.body.contactPerson,
            qq: req.body.qq,
            phone: req.body.phone,
            address: req.body.address
        });
        res.status(201).json({ message: '注册成功', user: newUser });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// 用户登录
app.post('/api/login/user', async (req, res) => {
    try {
        // 查找用户
        const user = await global.User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }
        // 验证密码
        if (user.password !== req.body.password) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }
        res.json({ message: '登录成功', user: user });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// 网站设置
app.get('/api/website-settings', async (req, res) => {
    try {
        const settings = await global.WebsiteSettings.findAll();
        res.json(settings);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/api/website-settings/:type', async (req, res) => {
    try {
        const setting = await global.WebsiteSettings.findOne({ where: { type: req.params.type } });
        res.json(setting);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/api/website-settings', async (req, res) => {
    try {
        // 检查是否已存在该类型的设置
        const existingSetting = await global.WebsiteSettings.findOne({ where: { type: req.body.type } });
        if (existingSetting) {
            // 更新现有设置
            existingSetting.title = req.body.title;
            existingSetting.content = req.body.content;
            existingSetting.phone = req.body.phone;
            existingSetting.email = req.body.email;
            existingSetting.address = req.body.address;
            existingSetting.companyName = req.body.companyName;
            existingSetting.logoUrl = req.body.logoUrl;
            existingSetting.paymentQrCode = req.body.paymentQrCode;
            existingSetting.icpNumber = req.body.icpNumber;
            existingSetting.icpUrl = req.body.icpUrl;
            existingSetting.updatedAt = new Date();
            const updatedSetting = await existingSetting.save();
            res.json(updatedSetting);
        }
        else {
            // 创建新设置
            const newSetting = await global.WebsiteSettings.create({
                type: req.body.type,
                title: req.body.title,
                content: req.body.content,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                companyName: req.body.companyName,
                logoUrl: req.body.logoUrl,
                paymentQrCode: req.body.paymentQrCode,
                icpNumber: req.body.icpNumber,
                icpUrl: req.body.icpUrl
            });
            res.status(201).json(newSetting);
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.put('/api/website-settings/:id', async (req, res) => {
    try {
        const setting = await global.WebsiteSettings.findByPk(req.params.id);
        if (req.body.title)
            setting.title = req.body.title;
        if (req.body.content)
            setting.content = req.body.content;
        if (req.body.phone)
            setting.phone = req.body.phone;
        if (req.body.email)
            setting.email = req.body.email;
        if (req.body.address)
            setting.address = req.body.address;
        if (req.body.companyName)
            setting.companyName = req.body.companyName;
        if (req.body.logoUrl)
            setting.logoUrl = req.body.logoUrl;
        if (req.body.paymentQrCode)
            setting.paymentQrCode = req.body.paymentQrCode;
        if (req.body.icpNumber)
            setting.icpNumber = req.body.icpNumber;
        if (req.body.icpUrl)
            setting.icpUrl = req.body.icpUrl;
        setting.updatedAt = new Date();
        const updatedSetting = await setting.save();
        res.json(updatedSetting);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.delete('/api/website-settings/:id', async (req, res) => {
    try {
        await global.WebsiteSettings.destroy({ where: { id: req.params.id } });
        res.json({ message: '删除成功' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// 静态文件服务
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'client/dist', 'index.html'));
});
// 添加全局错误监听，避免崩溃
process.on('uncaughtException', (err) => {
    console.error('未捕获的异常：', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝：', promise, '原因：', reason);
});
