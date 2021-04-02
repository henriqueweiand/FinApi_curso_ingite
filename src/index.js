const { json } = require("body-parser");
const { response } = require("express");
const express = require("express");
const { v4: uuid } = require("uuid");
const app = express();


app.use(json())

const customers = [];


function verifyIfExistAccountCPF(request, response, next){

    const { cpf } = request.headers

    const  customer = customers.find(customer => customer.cpf === cpf)

    if(!customer) return response.status(400).json({error : "Customer not found"})

    request.customer = customer

    next()

}



app.get('/statement',verifyIfExistAccountCPF, (request,  response) => { 

    //usando um Middleware para verficar se cpf existe

    const customer = request.customer

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


