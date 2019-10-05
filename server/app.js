const path = require('path')
const express = require('./node_modules/express')


const app = express()
const port = process.env.PORT || 3000
app.use(express.static(path.join(__dirname,'../dist')))

app.get('' , (req, res) => {
    res.send('welcome')
})


app.listen(port, () => {
    console.log('server is up')
})