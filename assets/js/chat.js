$(function(){

    console.log("ヒントの表示や、入力欄に不具合がある可能性があります。")
    console.log("不具合が発生した場合は、ページをリロードしてください。")
    console.log("by Webページ制作担当")

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
        xhr.open('POST','../assets/php/index.php');
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
    const userName =  storage.getItem("name");
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
    },10);

    const submit = () =>{
        const input = document.getElementById("bottom_input");
        if(input.value ==  "") return;
        addMessage([{type:"text",content:input.value}], true);
        postSend(input.value);
        input.value =  "";
    }

    $("#bottom_submit").on("click", submit);

    const replaceMessage = (obj)=>{
        if(obj.type == "command"){
            if(obj.content == "game_clear"){
                storage.setItem("status", "clear");
                window.location.href = '../ending/';
                return obj;
            }
        }else if(obj.type == "img"){
            obj.content = `../assets/img/nazo/${obj.content}`;
            return obj;
        }

        obj.content = obj.content.replace(/{username}/g, userName);

        return obj;
    }

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
        $("#bottom_input").prop('disabled', true);
        $("#bottom_input").attr('placeholder', '北園 実 が入力中');
        chat.items.push({main: main,messages: []});
        let i = 0;
        const messageLength =  messages.length;
        messages.forEach(async message => {
            await sleep(message.delay);
            chat.items[chat.items.length - 1].messages.push(replaceMessage(message));
            if(message.type == "img"){
                time = 10;
            }else{
                time = 1;
            }
            setTimeout(function(){
                i ++;
                bottom = $("#messages")[0].scrollHeight - $("#messages").innerHeight() + 64;
                $("#messages").scrollTop(bottom);
                if(i == messageLength){
                    $("#bottom_input").prop('disabled', false);
                    $("#bottom_input").attr('placeholder', 'ここにメッセージを入力');
                }
            },time);
            storage.setItem("chat", JSON.stringify(chat.items));
        });
    }

    /*画像の拡大機能*/
    $("body").on("click",".img",function(){
        const img_url = $(this).children('img').attr('src');
        $("body").append(`
            <div id="image_viewer">
                <img src="${img_url}">
                <div id="viewer_control">
                    <div id="viewer_flip" class="viwer_button">左右反転</div>
                    <div id="viewer_close" class="viwer_button">×</div>
                </div>
            </div>
        `);
    });
    $("body").on("click","#viewer_flip",function(){
        $("#image_viewer img").toggleClass("flip_img");
    });
    $("body").on("click","#viewer_close",function(){
        $("#image_viewer").remove();
    });
});