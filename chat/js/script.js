$(function(){
    
    const storage = localStorage;
    let nowStep =  storage.getItem("step");
    if(nowStep === null){
        nowStep = 0;
    }

    const submit = () =>{
        const input = document.getElementById("bottom_input");
        if(input.value ==  "") return;
        addMessage([input.value], true);
        postSend(input.value);
        input.value =  "";
    }

    $("#bottom_submit").on("click", submit);

    var chat = new Vue({
        el: '#messages',
        data: {
            items: [
                {main: false, messages : ["Please your name."]},
                {main: true, messages : ["Taro Sato"]},
                {main: false, messages: ["Do you like studying?"]},
                {main: true, messages: ["Yes"]},
                {main: false, messages: ["OK, that's all the question.","Thank you!"]}
            ]
        }
    })

    /**
     * チャットにメッセージを追加する
     * @param {Array} messages 
     * @param {Boolean} main 
     */
    const addMessage = (messages, main) =>{
        chat.items.push({main: main,messages: messages});
        setTimeout(function(){
            bottom = $("#messages")[0].scrollHeight - $("#messages").innerHeight() + 64;
            console.log($("#messages")[0].scrollHeight+","+$("#messages").innerHeight()+","+bottom);
            $("#messages").scrollTop(bottom);
        },1);
    }

    const showScrollTop = () =>{
        console.log($("#messages").scrollTop())
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
                addMessage(_returnValues.reply, false);
                nowStep = _returnValues.next_step;
                storage.setItem("step", nowStep);
            }
        };
    }
});