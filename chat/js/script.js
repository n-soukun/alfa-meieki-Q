$(function(){

    function sleep(msec) {
        return new Promise(function(resolve) {
      
           setTimeout(function() {resolve()}, msec);
      
        })
    }

    let _returnValues;
    const postSend = (sendMessage) => {
        const fd = new FormData();
        fd.append('message', sendMessage);
        fd.append('step', nowStep);
        const xhr = new XMLHttpRequest();
        xhr.open('POST','php/index.php');
        xhr.send(fd);
        xhr.onreadystatechange = function(){
            if ((xhr.readyState == 4) && (xhr.status == 200)) {
                _returnValues = JSON.parse(xhr.responseText);
                addMessageWithDelay(_returnValues.reply, false);
                nowStep = _returnValues.next_step;
                storage.setItem("step", nowStep);
            }
        };
    }

    const storage = localStorage;
    let nowStep =  storage.getItem("step");
    if(nowStep === null){
        nowStep = "first";
        postSend("first");
    }

    let chatItems = [];

    if(storage.chat){
        chatItems = JSON.parse(storage.chat);
    }

    var chat = new Vue({
        el: '#messages',
        data: {
            items: chatItems
        }
    });

    setTimeout(function(){
        bottom = $("#messages")[0].scrollHeight - $("#messages").innerHeight() + 64;
        $("#messages").scrollTop(bottom);
    },1);

    const submit = () =>{
        const input = document.getElementById("bottom_input");
        if(input.value ==  "") return;
        addMessage([{type:"text",content:input.value}], true);
        postSend(input.value);
        input.value =  "";
    }

    $("#bottom_submit").on("click", submit);

    /**
     * チャットにメッセージを追加する
     * @param {Array} messages 
     * @param {Boolean} main 
     */
    const addMessage = (messages, main) =>{
        chat.items.push({main: main,messages: messages});
        setTimeout(function(){
            bottom = $("#messages")[0].scrollHeight - $("#messages").innerHeight() + 64;
            $("#messages").scrollTop(bottom);
        },1);
        storage.setItem("chat", JSON.stringify(chat.items));
    }

    const addMessageWithDelay = (messages, main)=>{
        chat.items.push({main: main,messages: []});
        messages.forEach(async message => {
            await sleep(message.delay);
            chat.items[chat.items.length - 1].messages.push(message);
            setTimeout(function(){
                bottom = $("#messages")[0].scrollHeight - $("#messages").innerHeight() + 64;
                $("#messages").scrollTop(bottom);
            },1);
            storage.setItem("chat", JSON.stringify(chat.items));
        });
    }
});