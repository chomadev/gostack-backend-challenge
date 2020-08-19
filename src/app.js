const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;
  if (!id)
    return response.sendStatus(400);

  const index = getIndexFromId(id);
  if (index < 0) {
    return response.sendStatus(400);
  }

  next();
}

function getIndexFromId(id) {
  return repositories.findIndex(repository => repository.id === id);
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = getIndexFromId(id);
  const repository = repositories[index];

  if (title) repository.title = title;
  if (url) repository.url = url;
  if (techs) repository.techs = techs;

  repositories[index] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  repositories.splice(getIndexFromId(id), 1);
  return response.sendStatus(204);
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params;
  const index = getIndexFromId(id);
  repositories[index].likes++;
  return response.status(200).json(repositories[index]);
});

module.exports = app;
