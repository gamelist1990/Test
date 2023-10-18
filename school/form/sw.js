self.addEventListener('push', function(event) {
    var options = {
      body: event.data.text(),
      icon: 'images/icon.png',
      badge: 'images/badge.png'
    };
    event.waitUntil(self.registration.showNotification('新しいコメントが追加されました', options));
  });
  