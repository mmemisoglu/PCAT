import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';
import Photo from '../models/Photo.mjs';


//Path to identify
//Dosyanın dizi'nini döndürür
const __filename = fileURLToPath(import.meta.url);
//Klasörün dizi'nini döndürür Direction
const __dirname = path.dirname(__filename);

export const getAllPhotos = async (req, res) => {
  
  const page = req.query.page || 1;
  const photosPerPage = 2;
  const totalPhotos = await Photo.find().countDocuments();
  const photos = await Photo.find({})
  .sort('-dateCreated')
  .skip((page-1)*photosPerPage)
  .limit(photosPerPage)
  
  res.render('index', {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage)
  });
};

export const getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

export const createPhoto = async (req, res) => {
  //Eğer klasör yoksa uploads klasörü oluşturacak.
  const uploadDir = './public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  try{
    let uploadeImage = req.files.image;
    let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;
    uploadeImage.mv(uploadPath, async (err) => {
      if (err) console.log(err);
      await Photo.create({
        ...req.body,
        image: '/uploads/' + uploadeImage.name,
      });
    });
    res.redirect('/');
  }catch{
    res.redirect('/add');
  }
  
};

export const updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  try{
    //Form ile iletilen fotoğrafın dosya bilgilerini aldım.
    let uploadeImage = req.files.image;
    //Formdan alınan fotoğrafları kaydedeceğim yerin dosya dizinini değişkene atadım.
    let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;
    //mv metodu ile belirttiğim dosya dizinine taşıdım.
    uploadeImage.mv(uploadPath);
    const photo = await Photo.findOne({ _id: req.params.id});
    let deletedImage = __dirname + '/../public' + photo.image;
    fs.unlinkSync(deletedImage);
    photo.title = req.body.title;
    photo.description = req.body.description;
    //Veri tabanında kaydettiğimiz uzantıda değişiklik yaptım.
    photo.image = '/uploads/' + uploadeImage.name;
    //Çektiğim fineOne sorgusunda yaptığım değişiklikleri kayıt ettim.
    photo.save();
    res.redirect(`/photos/${req.params.id}`);
  }catch{
    photo.title = await req.body.title;
    photo.description = await req.body.description;
    await photo.save();
    res.redirect(`/photos/${req.params.id}`);
  }
};

export const deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id});
  let deletedImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
