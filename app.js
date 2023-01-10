const customersRoute = require ('./Routes/customers')

const express = require ('express')

require('dotenv').config()

const morgan = require ('morgan')

const app = express ()

app.use (morgan('dev'))

app.use(express.json())

app.use(express.urlencoded({extended: false}))

const PORT = process.env.PORT || 3000

app.get("/", (req, res, next) => {
    res.status(200).send("Welcome to Shop Mart, your number one shopping place")
    next()
})

app.use('/customers', customersRoute)


app.get('*', (req, res) => {
    res.status(400).send("Invalid URL or URL not found!");
})

app.listen(PORT, () => 
console.log(`Server running at http://localhost:${PORT}`)
)