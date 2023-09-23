const mongoose = require('mongoose')

mongoose.set("strictQuery",false)

const url = process.env.MONGODB_URI

console.log('connectint to url: ',url)

mongoose.connect(url).then(result =>{
    console.log('connected to mongodb')
})
.catch((error) =>{
    console.log('error connecting to mongodb',error.message)
})

const contactSchema = mongoose.Schema({
    id:Number,
    name: String,
    number: String,
})

contactSchema.set('toJSON',{
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact',contactSchema)
