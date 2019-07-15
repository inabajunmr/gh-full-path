const regex = /^https:\/\/github.com\/.*\/pull\/.*\/files.*/;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (regex.test(tab.url)) {
    kick();
  }
});

function kick() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "gh-full-path", function(response) {});
  });
}
