/**
 * 구글 시트에서 MongoDB로 데이터 마이그레이션을 위한 유틸리티 스크립트
 * 
 * 사용 방법:
 * 1. 구글 시트에서 주식정보와 학생투자 데이터를 CSV로 내보내기
 * 2. 이 스크립트를 실행하여 MongoDB로 데이터 가져오기
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stockInvestment', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// 스키마 정의
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
  cashRemaining: { type: Number, default: 1000000 },
  investments: [investmentSchema]
});

// 모델 생성
const Stock = mongoose.model('Stock', stockSchema);
const Student = mongoose.model('Student', studentSchema);

/**
 * CSV 파일을 파싱하는 함수
 * @param {string} filePath - CSV 파일 경로
 * @returns {Promise<Array>} - 파싱된 데이터 배열
 */
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const lines = data.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(value => value.trim());
        const obj = {};
        
        headers.forEach((header, index) => {
          obj[header] = values[index];
        });
        
        result.push(obj);
      }

      resolve(result);
    });
  });
}

/**
 * 주식 데이터를 가져오는 함수
 * @param {string} filePath - 주식 데이터 CSV 파일 경로
 */
async function importStocks(filePath) {
  try {
    const stocks = await parseCSV(filePath);
    
    // 주식 데이터 형식 변환
    const formattedStocks = stocks.map(stock => ({
      name: stock['주식명'],
      price: parseFloat(stock['가격'])
    }));
    
    // 기존 데이터 삭제
    await Stock.deleteMany({});
    
    // 새 데이터 삽입
    await Stock.insertMany(formattedStocks);
    
    console.log(`${formattedStocks.length}개의 주식 데이터가 성공적으로 가져와졌습니다.`);
  } catch (error) {
    console.error('주식 데이터 가져오기 실패:', error);
  }
}

/**
 * 학생 투자 데이터를 가져오는 함수
 * @param {string} filePath - 학생 투자 데이터 CSV 파일 경로
 * @param {Array} stockNames - 주식 이름 배열
 */
async function importStudents(filePath, stockNames) {
  try {
    const students = await parseCSV(filePath);
    
    // 학생 데이터 형식 변환
    const formattedStudents = students.map(student => {
      const investments = [];
      
      // 각 주식에 대한 투자 정보 추출
      stockNames.forEach(stockName => {
        const quantity = parseInt(student[stockName]) || 0;
        if (quantity > 0) {
          investments.push({
            stockName,
            quantity
          });
        }
      });
      
      return {
        email: student['학생 아이디'],
        studentName: student['학생명'],
        cashRemaining: parseFloat(student['현금']) || 1000000,
        investments
      };
    });
    
    // 기존 데이터 삭제
    await Student.deleteMany({});
    
    // 새 데이터 삽입
    await Student.insertMany(formattedStudents);
    
    console.log(`${formattedStudents.length}명의 학생 데이터가 성공적으로 가져와졌습니다.`);
  } catch (error) {
    console.error('학생 데이터 가져오기 실패:', error);
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    // 주식 데이터 가져오기
    await importStocks(path.join(__dirname, 'stocks.csv'));
    
    // 주식 이름 가져오기
    const stocks = await Stock.find({}, 'name');
    const stockNames = stocks.map(stock => stock.name);
    
    // 학생 투자 데이터 가져오기
    await importStudents(path.join(__dirname, 'students.csv'), stockNames);
    
    console.log('데이터 마이그레이션이 완료되었습니다.');
  } catch (error) {
    console.error('데이터 마이그레이션 실패:', error);
  } finally {
    // MongoDB 연결 종료
    mongoose.disconnect();
  }
}

// 스크립트 실행
main();
