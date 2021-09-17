const storage = localStorage;

document.getElementById("game_start").addEventListener("click",function(){
    const name = document.getElementById("input_name").value;
    if(name == ""){
        window.alert("ニックネームを入力してください");
        return;
    }
    storage.setItem("name", name);
    window.location.href = './main.html';
});