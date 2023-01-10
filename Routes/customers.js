const customersDB = require ('../DB/customers')

const bcript = require ('bcryptjs')

const customerSchema = require ('../Schemas')

const {getAge} = require ('../Middlewares')

const express = require ('express')

const router = express.Router()


// Login

router.post('/api/user/login', async(req, res) => {
    const {username, password} = req.body

    const user = customersDB.find (u => u.username === username)

    if (!user) return res.status(404).send('Wrong Username, Please try again!')

    const isValid = await bcript.compare (password, user.password)

    if (!isValid) return res.status(404).send ('Wrong password, try again!')

    return res.status(200).send(`Welcome, ${user.username}`)
})


// fetch users/ user data

router.get('/api/users/data', (req, res) => {
    res.status(200).json(customersDB)
})



router.get('/api/user/data/:id', (req, res) => {
    
    const found = customersDB.find(user => user.id === parseInt (req.params.id))

    if (!found) return res.status(404).send(`Customer with ID: ${req.params.id} not found`)

    return res.status(200).send(found)
})



// register an account

router.post('/api/user/signup', async (req, res) => {
    
    const result = customerSchema(req.body)

    if (result.error) return res.status(400).send(result.error.details[0].message)

    const newCustomer = {
    id : customersDB.length + 1,
    fullname: req.body.fullname,
    username: req.body.username,
    password : req.body.password,
    birthYear : req.body.birthYear,
    phone: req.body.phone,
    country: req.body.country,
    email: req.body.email
    }

    newCustomer.age = getAge(newCustomer.birthYear)

    const hash = await bcript.hash(req.body.password, 10)
    newCustomer.password = hash

    delete newCustomer.birthYear

    customersDB.push(newCustomer)
    console.log(newCustomer);
    res.status(200).send(newCustomer)
})


// Update user details

router.put ('/api/user/data/:id', async (req, res) => {

    const found = customersDB.find (user => user.id === parseInt(req.params.id))

    if (!found) return res.status(404).send('Such user does not exist. Please create an account')

    const result = customerSchema(req.body)

    if (result.error) return res.status(400).send(result.error.details[0].message)

    const updateCustomer = {
        id : found.id,
        fullname: req.body.fullname,
        username: req.body.username,
        password : req.body.password,
        birthYear : req.body.birthYear,
        phone: req.body.phone,
        country: req.body.country,
        email: req.body.email
    }
    

    updateCustomer.age = getAge(updateCustomer.birthYear)

    const hash = await bcript.hash(req.body.password, 10)
    updateCustomer.password = hash

    delete updateCustomer.birthYear

    const targetIndex = customersDB.indexOf(found)
    customersDB.splice(targetIndex, 1, updateCustomer)

    res.status(200).json(updateCustomer)
    
})


// delete user account

router.delete('/api/user/data/:id', (req, res) => {
    const found = customersDB.find(user => user.id === parseInt (req.params.id))

    if (!found) return res.status(404).send('No such user exists, please try again')

    const targetIndex = customersDB.indexOf(found)

    customersDB.splice(targetIndex, 1)
    return res.status(200).end('User data deleted successfully')
})


module.exports = router