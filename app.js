const { error } = require('console');
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(express.json())
//storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {   //cb --> callback
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const filter = (req,file,cb)=>{
    const allowedTypes = [
        "image/jpg", "image/jpeg"
    ]
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }
    else{
        cb(Error('invalid file type'))
        console.error('invalid file type')
    }
}
let maxSize = 2 * 1024 * 1024 //2mb
const upload = multer({
    storage: storage,
    limits: {fileSize: maxSize},
    fileFilter: filter
})

app.use('/profile', express.static('upload/images'));

app.post('/upload', upload.single('profile'),(req,res)=>{
    // console.log(req.file);
    res.json({
        success: 1,
        profile_url: `http://localhost:4000/profile/${req.file.filename}`
    })
})
function errHandler(err, req, res, next){
    if(err instanceof multer.MulterError){
        res.status(400).send({
            error: 'error while uploading',
            message: err.message
        })
    }
    else{
        res.status(400).send({
            error: 'invalid file type, allowed only jpg and jpeg',
            message: err.message
        })
    }
}
app.use(errHandler)
app.listen(4000, ()=>{
    console.log('server running successfully');
})

//https://youtu.be/jn3tYh2QQ-g?feature=shared