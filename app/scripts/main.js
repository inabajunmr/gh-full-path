`use strict`;

gh_fullpath = {};

gh_fullpath.get_targets = function() {
  return document.querySelectorAll(".file-info > a");
};

gh_fullpath.show_fullpath = function() {
  // correct filepath elements(a tag)
  let targets = gh_fullpath.get_targets();
  if (targets == null) {
    return;
  }

  Array.prototype.forEach.call(targets, target => {
    target.classList.remove("classcss-truncate")
    target.classList.remove("css-truncate-target")
  });
};

gh_fullpath.hook_files_changes_link = function() {
  // hook only no files window. (Not only directly access to Files changes.)
  if (document.querySelector("#files") != null) {
    return;
  }

  if (document.querySelector(".tabnav.tabnav-pr .tabnav-tabs") == null) {
    return;
  }

  // not load contents as soon as click so observe tab and polling to show diff contents.
  let observer = new MutationObserver(records => {
    let id = setInterval(function() {
      if (document.querySelector("#files") == null) {
        return;
      }
      gh_fullpath.show_fullpath();
      gh_fullpath.observe();

      if (document.querySelector("#files") != null) {
        clearInterval(id);
      }
    }, 200);
  });
  observer.observe(document.querySelector(".tabnav.tabnav-pr .tabnav-tabs"), {
    childList: true
  });
};

gh_fullpath.observe = function() {
  // Files are lazy fetched so invoke show_fullpath by each loading.
  let observer = new MutationObserver(records => {
    gh_fullpath.show_fullpath();
  });

  Array.prototype.forEach.call(
    document.getElementsByClassName("js-diff-progressive-container"),
    target => {
      observer.observe(target, { childList: true });
    }
  );
};

gh_fullpath.main = function() {
  gh_fullpath.hook_files_changes_link();
  gh_fullpath.observe();
  gh_fullpath.show_fullpath();
};

gh_fullpath.main();

// GitHub has async compile dom so kick script by ajax http access via background
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if ("gh-full-path" === message) {
    gh_fullpath.main();
  }
  return;
});
