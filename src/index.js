const { json } = require("body-parser");
const express = require("express");
const { v4: uuid } = require("uuid");
const app = express();

app.use(json());



const customers = [];

function verifyIfExistAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find(customer => customer.cpf === cpf);

  if (!customer)
    return response.status(400).json({ error: "Customer not found" });

  request.customer = customer;

  next(); 
}

function getBalance(statement){


    const balance = statement.reduce((saldoAcomulado, currenValue) => {


        if(currenValue.type === 'credit') {
      
           return  saldoAcomulado + currenValue.amount
        }else{
            return saldoAcomulado - currenValue.mount
        }
    }, 0)

  

    return balance
}

app.get("/statement", verifyIfExistAccountCPF,  (request, response) => {
  //usando um Middleware para verficar se cpf existe

  const customer = request.customer;

  return response.json(customer.statement);
});


app.get('/statement/date', verifyIfExistAccountCPF, (request, response) => {

    const  { customer }  = request

    const { date } = request.query

    const  formatedDate = new Date(date + " 00:00")

    const resultStatement = customer.statement.filter( statement => statement.created_at.toDateString()
    === new Date(formatedDate).toDateString()
    )
    
   

    return response.status(200).json(resultStatement)
})



app.get('/account' , verifyIfExistAccountCPF, (request, response) => {

  const { customer } = request
  
  return response.json(customer)

})
 
app.post("/account", (request, response) => {
  const { name, cpf } = request.body;

  const customersAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customersAlreadyExists)
    return response.status(400).json({ error: "costumer already exists!" });

  customers.push({
    id: uuid(),
    name,
    cpf,
    statement: [],
  });

 
  return response.status(201).send();
});

app.post("/deposit", verifyIfExistAccountCPF, (request, response) => {
  const { customer } = request;
  const { description, amount } = request.body;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});


app.post('/withdraw', verifyIfExistAccountCPF, (request, response) => {

    const  { amount } = request.body
    const {customer} = request

    const balance = getBalance(customer.statement)
    console.log(balance)
    if(balance < amount ) {
        return response.status(400).json({error : "Insufficient Funds!"})
    }

    const statementOperation = {
        amount, 
        created_at: new Date(),
        type: "debit",
      };
    

      customer.statement.push(statementOperation)

      return response.status(201).send()
})

app.put('/account', verifyIfExistAccountCPF, (request, response) => {

  const { name } = request.body

  const { customer } = request

  customer.name = name 

  return response.status(201).send()
})  



 
app.listen(3333, () => {
  console.log("🚀 app is running ");
});
 