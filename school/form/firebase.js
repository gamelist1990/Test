function toggleAdmin() {
    if (!isOyasai) {
        var password = prompt("パスワードを入力してください");
        if (password === window.oyasain) {
            isOyasai = true;
            document.getElementById('deleteButton').style.display ='block';
        } else {
            alert("パスワードが間違っています");
        }
    } else {
        document.getElementById('deleteButton').style.display = 'none';
    }
    getComments(); // 管理者モードの切り替え後にコメントを再取得
}