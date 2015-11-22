
// main.js

var PinnedIds = new Array();
var Indexes = new Object();
var IgnoreQueries;
var IsPinned;
var Targetize;

////////////////////////////////////////////////////

function LoadQueries()
{
  IgnoreQueries = localStorage.EmergencyBtnIgnoreQueries;
  Targetize = localStorage.EmergencyBtnTargetize == "true" ? true : false;
  if (IgnoreQueries != undefined && IgnoreQueries.length != 0) {
    IgnoreQueries = IgnoreQueries.toString().split("\n");
  }
}

function UnpinTabs(tabs)
{
  for (var i = 0;i < tabs.length;i++) {
    for (var j = 0;j < PinnedIds.length;j++) {
      if (tabs[i].id == PinnedIds[j]) {
        chrome.tabs.update(tabs[i].id, {pinned: false});
      }
    }
  }
}

function ReorderTabs(tabs)
{
  for (var i = 0;i < tabs.length;i++) {
    for (var j = 0;j < PinnedIds.length;j++) {
      if (tabs[i].id == PinnedIds[j]) {
        chrome.tabs.move(tabs[i].id, {index: Indexes[tabs[i].id]});
        delete Indexes[PinnedIds[j]];
        delete PinnedIds[j];
      }
    }
  }
}

function PinTabs(tabs)
{
  for (var i = 0;i < tabs.length;i++) {
    if (tabs[i].pinned == false) {
      var tabid = tabs[i].id;
      if (IgnoreQueries != undefined)  {
        for (var j = 0;j < IgnoreQueries.length;j++)  {
          var r = tabs[i].url.match(new RegExp(IgnoreQueries[j]));
          if (Targetize) {
            // Target mode
            if (!r) tabid = undefined;
          } else {
            // Ignore mode
            if (r) tabid = undefined;
          }
        }
      }
      PinnedIds.push(String(tabid));
      Indexes[tabid] = tabs[i].index;
      chrome.tabs.update(tabid, {pinned: true});
    }
  }
}

////////////////////////////////////////////////////

chrome.browserAction.onClicked.addListener(function() {
  var ns;

  chrome.tabs.getAllInWindow(undefined, function(tabs) {
    if (PinnedIds.length <= 0) {
      LoadQueries();
      PinTabs(tabs);
    } else {
      UnpinTabs(tabs);
      ReorderTabs(tabs);
      PinnedIds.length = 0;
    }
    if (!PinnedIds.length) ns = "";
    else ns = PinnedIds.length.toString();
    chrome.browserAction.setBadgeText({text: ns});
  });
});

chrome.commands.onCommand.addListener(function(command) {
  if (command == "pintab") {
    chrome.tabs.getSelected(undefined, function(tab) {
      IsPinned = tab.pinned ? false : true;
      chrome.tabs.update(tab.id, {pinned: IsPinned});
    });
  }
});
