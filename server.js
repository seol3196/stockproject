const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { Parser } = require('json2csv');
const multer = require('multer');
const csv = require('csv-parse');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 캐시 방지 미들웨어 추가
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

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
  cashRemaining: { type: Number, default: 300000 }, // 현금
  savings: { type: Number, default: 0 }, // 저축 금액
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
        { name: 'D그룹', price: 100000 },
        { name: 'S정유', price: 50000 },
        { name: 'H시멘트', price: 20000 },
        { name: 'K의류', price: 10000 },
        { name: 'H자동차', price: 30000 },
        { name: 'A조선', price: 5000 },
        { name: 'P철강', price: 5000 }
      ];
      await Stock.insertMany(initialStocks);
      console.log('초기 주식 데이터가 생성되었습니다.');
    }
    
    // 학생 데이터 초기화
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      const initialStudents = [
        { email: '20is31e001@g.jbedu.kr', studentName: '강윤지', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e007@g.jbedu.kr', studentName: '김율이', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e008@g.jbedu.kr', studentName: '김준수', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e010@g.jbedu.kr', studentName: '김지호', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e011@g.jbedu.kr', studentName: '김채윤', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e017@g.jbedu.kr', studentName: '박현준', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e018@g.jbedu.kr', studentName: '배서영', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e022@g.jbedu.kr', studentName: '소유진', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e024@g.jbedu.kr', studentName: '송하율', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e027@g.jbedu.kr', studentName: '연지민', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e028@g.jbedu.kr', studentName: '유건우', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e030@g.jbedu.kr', studentName: '유하준', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e036@g.jbedu.kr', studentName: '이윤건', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e037@g.jbedu.kr', studentName: '이윤서', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e050@g.jbedu.kr', studentName: '장준규', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e041@g.jbedu.kr', studentName: '정결희', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e042@g.jbedu.kr', studentName: '정아인', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e043@g.jbedu.kr', studentName: '정이현', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e044@g.jbedu.kr', studentName: '조은재', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e045@g.jbedu.kr', studentName: '조현우', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e047@g.jbedu.kr', studentName: '채윤아', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e048@g.jbedu.kr', studentName: '최현아', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '20is31e049@g.jbedu.kr', studentName: '허성수', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] },
        { email: '19is31e001@g.jbedu.kr', studentName: '홍서한', password: 'qwer1234', cashRemaining: 300000, savings: 0, investments: [] }
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
        savings: 0,
        investments: []
      });
      await student.save();
    }

    res.json({
      studentName: student.studentName,
      cashRemaining: student.cashRemaining,
      savings: student.savings,
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
    const { userEmail, studentName, cashRemaining, savings, investments } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Update or create student
    const result = await Student.findOneAndUpdate(
      { email: userEmail },
      {
        studentName,
        cashRemaining,
        savings,
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
    const savings = student.savings;
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

    const totalAssetValue = cashRemaining + savings + stockTotalValue;

    res.json({
      cashRemaining,
      savings,
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
    const students = await Student.find({}, 'email studentName cashRemaining savings investments');
    res.json(students);
  } catch (error) {
    console.error('학생 목록 조회 오류:', error);
    res.status(500).json({ error: '학생 데이터 조회 중 오류가 발생했습니다.' });
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
    const { studentName, cashRemaining, savings, investments, password } = req.body;
    
    const updateData = {};
    if (studentName !== undefined) updateData.studentName = studentName;
    if (cashRemaining !== undefined) updateData.cashRemaining = cashRemaining;
    if (savings !== undefined) updateData.savings = savings;
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

// Add new student
app.post('/api/student/add', async (req, res) => {
  try {
    const { email, studentName, password } = req.body;
    
    // 필수 필드 확인
    if (!email || !studentName || !password) {
      return res.status(400).json({ error: '이메일, 이름, 비밀번호는 필수 입력 항목입니다.' });
    }

    // 이메일 중복 확인
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: '이미 등록된 이메일입니다.' });
    }

    // 새 학생 생성
    const newStudent = new Student({
      email,
      studentName,
      password,
      cashRemaining: 300000, // 기본 시작 금액
      savings: 0,
      investments: []
    });

    await newStudent.save();
    res.status(201).json({ 
      success: true, 
      message: '학생이 성공적으로 추가되었습니다.',
      student: {
        email: newStudent.email,
        studentName: newStudent.studentName,
        cashRemaining: newStudent.cashRemaining,
        savings: newStudent.savings
      }
    });
  } catch (error) {
    console.error('학생 추가 오류:', error);
    res.status(500).json({ error: '학생 추가 중 오류가 발생했습니다.' });
  }
});

// 이자 지급 API
app.post('/api/admin/pay-interest', async (req, res) => {
  try {
    const { interestRate } = req.body;
    
    if (!interestRate || isNaN(interestRate) || interestRate < 0) {
      return res.status(400).json({ error: '유효한 이자율을 입력해주세요.' });
    }

    // 모든 학생의 저축금에만 이자 지급
    const result = await Student.updateMany(
      {},
      [
        {
          $set: {
            savings: {
              $multiply: [
                "$savings",
                1 + (interestRate / 100)
              ]
            }
          }
        }
      ]
    );

    res.json({
      success: true,
      message: `모든 학생의 저축금에 ${interestRate}%의 이자가 지급되었습니다.`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('이자 지급 오류:', error);
    res.status(500).json({ error: '이자 지급 중 오류가 발생했습니다.' });
  }
});

// 저축 API 추가
app.post('/api/student/savings', async (req, res) => {
  try {
    const { email, amount, action } = req.body;
    
    if (!email || !amount || !action) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ error: '학생을 찾을 수 없습니다.' });
    }

    if (action === 'deposit') {
      // 입금
      if (student.cashRemaining < amount) {
        return res.status(400).json({ error: '현금이 부족합니다.' });
      }
      student.cashRemaining -= amount;
      student.savings += amount;
    } else if (action === 'withdraw') {
      // 출금
      if (student.savings < amount) {
        return res.status(400).json({ error: '저축금이 부족합니다.' });
      }
      student.savings -= amount;
      student.cashRemaining += amount;
    } else {
      return res.status(400).json({ error: '잘못된 작업입니다.' });
    }

    await student.save();
    res.json({
      success: true,
      message: action === 'deposit' ? '저축이 완료되었습니다.' : '출금이 완료되었습니다.',
      student: {
        cashRemaining: student.cashRemaining,
        savings: student.savings
      }
    });
  } catch (error) {
    console.error('저축 처리 오류:', error);
    res.status(500).json({ error: '저축 처리 중 오류가 발생했습니다.' });
  }
});

// CSV 다운로드 엔드포인트
app.get('/api/admin/export-students', async (req, res) => {
  try {
    // 모든 학생 정보 조회
    const students = await Student.find({})
      .populate('investments')
      .lean();

    // CSV 변환을 위한 데이터 가공
    const csvData = students.map(student => {
      // 기본 정보
      const baseData = {
        '학생ID': student.email,
        '이름': student.studentName,
        '현금': student.cashRemaining,
        '저축': student.savings
      };

      // 투자 정보를 개별 컬럼으로 변환
      student.investments.forEach(inv => {
        if (inv.quantity > 0) {
          baseData[`${inv.stockName}_수량`] = inv.quantity;
        }
      });

      return baseData;
    });

    // CSV 필드 정의 (동적으로 생성)
    const fields = ['학생ID', '이름', '현금', '저축'];
    // 모든 주식 이름을 필드에 추가
    const stockNames = [...new Set(students.flatMap(s => 
      s.investments.map(inv => `${inv.stockName}_수량`)
    ))];
    fields.push(...stockNames);

    const json2csvParser = new Parser({ 
      fields,
      delimiter: ',',
      quote: '"',
      header: true
    });
    
    const csv = json2csvParser.parse(csvData);

    // CSV 파일 다운로드 설정
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=students_investment_data.csv');
    
    // CSV 데이터 전송
    res.send(csv);
  } catch (error) {
    console.error('CSV 다운로드 오류:', error);
    res.status(500).json({ error: 'CSV 파일 생성 중 오류가 발생했습니다.' });
  }
});

// Multer 설정
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('CSV 파일만 업로드 가능합니다.'), false);
    }
  }
});

// CSV 업로드 엔드포인트
app.post('/api/admin/import-students', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    
    // CSV 파싱
    const records = [];
    const parser = csv.parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      encoding: 'utf-8',
      delimiter: ',',
      quote: '"',
      escape: '"',
      relax_column_count: true
    });

    // Promise를 사용하여 파싱 완료 대기
    await new Promise((resolve, reject) => {
      parser.on('readable', function() {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });

      parser.on('error', function(err) {
        reject(new Error('CSV 파싱 오류: ' + err.message));
      });

      parser.on('end', function() {
        resolve();
      });

      parser.write(fileContent);
      parser.end();
    });

    // 데이터 검증 및 변환
    const students = records.map(record => {
      // 필수 필드 확인
      if (!record['학생ID'] || !record['이름']) {
        throw new Error('학생ID와 이름은 필수 입력 항목입니다.');
      }

      // 숫자 필드 변환
      const cashRemaining = parseInt(record['현금']) || 300000;
      const savings = parseInt(record['저축']) || 0;

      // 투자 정보 추출
      const investments = [];
      Object.keys(record).forEach(key => {
        if (key.endsWith('_수량')) {
          const stockName = key.replace('_수량', '');
          const quantity = parseInt(record[key]) || 0;
          if (quantity > 0) {
            investments.push({
              stockName,
              quantity
            });
          }
        }
      });

      return {
        email: record['학생ID'],
        studentName: record['이름'],
        cashRemaining,
        savings,
        investments
      };
    });

    // 기존 데이터 업데이트 또는 새로 추가
    for (const student of students) {
      await Student.findOneAndUpdate(
        { email: student.email },
        { 
          $set: {
            studentName: student.studentName,
            cashRemaining: student.cashRemaining,
            savings: student.savings,
            investments: student.investments
          }
        },
        { upsert: true, new: true }
      );
    }

    // 업데이트된 전체 학생 목록 조회
    const updatedStudents = await Student.find({}, 'email studentName cashRemaining savings investments');
    
    res.json({
      success: true,
      message: `${students.length}명의 학생 데이터가 성공적으로 업로드되었습니다.`,
      students: updatedStudents
    });
  } catch (error) {
    console.error('CSV 업로드 오류:', error);
    res.status(500).json({ error: error.message || 'CSV 파일 처리 중 오류가 발생했습니다.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
