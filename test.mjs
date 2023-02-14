import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//Connect DB
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Create Schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
});

const Photo = mongoose.model('Photo', PhotoSchema);

//Create a photo
// Photo.create({
//   title: 'Photo Title 5',
//   description: 'Photo description 5 lorem ipsum',
// });

//Read a photo
// Photo.find({}, (err,data) => {
//     console.log(data);
// });

//Update photo
// const id = '63eaa4699ef61994e786ff7b';
// Photo.findByIdAndUpdate(
//   id,
//   {
//     title: 'Photo title UPDATE101',
//     description: 'Photo description UPDATE101',
//   },
//   {
//     new: true
//   },
//   (err, data) => {
//     console.log(data);
//   }
// );

//Delete a photo

const id = "63eabb26af8df12749ad850b"
Photo.findByIdAndDelete(
    id,(err,data) => {
        console.log("Photo is remote")
    }
)
