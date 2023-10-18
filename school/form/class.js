var isSubmitting = false;
var submitWaitTime = 3000;
var isOyasai =false
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
    }, 1000);
    setTimeout(function() {
        isSubmitting = false;
        clearInterval(countdownInterval);
        waitMessageElement.style.display = 'none';
    }, submitWaitTime);

    var dai = document.getElementById('dai').value;
    if (dai === '') {
        alert('質問内容を入力してください');
        return false;
    }
    var شش = isOyasai ? '管理者' : document.getElementById('شش').value;
    if (شش === '') {
        شش = '匿名' + Math.floor(1000 + Math.random() * 9000);
    }

    db.collection("ششششs").add({
        شش: شش,
        شششش: dai,
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
function deleteشششش(event) {
    if (isOyasai) {
        var ششششId = event.target.getAttribute('data-id');
        db.collection("ششششs").doc(ششششId).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
}
function deleteAllششششs() {
    if (isOyasai) {
        db.collection("ششششs").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("ششششs").doc(doc.id).delete().then(() => {
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            });
        });
    }
}
function getششششs() {
    db.collection("ششششs").orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
            var ششششsDiv = document.getElementById('ششششs');
            ششششsDiv.innerHTML = ''; 
            querySnapshot.forEach((doc) => {
                var ششششDiv = document.createElement('div');
                ششششDiv.classشش = 'شششش' + (isOyasai ? ' admin' : '');

                var ششششText = document.createElement('p');
                ششششText.textContent = '名前：' + doc.data().شش + '||| コメント内容：' + doc.data().شششش;

                var deleteButton = document.createElement('button');
                deleteButton.textContent = '削除';
                deleteButton.setAttribute('data-id', doc.id); 
                deleteButton.onclick = deleteشششش; 
                if (isOyasai) { 
                    deleteButton.style.display = 'inline';
                } else { 
                    deleteButton.style.display = 'none';
                }

                ششششDiv.appendChild(ششششText);
                ششششDiv.appendChild(deleteButton);

                ششششsDiv.appendChild(ششششDiv);
            });
        });
}
window.onload = function () {
    getششششs();
}
