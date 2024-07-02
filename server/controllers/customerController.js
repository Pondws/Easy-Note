const Customer = require("../models/customerModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerCostomer = async (request, h) => {
    try {
        const { username, email, password } = request.payload
        const hashedPassword = await bcrypt.hash(password, 10)

        const customer = new Customer({
            username, 
            email, 
            password: hashedPassword
        });

        const result = await customer.save();
        return h.response({ message: "Register success", result }).code(201);
    } catch (error) {
        return h.response(error).code(500)
    }
}

const loginCustomer = async (request, h) => {
    try {
        const { email, password } = request.payload
        const customer = await Customer.findOne({ email })
        if (!customer) {
            return h.response({ message: 'Invalid email or password' }).code(400)
        }
        const isValidPassword = await bcrypt.compare(password, customer.password)
        if (!isValidPassword) {
            return h.response({ message: 'Invalid email or password' }).code(400)
        }
        const token = jwt.sign({ email }, process.env.JWT, { expiresIn: '1h' })
        return h.response({ message: "Login success", email, username: customer.username, token }).code(201)
    } catch (error) {
        return h.response(error).code(500)
    }
}

module.exports = {
    registerCostomer,
    loginCustomer,
}