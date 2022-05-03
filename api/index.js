const app = require('./app.js')
const PORT = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});
