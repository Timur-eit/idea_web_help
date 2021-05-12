const express = require('express')
const cors = require('cors')
const data = require('../src/data/HelpTOC.json')
const pages = data.entities.pages

const app = express()

app.use(cors({origin: 'http://localhost:3000'}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // TODO if you want search data by parts
  // if (pages[req.query.search]) {
    //   return res.status(200).send(pages[req.query.search])
    // } else {
      //   return res.status(404).send('Data is not found')
      // }
  const matches = []
  for (const pageId in pages) {
    if (pageId.id.includes(req.query.search)) {
      matches.push(pageId.id)
    }  
  }
  
  if (matches.length > 0) {
    const foundId = {}
    
    return res.status(200).send(matches)
  } else {
    return res.status(404).send('Data is not found')
  }


})

app.listen(4000, () => {
  console.log('application has launched')
})



// const http = require('http')
// const host = '127.0.0.1'
//
// const server = http.createServer((req, res) => {
//   console.log(req.url)
//   res.statusCode = 200
//   res.end('Hello w!')
// })
//
// server.listen(4000, host, () => {
//   console.log('application has launched')
// })