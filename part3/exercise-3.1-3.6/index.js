
const express = require('express');
const morgan = require('morgan');

const app = express();

// Custom token for logging request body data as JSON
morgan.token('req-body-json', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});

// Use the morgan middleware with the custom token
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :req-body-json')
);


const PORT = 5050;
const HOSTNAME = "localhost";
app.use(morgan('tiny'));

app.use(express.json());

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
