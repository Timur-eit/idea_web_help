const express = require('express')
const cors = require('cors')
const data = require('../src/data/HelpTOC.json')
const pages = data.entities.pages

const app = express()

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	const requestValue = req.query.search
    const matches = {}

	if (requestValue.length < 3) {
		return res.status(200).send(matches)	
	} else if (requestValue.length === '') {
		return res.status(400).send('please input search value with more than 3 chars')
	} else {
		for (const pageId in pages) {
			if (pages[pageId].title.includes(requestValue)) {
				matches[pages[pageId].id] = pages[pageId].title
			}
		}
	}
    

    if (Object.keys(matches).length > 0) {
        return res.status(200).send(matches)
    } else {
        return res.status(404).send('Data is not found')
    }
})

app.listen(4000, () => {
    console.log('application has launched')
})