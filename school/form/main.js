// Realtime Databaseへの参照を取得
// コメント送信フォーム
function submitForm() {
    var name = document.getElementById('name').value || '匿名' + Math.floor(1000 + Math.random() * 9000);
    var comment = document.getElementById('dai').value;

    // コメントが空でないことを確認
    if (!comment.trim()) {
        alert('コメント内容を入力してください');
        return false;
    }

    // スパム対策（同じコメントが短時間で複数回投稿されるのを防ぐ）
    if (isSpam(comment)) {
        alert('スパム対策のため、同じコメントは10秒以上間隔をあけて投稿してください');
        return false;
    }

    // コメントをRealtime Databaseに保存
    submitComment(name, comment)
        .then(() => {
            console.log("Document written with ID: ", newCommentRef.key);
            document.getElementById('name').value = '';
            document.getElementById('dai').value = '';
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    return false;
}

document.addEventListener('DOMContentLoaded', (event) => {
    
   // コメント表示
   getComments((comments) => {
       var commentsDiv = document.getElementById('comments');
       commentsDiv.innerHTML = '';
       
       comments.forEach((commentData) => {
           var commentElement = document.createElement('p');
           commentElement.innerHTML = '<strong>' + commentData.name + '</strong>: ' + commentData.comment;
           
           if (isAdmin) {
               var deleteButton = document.createElement('button');
               deleteButton.className = 'deleteButton';
               deleteButton.textContent = '削除';
               deleteButton.onclick = function() { deleteComment(commentData.id); };
               commentElement.appendChild(deleteButton);
           }
           
           commentsDiv.appendChild(commentElement);
       });
   });

   // 管理者モードの切り替えボタン
   document.querySelector('button[onclick="toggleAdmin();"]').addEventListener('click', toggleAdmin);

   // 全てのコメントを削除するボタン
   document.querySelector('button[onclick="deleteAllcomments();"]').addEventListener('click', deleteAllcomments);
});
