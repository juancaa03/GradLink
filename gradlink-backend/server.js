import express from 'express';

const app = express();
const port = 4000

app.get('/', (req, res) => {
  res.json("Hello")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})