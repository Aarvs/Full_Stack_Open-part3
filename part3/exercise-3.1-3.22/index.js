require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./modules/person");
const app = express();
app.use(cors());

// Custom token for logging request body data as JSON
morgan.token("req-body-json", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

// Use the morgan middleware with the custom token
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body-json"
  )
);

// defining middlewares for error handling for endpoints
const requestLogger = (req, next) => {
  console.log("Method", req.method);
  console.log("Path", req.path);
  console.log("Body", req.body);
  console.log("---");
  next();
};

const errorHandler = (error, res, next) => {
  console.error(error.message);
  if (error.message === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

const unknownEndpoint = (res) => {
  res.status(404).send({ error: "unkown endpoint" });
};

app.use(morgan("tiny"));
app.use(express.json());
app.use(requestLogger);
app.use(express.static("build"));

app.get("/info", (res, next) => {
  const currentTime = new Date();
  // Get the count of phonebook entries from the database
  Contact.countDocuments({})
    .then((count) => {
      res.send(
        `<p>PhoneBook has info for ${count} people 
        <br/>
        ${currentTime}
        </p>`
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (res) => {
  // Fetch phonebook entries from MongoDB
  Contact.find({})
    .then((entries) => {
      res.json(entries);
    })
    .catch((error) => {
      console.error("Error fetching phonebook entries:", error);
      res.status(500).json({ error: "Failed to fetch phonebook entries" });
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// Place other route handlers with route parameters here

app.get("/api/persons/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (body.name === undefined) {
    return res.status(404).json({ error: "content missing" });
  }

  const newEntry = new Contact({
    id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number,
  });
  newEntry
    .save()
    .then((savedContact) => {
      res.json(savedContact);
    })
    .catch((error) => next(error));
});

app.patch("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const newNumber = req.body.number;

  // Find the existing phonebook entry by its id
  Contact.findByIdAndUpdate(id, { number: newNumber }, { new: true })
    .then((updatedContact) => {
      if (updatedContact) {
        res.json(updatedContact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const HOSTNAME = "localhost";
const PORT = process.env.PORT;

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running at on ${HOSTNAME}:${PORT}`);
});
