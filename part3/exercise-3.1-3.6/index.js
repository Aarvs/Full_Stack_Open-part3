// const express = require('express')
// const app = express()

// let notes = [
//   ...
// ]

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

// app.get('/api/notes', (request, response) => {
//   response.json(notes)
// })

// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

const express = require('express');
const morgan = require('morgan');
const { json, urlencoded } = require('body-parser'); // Middleware to parse request body
const morganBody = require('morgan-body'); // Import morgan-body

const app = express();
const PORT = 5050;
const HOSTNAME = "localhost";
app.use(morgan('tiny'));

// Use morgan middleware with 'morgan-body' to log request bodies
morganBody(app, {
  logReqDateTime: false, // Optionally, disable logging request date and time
  logResponseBody: true, // Log response body as well (optional)
});


app.use(express.json());
// Middleware to parse JSON and URL-encoded request bodies
app.use(json());
app.use(urlencoded({ extended: true }));

let phoneBook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  const formattedPhonebook = phoneBook.map((entry) => {
    return JSON.stringify(entry, null, 2); // Format each entry as a JSON string with 2-space indentation
  });

  const response = `[${formattedPhonebook.join(",\n")}]`; // Join formatted entries with commas and newline

  res.setHeader("Content-Type", "application/json");
  res.send(response);
});

app.get("/info", (req, res) => {
  const currentTime = new Date();
  // const maxId = Math.max(...phoneBook.map((entry) => entry.id));
  const maxId = phoneBook.length;
  console.log(maxId);
  res.send(
    `<p>PhoneBook has info for ${maxId} people 
    <br/>
     ${currentTime}
    </p>`
  );
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  
  const initialLength = phoneBook.length; // Store the initial length
  
  phoneBook = phoneBook.filter((entry) => entry.id !== id);
  
  if (phoneBook.length < initialLength) { // Check if an entry was deleted
    res.status(204).end(); 
  } else {
    res.status(404).json({ error: 'Entry not found' });
  }
});


app.get('/api/persons/:id', (req, res) =>{
  const id = Number(req.params.id);
  const phoneBookEntry = phoneBook.find(entry => entry.id === id);
  res.json(phoneBookEntry);
}); 

app.post('/api/persons', (req, res) =>{
  const body = req.body;
  const nameExist = phoneBook.some(entry => entry.name === body.name);
  if(!body.name || !body.number){
    return res.status(404).json({error: 'Name and Number fields need to be filled'})
  }
  if(nameExist){
    return res.status(404).json({error: 'Name must be unique'})
  }
  const newEntry = {
    id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number,
  };
  phoneBook = phoneBook.concat(newEntry);
  res.json(newEntry);
})

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running at ${PORT} on ${HOSTNAME}`);
});
