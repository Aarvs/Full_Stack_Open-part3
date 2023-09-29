const mongoose = require('mongoose')

mongoose.set("strictQuery",false)

const url = process.env.MONGODB_URI

console.log('connectint to url: ',url)

mongoose.connect(url).then(result =>{
    console.log(result);
    console.log('connected to mongodb')
})
.catch((error) =>{
    console.log('error connecting to mongodb',error.message)
})

const contactSchema = mongoose.Schema({
    id:Number,
    name: {
        type: String,
        minLength: 3,
        require: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-{8,}$/.test(v)
            },
            message: 'Invalid phone number format. It should be like XX-XXXXXXXX or XXX-XXXXXXXXX'
        }
    }
})

contactSchema.set('toJSON',{
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact',contactSchema)
