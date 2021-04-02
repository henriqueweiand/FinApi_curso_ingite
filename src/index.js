const { json } = require("body-parser");
const express = require("express");
const { v4: uuid } = require("uuid");
const app = express();


app.use(json())

const customers = [];



app.post("/account", (request, response) => {

  const { name, cpf } = request.body;

  const customersAlreadyExists = customers.some(customer => customer.cpf === cpf)

  if(customersAlreadyExists) return response.status(400).json({error : "costumer already exists!" })

  customers.push({
    id: uuid(),
    name,
    cpf,
    statement: [],
  });

  console.log(customers)

  return response.status(201).send();
});

app.listen(3333, () => {
  console.log("🚀 app is running ");
});
