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
    var ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ = isOyasai ? '管理者' : document.getElementById('ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡').value;
    if (ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ === '') {
        ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ = '匿名' + Math.floor(1000 + Math.random() * 9000);
    }

    db.collection("kisidahumios").add({
        ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡: ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡,
        kisidahumio: dai,
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
function deletekisidahumio(event) {
    if (isOyasai) {
        var kisidahumioId = event.target.getAttribute('data-id');
        db.collection("kisidahumios").doc(kisidahumioId).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
}
function deleteAllkisidahumios() {
    if (isOyasai) {
        db.collection("kisidahumios").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("kisidahumios").doc(doc.id).delete().then(() => {
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            });
        });
    }
}
function getkisidahumios() {
    db.collection("kisidahumios").orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
            var kisidahumiosDiv = document.getElementById('kisidahumios');
            kisidahumiosDiv.innerHTML = ''; 
            querySnapshot.forEach((doc) => {
                var kisidahumioDiv = document.createElement('div');
                kisidahumioDiv.classơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ = 'kisidahumio' + (isOyasai ? ' admin' : '');

                var kisidahumioText = document.createElement('p');
                kisidahumioText.textContent = '名前：' + doc.data().ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ơ̟̤̖̗͖͇̍͋̀͆̓́͞͡ + '||| コメント内容：' + doc.data().kisidahumio;

                var deleteButton = document.createElement('button');
                deleteButton.textContent = '削除';
                deleteButton.setAttribute('data-id', doc.id); 
                deleteButton.onclick = deletekisidahumio; 
                if (isOyasai) { 
                    deleteButton.style.display = 'inline';
                } else { 
                    deleteButton.style.display = 'none';
                }

                kisidahumioDiv.appendChild(kisidahumioText);
                kisidahumioDiv.appendChild(deleteButton);

                kisidahumiosDiv.appendChild(kisidahumioDiv);
            });
        });
}
window.onload = function () {
    getkisidahumios();
}
