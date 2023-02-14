import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import ejs from 'ejs';
import Photo from './models/Photo.mjs';

//Start Express
const app = express();

//Connect to DataBase
mongoose.set('strictQuery', false); //Required for 'mongoose.connect()'
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Template Engine
app.set('view engine', 'ejs'); //We specify what we are using for the view engine

//Middlewares

app.use(express.static('public')); //We specify the location of static files

app.use(express.urlencoded({ extended: true })); //encode from url
app.use(express.json()); //converting the code to json format

//Routes
app.get('/', async (req, res) => {
  const photos = await Photo.find({})
  res.render('index',{
    photos
  });
});
app.get('/photos/:id',async (req, res) => {
  //console.log(req.params.id)
  const photo = await Photo.findById(req.params.id)
  res.render('photo',{
    photo
  })
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});
app.post('/photos', async (req, res) => {
  await Photo.create(req.body)
  res.redirect('/'); //Redirects to homepage
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
