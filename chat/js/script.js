$(function(){
    
    const storage = localStorage;
    let nowStep =  storage.getItem("step");
    if(nowStep === null){
        nowStep = 0;
    }

    const submit = () =>{
        const input = document.getElementById("bottom_input");
        if(input.value ==  "") return;
        addMyMessage(input.value);
        postSend(input.value);
        input.value =  "";
    }

    $("#bottom_submit").on("click", submit);

    const addMyMessage = (text) => {
        const lastMessages = $("#messages #wrap_message:last-of-type");
        const newElement = `<div class="message">${text}</div>`;
        if(lastMessages.hasClass("my_message")){
            lastMessages.append(`<br>${newElement}`);
        }else{
            $("#messages").append(`
            <div id="wrap_message" class="my_message">
                ${newElement}
            </div>
            `);
        }
        $("#messages").scrollTop($("#messages")[0].scrollHeight);  
    }
    
    const addOtherMessage = (text) => {
        const lastMessages = $("#messages #wrap_message:last-of-type");
        const newElement = `<div class="message">${text}</div>`
        if(lastMessages.hasClass("other_message")){
            lastMessages.append(`<br>${newElement}`);
        }else{
            $("#messages").append(`
            <div id="wrap_message" class="other_message">
                ${newElement}
                <div class="user-icon"></div>
            </div>
            `);
        }
        $("#messages").scrollTop($("#messages")[0].scrollHeight);  
    }
    
    let _returnValues;
    const postSend = (sendMessage) => {
        console.log("ステップ：",nowStep);
        const fd = new FormData();
        fd.append('message', sendMessage);
        fd.append('step', nowStep);
        const xhr = new XMLHttpRequest();
        xhr.open('POST','php/index.php');
        xhr.send(fd);
        xhr.onreadystatechange = function(){
            if ((xhr.readyState == 4) && (xhr.status == 200)) {
                console.log(xhr.responseText);
                _returnValues = JSON.parse(xhr.responseText);
                _returnValues.reply.forEach(element => {
                    addOtherMessage(element);
                });
                nowStep = _returnValues.next_step;
                storage.setItem("step", nowStep);
                console.log(_returnValues);
            }
        };
    }
});