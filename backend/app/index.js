const express = require('express')
const cors = require('cors')

const router = require('./routes')

const app = express()
app.use(cors())
const port = process.env.PORT || 3001

app.use(router)

app.listen(port, '0.0.0.0', () => {
  console.log(`Magic happens on port ${port}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
