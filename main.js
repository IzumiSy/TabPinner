
// main.js

// Variables
var PinnedIds = new Array();
var Indexes = new Object();
var IsPinned;

// Extension
chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.getAllInWindow(undefined, function(tabs) {
		if (PinnedIds.length <= 0) {
			for (var i = 0; i < tabs.length;i++) {
				if (tabs[i].pinned == false) {
					chrome.tabs.update(tabs[i].id, {pinned: true});
					PinnedIds.push(String(tabs[i].id));
					Indexes[tabs[i].id] = tabs[i].index;
				}
			}
			chrome.browserAction.setBadgeText({text: PinnedIds.length.toString()});
		} else {
			for (var i = 0; i < tabs.length;i++) {
				for (var j = 0;j < PinnedIds.length;j++) {
					if (tabs[i].id == PinnedIds[j]) {
						chrome.tabs.update(tabs[i].id, {pinned: false});
					}
				}
			}
			for (var i = 0;i < tabs.length;i++) {
				for (var j = 0;j < PinnedIds.length;j++) {
					if (tabs[i].id == PinnedIds[j]) {
						chrome.tabs.move(tabs[i].id, {index: Indexes[tabs[i].id]});
						delete Indexes[PinnedIds[j]];
						delete PinnedIds[j];
					}
				}
			}
			PinnedIds.length = 0;
			chrome.browserAction.setBadgeText({text: ""});
		}
	});
});

// Shortcut Key
chrome.commands.onCommand.addListener(function(command) {
	if (command == "pintab") {
		chrome.tabs.getSelected(undefined, function(tab) {
			IsPinned = tab.pinned ? false : true;
			chrome.tabs.update(tab.id, {pinned: IsPinned});
		});
	}
});
