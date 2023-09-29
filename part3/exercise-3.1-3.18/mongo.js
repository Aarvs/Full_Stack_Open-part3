const mongoose = require('mongoose')

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.geg3ljk.mongodb.net/contactApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if(process.argv.length < 4 && process.argv[2] === password){
    Contact.find({}).then(result =>{
        console.log('phonebook:')
        result.forEach(person =>{
            console.log(`${person.name} ${person.number} \n`)
        })
        mongoose.connection.close()
        process.exit(1)
    })
}else if(process.argv.length < 5){
    console.log("password, name and number are mandatory")
    process.exit(1)
}

const contact = new Contact({
    name: personName,
    number: personNumber,
})

contact.save().then(() =>{
    console.log(`added ${personName} number ${personNumber} to phonebook`)
})



