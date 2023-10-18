var isSubmitting = false;
var submitWaitTime = 3000; // 送信待機時間（ミリ秒）
var isAdmin = false;

function submitForm() {
    if (isSubmitting) {
        return false;
    }
    isSubmitting = Date.now();
    var waitMessageElement = document.getElementById('waitMessage');
    waitMessageElement.style.display = 'block';
    var countdownInterval = setInterval(function() {
        var waitSeconds = Math.ceil((submitWaitTime - (Date.now() - isSubmitting)) / 1000);
        waitMessageElement.textContent = 'あと' + waitSeconds + '秒待ってください';
    }, 1000); // 1秒ごとにカウントダウンを更新
    setTimeout(function() {
        isSubmitting = false;
        clearInterval(countdownInterval); // カウントダウンを停止
        waitMessageElement.style.display = 'none';
    }, submitWaitTime); // submitWaitTimeミリ秒後に再送信可能にする

    var dai = document.getElementById('dai').value;
    if (dai === '') {
        alert('質問内容を入力してください');
        return false;
    }
    var name = isAdmin ? '管理者' : document.getElementById('name').value;
    if (name === '') {
        name = '匿名' + Math.floor(1000 + Math.random() * 9000);
    }

    db.collection("comments").add({
        name: name,
        comment: dai,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);

            navigator.serviceWorker.ready.then(function(registration) {
              registration.pushManager.subscribe({userVisibleOnly: true}).then(function(subscription) {
                console.log('Subscribed after permission granted:', subscription.endpoint);
              });
            });
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    return false;
}

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
