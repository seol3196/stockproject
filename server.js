const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stockInvestment', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Schemas
const stockSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true }
});

const investmentSchema = new mongoose.Schema({
  stockName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 }
});

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  studentName: { type: String, default: '' },
  password: { type: String, required: true },
  cashRemaining: { type: Number, default: 1000000 }, // Default starting cash
  investments: [investmentSchema]
});

// Create models
const Stock = mongoose.model('Stock', stockSchema);
const Student = mongoose.model('Student', studentSchema);

// 초기 데이터 생성 (DB가 비어있을 경우)
async function initializeData() {
  try {
    // 주식 데이터 초기화
    const stockCount = await Stock.countDocuments();
    if (stockCount === 0) {
      const initialStocks = [
        { name: '삼성전자', price: 70000 },
        { name: '현대자동차', price: 180000 },
        { name: '네이버', price: 350000 },
        { name: '카카오', price: 120000 },
        { name: 'LG전자', price: 95000 },
        { name: 'SK하이닉스', price: 110000 },
        { name: 'POSCO', price: 280000 },
        { name: 'KB금융', price: 45000 },
        { name: '신한금융', price: 35000 },
        { name: '셀트리온', price: 250000 }
      ];
      await Stock.insertMany(initialStocks);
      console.log('초기 주식 데이터가 생성되었습니다.');
    }
    
    // 학생 데이터 초기화
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      const initialStudents = [
        { email: '20is31e001@g.jbedu.kr', studentName: '강윤지', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e007@g.jbedu.kr', studentName: '김율이', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e008@g.jbedu.kr', studentName: '김준수', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e010@g.jbedu.kr', studentName: '김지호', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e011@g.jbedu.kr', studentName: '김채윤', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e017@g.jbedu.kr', studentName: '박현준', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e018@g.jbedu.kr', studentName: '배서영', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e022@g.jbedu.kr', studentName: '소유진', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e024@g.jbedu.kr', studentName: '송하율', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e027@g.jbedu.kr', studentName: '연지민', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e028@g.jbedu.kr', studentName: '유건우', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e030@g.jbedu.kr', studentName: '유하준', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e036@g.jbedu.kr', studentName: '이윤건', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e037@g.jbedu.kr', studentName: '이윤서', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e050@g.jbedu.kr', studentName: '장준규', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e041@g.jbedu.kr', studentName: '정결희', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e042@g.jbedu.kr', studentName: '정아인', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e043@g.jbedu.kr', studentName: '정이현', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e044@g.jbedu.kr', studentName: '조은재', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e045@g.jbedu.kr', studentName: '조현우', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e047@g.jbedu.kr', studentName: '채윤아', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e048@g.jbedu.kr', studentName: '최현아', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '20is31e049@g.jbedu.kr', studentName: '허성수', password: 'qwer1234', cashRemaining: 1000000, investments: [] },
        { email: '19is31e001@g.jbedu.kr', studentName: '홍서한', password: 'qwer1234', cashRemaining: 1000000, investments: [] }
      ];
      await Student.insertMany(initialStudents);
      console.log('초기 학생 데이터가 생성되었습니다.');
    }
  } catch (error) {
    console.error('초기 데이터 생성 오류:', error);
  }
}

// 서버 시작 시 초기 데이터 생성
initializeData();

// API Routes

// 인증 API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 이메일로 학생 찾기
    const student = await Student.findOne({ email });
    
    // 학생이 존재하지 않거나 비밀번호가 일치하지 않으면
    if (!student || student.password !== password) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    
    // 로그인 성공
    res.json({
      success: true,
      studentName: student.studentName
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ error: '로그인 처리 중 오류가 발생했습니다.' });
  }
});

// Get current user email
app.get('/api/user/email', (req, res) => {
  // 쿼리 파라미터에서 이메일 가져오기
  const email = req.query.email;
  
  if (!email) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }
  
  res.json(email);
});

// Get stock data
app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find({}, 'name price');
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Get student investment data
app.get('/api/student/investment', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find student or create if not exists
    let student = await Student.findOne({ email });
    
    if (!student) {
      student = new Student({
        email,
        studentName: '',
        cashRemaining: 1000000,
        investments: []
      });
      await student.save();
    }

    res.json({
      studentName: student.studentName,
      cashRemaining: student.cashRemaining,
      investments: student.investments
    });
  } catch (error) {
    console.error('Error fetching student investment:', error);
    res.status(500).json({ error: 'Failed to fetch student investment data' });
  }
});

// Save student investment
app.post('/api/student/investment', async (req, res) => {
  try {
    const { userEmail, studentName, cashRemaining, investments } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Update or create student
    const result = await Student.findOneAndUpdate(
      { email: userEmail },
      {
        studentName,
        cashRemaining,
        investments
      },
      { new: true, upsert: true }
    );

    res.json('투자 정보가 저장되었습니다!');
  } catch (error) {
    console.error('Error saving investment:', error);
    res.status(500).json({ error: 'Failed to save investment data' });
  }
});

// Evaluate portfolio
app.get('/api/student/portfolio', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Get student data
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get all stocks for pricing
    const stocks = await Stock.find({});
    const stockMap = {};
    stocks.forEach(stock => {
      stockMap[stock.name] = stock.price;
    });

    // Calculate portfolio values
    const cashRemaining = student.cashRemaining;
    const stockValues = [];
    let stockTotalValue = 0;

    student.investments.forEach(investment => {
      if (investment.quantity > 0) {
        const stockPrice = stockMap[investment.stockName] || 0;
        const value = stockPrice * investment.quantity;
        stockTotalValue += value;

        stockValues.push({
          stockName: investment.stockName,
          quantity: investment.quantity,
          price: stockPrice,
          value
        });
      }
    });

    const totalAssetValue = cashRemaining + stockTotalValue;

    res.json({
      cashRemaining,
      stockValues,
      stockTotalValue,
      totalAssetValue
    });
  } catch (error) {
    console.error('Error evaluating portfolio:', error);
    res.status(500).json({ error: 'Failed to evaluate portfolio' });
  }
});

// Admin route to add or update stocks
app.post('/api/admin/stocks', async (req, res) => {
  try {
    const { stocks } = req.body;
    
    if (!Array.isArray(stocks)) {
      return res.status(400).json({ error: 'Stocks must be an array' });
    }

    // Update or insert each stock
    const operations = stocks.map(stock => ({
      updateOne: {
        filter: { name: stock.name },
        update: { $set: { price: stock.price } },
        upsert: true
      }
    }));

    await Stock.bulkWrite(operations);
    res.json({ message: 'Stocks updated successfully' });
  } catch (error) {
    console.error('Error updating stocks:', error);
    res.status(500).json({ error: 'Failed to update stocks' });
  }
});

// Admin route to delete a stock
app.delete('/api/admin/stocks/:name', async (req, res) => {
  try {
    const stockName = req.params.name;
    
    // Delete the stock
    const result = await Stock.deleteOne({ name: stockName });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    // Also remove this stock from all students' investments
    await Student.updateMany(
      { 'investments.stockName': stockName },
      { $pull: { investments: { stockName: stockName } } }
    );
    
    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ error: 'Failed to delete stock' });
  }
});

// Admin route to get all students
app.get('/api/admin/students', async (req, res) => {
  try {
    const students = await Student.find({}, 'email studentName cashRemaining investments');
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
});

// Admin route to get a specific student
app.get('/api/admin/students/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const student = await Student.findOne({ email });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
});

// Admin route to update a student
app.put('/api/admin/students/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const { studentName, cashRemaining, investments, password } = req.body;
    
    const updateData = {};
    if (studentName !== undefined) updateData.studentName = studentName;
    if (cashRemaining !== undefined) updateData.cashRemaining = cashRemaining;
    if (investments !== undefined) updateData.investments = investments;
    if (password !== undefined) updateData.password = password;
    
    const student = await Student.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: '학생 정보가 업데이트되었습니다.', student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student data' });
  }
});

// Admin route to delete a student
app.delete('/api/admin/students/:email', async (req, res) => {
  try {
    const email = req.params.email;
    
    const result = await Student.deleteOne({ email });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: '학생이 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// 브라우저 캐시 방지를 위한 미들웨어
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
