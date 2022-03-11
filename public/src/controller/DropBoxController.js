class DropBoxController {
    constructor(){

        this.btnSendFieldEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');

        this.initEvents();
    }

    initEvents(){
        //Botão Enviar Arquivos
        this.btnSendFieldEl.addEventListener('click', event => {
            this.inputFilesEl.click();
        })

        //Mostrar carregamento de arquivo
        this.inputFilesEl.addEventListener('change', event => {
            
            this.uploadTask(event.target.files)
            
            this.snackModalEl.style.display = 'block'
        })
    }

    //Envia um ou vários arquivos com ajax
    uploadTask(files){
        let promises = [];

        //Convertendo files (que é uma coleçaõ) em array com o spread
        [...files].forEach(file =>{

            //Cada posição da variável promises recebe uma Promise
            promises.push(new Promise((resolve, reject)=>{
                
                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {
                    try {
                        resolve(JSON.parse(ajax.responseText))
                    }catch(e){
                        reject(e)
                    }
                }   
                ajax.onerror = event => {
                    reject(event)
                }
                let formData = new FormData() //api que lê o arquivo

                formData.append('input-file', file)//nome do arquivo, qual o arquivo

                ajax.send(formData)
            }))
        })
        return Promise.all(promises) //resolve as promessas de cada envio de arquivo
    }
}