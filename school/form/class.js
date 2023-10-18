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
            // プッシュ通知の購読
            navigator.serviceWorker.ready.then(function(registration) {
              registration.pushManager.subscribe({userVisibleOnly: true}).then(function(subscription) {
                console.log('Subscribed after permission granted:', subscription.endpoint);
                // TODO: サーバーからプッシュメッセージを送信...
              });
            });
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    return false;
}

// コメントを削除する関数
function deleteComment(event) {
    if (isAdmin) {
        var commentId = event.target.getAttribute('data-id');
        db.collection("comments").doc(commentId).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
}

// 全てのコメントを削除する関数
function deleteAllComments() {
    if (isAdmin) {
        db.collection("comments").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("comments").doc(doc.id).delete().then(() => {
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            });
        });
    }
}

// コメントを取得して表示する関数
function getComments() {
    db.collection("comments").orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
            var commentsDiv = document.getElementById('comments');
            commentsDiv.innerHTML = ''; // コメント欄をクリア
            querySnapshot.forEach((doc) => {
                var commentDiv = document.createElement('div');
                commentDiv.className = 'comment' + (isAdmin ? ' admin' : '');

                var commentText = document.createElement('p');
                commentText.textContent = '名前：' + doc.data().name + '||| コメント内容：' + doc.data().comment;

                var deleteButton = document.createElement('button');
                deleteButton.textContent = '削除';
                deleteButton.setAttribute('data-id', doc.id); // コメントのIDを保存
                deleteButton.onclick = deleteComment; // 削除ボタンにイベントリスナーを追加
                if (isAdmin) { // 管理者の場合のみ削除ボタンを表示
                    deleteButton.style.display = 'inline';
                } else { // 管理者でない場合は削除ボタンを非表示
                    deleteButton.style.display = 'none';
                }

                commentDiv.appendChild(commentText);
                commentDiv.appendChild(deleteButton);

                commentsDiv.appendChild(commentDiv);
            });
        });
}

window.onload = function () {
    getComments();
}
