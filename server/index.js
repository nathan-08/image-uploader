const express = require('express');
const bodyParser = require('body-parser');
let imgURL = ''

const app = express()
app.use(bodyParser.json({limit: '50mb'}))

const port = 1337
app.listen(port, _=>console.log(`_____listening on port ${port} 0,0_____`))

// 
app.get('/check', (req, res)=>{
    console.log('health check')
    res.status(200).send('okelydokely')
})
app.post('/upload-img', (req, res)=>{
    console.log('upload image')
    imgURL = req.body.dataURL
    res.status(200).send('upload_successful')
})
app.get('/getimg', (req, res) =>{
    console.log('get img')

    const length = Buffer.byteLength(imgURL, 'utf-8')
    res.set('Content-Length', length); 
    res.set('Content-Encoding', 'none'); 

    console.log(`
        content_length: ${typeof length}
    `)
    console.log(`
        __res.headers__
        
    `,res.getHeaders())

    res.status(200).send({dataURL: imgURL})
})
//