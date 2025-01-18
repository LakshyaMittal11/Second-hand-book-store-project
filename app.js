const express = require('express');
const multer = require('multer');
const app = express();
app.use(express.static('bookshop'));
app.use(express.static('bookshop/uploads'));

const st = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, 'bookshop/uploads/');
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: st });



app.get("/A",function(req,res)
{
res.sendFile("./bookshop/A.html",{root:__dirname});
});

app.post('/upload', upload.single('F'), (req, res) => {
  if (req.file) {
   message: 'File uploaded successfully!',
    file: req.file,

  }
else(res.send)({
    return res.status(400).send('No file uploaded.');
  });
});


app.listen(7000, () => {
  console.log(`Server running on http://localhost:${7000}`);
});