const { json } = require("body-parser");
const express = require("express");
const { v4: uuid } = require("uuid");
const app = express();


app.use(json())

const customers = [];



app.get('/statement',(request,  response) => {

    // buscar o extrato do cliente pelo cpf que esta na route params
    //app.get('/statement/:cpf)

    // buscar o extrato do cliente pelo cpf que esta no request.headers


    const { cpf } = request.headers

    const customer  = customers.find((customer) => customer.cpf == cpf)
    
    if(!customer) return response.status(400).json({error : "Customer not found"})
     
    return response.json(customer.statement)

})

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


  return response.status(201).send();
});

app.listen(3333, () => {
  console.log("🚀 app is running ");
});


