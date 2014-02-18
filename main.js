
// main.js

// Variables
var PinnedIds = new Array();
var Indexes = new Object();
var IgnoreQueries;
var IsPinned;

// Extension
chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.getAllInWindow(undefined, function(tabs) {
		if (PinnedIds.length <= 0) {
			IgnoreQueries = localStorage.EmergencyBtnIgnoreQueries;
			if (IgnoreQueries != undefined && IgnoreQueries.length != 0) {
				IgnoreQueries = IgnoreQueries.toString().split("\n");
			}
			for (var i = 0;i < tabs.length;i++) {
				if (tabs[i].pinned == false) {
					var tabid = tabs[i].id;
					for (var j = 0;j < IgnoreQueries.length;j++)  {
						var r = tabs[i].url.match(new RegExp(IgnoreQueries[j]));
						if (r) {
							console.log(r);
							tabid = undefined;
						}
					}
					PinnedIds.push(String(tabid));
					Indexes[tabid] = tabs[i].index;
					chrome.tabs.update(tabid, {pinned: true});
				}
			}
			chrome.browserAction.setBadgeText({text: PinnedIds.length.toString()});
		} else {
			for (var i = 0;i < tabs.length;i++) {
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
