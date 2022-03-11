var express = require('express');
var router = express.Router();
var formidable = require('formidable')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload',(req, res)=> {
  let form = new formidable.IncomingForm({ //recupera o formulário
    uploadDir: './upload', //diretório
    keepExtensions: true //mantém a extensão dos arquivos
  })
  form.parse(req, (err, fields, files)=>{ //interpreta os dados = campos e arquivos
    
    res.json({ files })
  })
})

module.exports = router;