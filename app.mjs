import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import path from 'path';
import {fileURLToPath} from 'url';
import ejs from 'ejs';
import fs from 'fs';

import Photo from './models/Photo.mjs';

//Start Express
const app = express();

//Path to identify
//Dosyanın dizi'nini döndürür
const __filename = fileURLToPath(import.meta.url);
//Klasörün dizi'nini döndürür Direction
const __dirname = path.dirname(__filename);

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
app.use(fileUpload());

//Routes
app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  res.render('index', {
    photos,
  });
});
app.get('/photos/:id', async (req, res) => {
  //console.log(req.params.id)
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});
app.post('/photos', async (req, res) => {
  //console.log(req.files.image)
  //await Photo.create(req.body);
  //res.redirect('/'); //Redirects to homepage


  //Eğer klasör yoksa uploads klasörü oluşturacak.
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;

  uploadeImage.mv(uploadPath, async (err) => {
    if(err) console.log(err);
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
  }); 
  res.redirect('/');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
