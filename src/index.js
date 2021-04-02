const { json } = require("body-parser");
const express = require("express");
const { v4: uuid } = require("uuid");
const app = express();


app.use(json())

const customers = [];



app.post("/account", (request, response) => {
  // criar uma conta con os dados  {cpf , name , id , statemant }

  const { name, cpf } = request.body;

  customers.push({
    id: uuid(),
    name,
    cpf,
    statement: [],
  });

  return response.status(201).send();
});

app.listen(3333, () => {
  console.log("🚀 app is running ");
});
