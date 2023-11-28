const fs = require('fs')

const filename = 'src/data/data.json'

const data = JSON.parse(fs.readFileSync(filename, 'utf-8'))

let id = 1000
data.forEach(match => {
    if (match.match_id == undefined) {
        match.match_id = id
        id++
    }
})

fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8')

