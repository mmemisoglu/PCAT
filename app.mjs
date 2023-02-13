import express from 'express';
import path from 'path';

const app = express();
const __dirname = path.resolve();
app.use(express.static('public'));

// const myLogeer = (req,res,next) => {
//   console.log("Middleware Log 1")
//   next();
// }
// const myLogeer2 = (req,res,next) => {
//   console.log("Middleware Log 2")
//   next();
// }

// app.use(myLogeer)
// app.use(myLogeer2)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "temp/index.html"))
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
