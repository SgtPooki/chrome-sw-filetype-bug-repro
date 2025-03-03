// Function to update the status display
function updateStatus(message, isSuccess) {
  const statusElement = document.getElementById('swStatus');
  statusElement.innerHTML = `<div class="status ${isSuccess ? 'success' : 'error'}">${message}</div>`;
}

// Show the link to /get when service worker is registered
function showGetLink() {
  document.getElementById('getLink').classList.add('show');
}

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  updateStatus('Attempting to register the Service Worker...', true);
  
  navigator.serviceWorker
    .register('./service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
      updateStatus('Service Worker registered successfully!', true);
      showGetLink();
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err);
      updateStatus(`Service Worker registration failed: ${err.message}`, false);
    });
} else {
  updateStatus('Service Workers are not supported in this browser.', false);
}