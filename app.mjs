import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
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
  //useFindAndModify: false,
});

//Template Engine
app.set('view engine', 'ejs'); //We specify what we are using for the view engine

//Middlewares
app.use(express.static('public')); //We specify the location of static files
app.use(express.urlencoded({ extended: true })); //encode from url
app.use(express.json()); //converting the code to json format
app.use(fileUpload());
app.use(methodOverride('_method', {
  methods:['POST','GET']
}));

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
//Urledeki id'yi alıyor.
//Veritabanında ona denk gelen id'yi photo değişkenine atıyor
//Değişken edit sayfasına photo değişkeni ile yollanıyor.
app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
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
    if (err) console.log(err);
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
  });
  res.redirect('/');
});

//findOne metoduyla id bilgisi sayesinde filtreleme yaptık.
//Elde ettiğimiz sql satırının title,description gibi alanlarında değişiklik yaptık
//Fotoğraf güncellemesi için
//
app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  //Form ile iletilen fotoğrafın dosya bilgilerini aldım.
  let uploadeImage = req.files.image;
  //Formdan alınan fotoğrafları kaydedeceğim yerin dosya dizinini değişkene atadım.
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;
  //mv metodu ile belirttiğim dosya dizinine taşıdım. 
  uploadeImage.mv(uploadPath);
  photo.title = req.body.title;
  photo.description = req.body.description;
  //Veri tabanında kaydettiğimiz uzantıda değişiklik yaptım.
  photo.image = '/uploads/' + uploadeImage.name;
  //Çektiğim fineOne sorgusunda yaptığım değişiklikleri kayıt ettim.
  photo.save();
  //Redirects to the page specific to the image
  res.redirect(`/photos/${req.params.id}`);
});

app.delete('/photos/:id', async (req,res) => {
  //Retrieves data from the database with the corresponding "ID".
  const photo = await Photo.findOne({_id: req.params.id});
  //Finds the corresponding file directory
  let deletedImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedImage); //Deletes the related file
  //Delete from Database
  await Photo.findByIdAndRemove(req.params.id);
  //Redirects to homepage
  res.redirect('/');

})

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
