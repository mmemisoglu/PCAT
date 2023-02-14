import express from 'express';
import path from 'path';
import ejs from 'ejs';

const app = express();

//Template Engine
app.set('view engine', 'ejs');

//Middlewares
const __dirname = path.resolve();
app.use(express.static('public'));

app.use(express.urlencoded({extended: true}))
app.use(express.json())
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

//Routes
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});
app.post('/photos', (req, res) => {
  console.log(req.body);
  res.redirect('/')
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
