document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('toggle-extension');
  if (!checkbox) return;
  chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
    checkbox.checked = enabled;
  });
  checkbox.addEventListener('change', () => {
    chrome.storage.sync.set({ enabled: checkbox.checked });
  });
}); 