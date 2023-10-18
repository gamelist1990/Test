if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // 登録成功
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // 登録失敗
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
  