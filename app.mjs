import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import methodOverride from 'method-override';
import ejs from 'ejs';

import * as photoControllers from './controllers/photoController.mjs'
import * as pageControllers from './controllers/pageController.mjs'

//Start Express
const app = express();


//Connect to DataBase
mongoose.set('strictQuery', false); //Required for 'mongoose.connect()'
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useFindAndModify: false,
}).then(()=>{
  console.log('DB CONNECTED!');
}).catch((err)=>{
  console.log(err);
})

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
//PhotoController
app.get('/',photoControllers.getAllPhotos);
app.get('/photos/:id', photoControllers.getPhoto);
app.post('/photos', photoControllers.createPhoto);
app.put('/photos/:id', photoControllers.updatePhoto);
app.delete('/photos/:id', photoControllers.deletePhoto);
//PageController
app.get('/photos/edit/:id', pageControllers.getEditPage);
app.get('/about', pageControllers.getAboutPage);
app.get('/add', pageControllers.getAddPage);

//Server Listen
const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
