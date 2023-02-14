//Require Mongoose
import mongoose, { mongo } from "mongoose"

//Define a schema
const Schema = mongoose.Schema;

//Connect DB
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/denemeDb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); 

const SomeModelSchema = new Schema({
    a_stiring: String,
    a_date: Date,
});

//Compile model from schema
const SomeModel = mongoose.model("SomeModel", SomeModelSchema)

SomeModel.create({
    a_stiring: "deneme",
    a_date: `${Date.now()}`,
})
