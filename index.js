const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// Hàm hỗ trợ đọc file an toàn để tránh crash server
const readData = (fileName) => {
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, JSON.stringify([], null, 2));
        return [];
    }
    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
};

const categories = readData('./categories.json');
const products = readData('./products.json');

// ==================== FIX LỖI "CANNOT GET /" ====================
app.get('/', (req, res) => {
    res.send('<h1>Server của Hồ Thái Phong đang chạy!</h1><p>Hãy truy cập <a href="/api/v1/categories">/api/v1/categories</a> để xem dữ liệu.</p>');
});

// ==================== CATEGORIES API ====================

// 1. GET all categories (Hỗ trợ truy vấn theo name)
app.get('/api/v1/categories', (req, res) => {
    const { name } = req.query;
    let result = categories;
    if (name) {
        result = categories.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
    }
    res.json(result);
});

// 2. GET category by ID
app.get('/api/v1/categories/:id', (req, res) => {
    const category = categories.find(c => c.id == req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
});

// 3. GET all products by category ID (Yêu cầu bài tập)
app.get('/api/v1/categories/:id/products', (req, res) => {
    const categoryId = Number(req.params.id);
    const result = products.filter(p => p.categoryId === categoryId);
    res.json(result);
});

// ... (Các hàm POST, PUT, DELETE giữ nguyên như code cũ của bạn) ...

// ==================== START SERVER ====================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server chạy thành công tại: http://localhost:${PORT}`);
    console.log('🚀 Nhấn Ctrl + C để dừng server.');
});