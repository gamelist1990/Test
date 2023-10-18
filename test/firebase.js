function toggleAdmin() {
    if (!isAdmin) {
        var password = prompt("パスワードを入力してください");
        if (password === 'Hello') {
            isAdmin = true;
            document.getElementById('deleteButton').style.display = 'block';
        } else {
            alert("パスワードが間違っています");
        }
    } else {
        isAdmin = false;
        document.getElementById('deleteButton').style.display = 'none';
    }
    getComments(); // 管理者モードの切り替え後にコメントを再取得
}