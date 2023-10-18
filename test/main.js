var isAdmin = false;

function submitForm() {
    var dai = document.getElementById('dai').value;
    if (dai === '') {
        alert('質問内容を入力してください');
        return false;
    }
    var name = isAdmin ? '管理者' : document.getElementById('name').value;
    if (name === '') {
        name = '匿名' + Math.floor(1000 + Math.random() * 9000);
    }

    // Firestoreにコメントを保存
    db.collection("comments").add({
        name: name,
        comment: dai,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    return false;
}

function toggleAdmin() {
    if (!isAdmin) {
        var password = prompt("パスワードを入力してください");
        if (password === '3120') {
            isAdmin = true;
            document.getElementById('deleteButton').style.display = 'block';
        } else {
            alert("パスワードが間違っています");
        }
    } else {
        isAdmin = false;
        document.getElementById('deleteButton').style.display = 'none';
    }
    var comments = document.getElementsByClassName('comment');
    for (var i = 0; i < comments.length; i++) {
        comments[i].style.display = 'block';
    }
    document.getElementById('adminStatus').textContent = isAdmin ? '管理者モード：ON' : '管理者モード：OFF';
}

function deleteComment(event) {
    if (isAdmin) {
        event.target.parentNode.removeChild(event.target);
        localStorage.setItem('comments', document.getElementById('comments').innerHTML);
    }
}

function deleteAllComments() {
    if (isAdmin) {
        var commentsDiv = document.getElementById('comments');
        while (commentsDiv.firstChild) {
            commentsDiv.removeChild(commentsDiv.firstChild);
        }
        localStorage.setItem('comments', '');
    }
}

// コメントを取得して表示する関数
function getComments() {
    db.collection("comments").orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
            var commentsDiv = document.getElementById('comments');
            commentsDiv.innerHTML = ''; // コメント欄をクリア
            querySnapshot.forEach((doc) => {
                var comment = document.createElement('p');
                comment.className = 'comment' + (isAdmin ? ' admin' : '');
                comment.textContent = '名前：' + doc.data().name + '| 質問内容：' + doc.data().comment;
                commentsDiv.appendChild(comment);
            });
        });
}

window.onload = function () {
    getComments();
}
