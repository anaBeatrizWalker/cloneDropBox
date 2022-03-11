class DropBoxController {
    constructor(){

        this.btnSendFieldEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
        this.nameFileEl = this.snackModalEl.querySelector('.filename');
        this.timeleftEl = this.snackModalEl.querySelector('.timeleft');

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

            this.modalShow()

            this.inputFilesEl.value = ''
        })
    }

    modalShow(show = true){
        this.snackModalEl.style.display = (show) ? 'block' : 'none'
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

                    this.modalShow(false)

                    try {
                        resolve(JSON.parse(ajax.responseText))
                    }catch(e){
                        reject(e)
                    }
                }   
                ajax.onerror = event => {

                    this.modalShow(false)

                    reject(event)
                }
                ajax.upload.onprogress = event => {
                    //console.log(event)
                    this.uploadProgress(event, file)
                }

                let formData = new FormData() //api que lê o arquivo

                formData.append('input-file', file)//nome do arquivo, qual o arquivo

                this.startUploadTime = Date.now() //Guarda o início do upload antes de envia-lo para que possa fazer a conta do tempo restante de carregamento

                ajax.send(formData)
            }))
        })
        return Promise.all(promises) //resolve as promessas de cada envio de arquivo
    }

    uploadProgress(event, file){
        let timespent = Date.now() - this.startUploadTime //tempo que já foi gasto carregando

        let loaded = event.loaded //dados enviados
        let total = event.total //ŧamanho total do arquivo

        let porcent = parseInt((loaded / total) * 100) //porecentagem de carregamento

        let timeleft = ((100 - porcent) * timespent) / porcent //quantos porcentos faltam

        this.progressBarEl.style.width = `${porcent}%` //faz a barrinha de progresso crescer

        this.nameFileEl.innerHTML = file.name //mostra o nome do arquivo
        
        this.timeleftEl.innerHTML = this.formatTimeToHuman(timeleft) //mostra o tempo que upload ainda vai demorar
    }

    formatTimeToHuman(duration){
        let seconds = parseInt((duration / 1000) % 60) //pega o resto da divisão por 60 para que os segundos não ultrapasse 60
        let minutes = parseInt((duration / (1000 * 60)) % 60)
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24)

        if(hours > 0){
            return `${hours} horas, ${minutes}, minutos e ${seconds} segundos.`
        }

        if(minutes > 0){
            return `${minutes}, minutos e ${seconds} segundos.`
        }

        if(seconds > 0){
            return `${seconds} segundos.`
        }
        return ''
    }
}