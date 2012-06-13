/*global require: false, exports: false */
/*jslint indent: 2 */

var Ci = require("chrome").Ci,
  Cr = require("chrome").Cr,
  winUtils = require("window-utils"),
  tabBrowser = require("tab-browser"),
  ShowForPage;

ShowForPage = function (options) {
  "use strict";

  if (!options) {
    return;
  }

  var windowTracker, tabTracker,
    // Methods used internally
    getContentDocument, windowPageShowEvent, tabSelectEvent, tabProgressListener,
    // Methods exposed externally
    remove;

  getContentDocument = function (windowElement) {
    var doc, pageWindow, pageTabBrowser;

    if (windowElement.gBrowser) {
      pageWindow = windowElement;
    } else {
      pageWindow = windowElement.ownerDocument.defaultView;
    }

    if (windowElement.tagName === 'tab') {
      pageTabBrowser = pageWindow.gBrowser.getBrowserForTab(windowElement);
      doc = pageTabBrowser.contentDocument;
    } else {
      doc = pageWindow.gBrowser.contentDocument;
    }

    return doc;
  };

  remove = function () {
    tabTracker.unload();
    windowTracker.unload();
  };

  windowPageShowEvent = function (event) {
    var doc = (event.type === 'hashchange' ? event.originalTarget.document : event.originalTarget),
      href;

    if (doc.defaultView.frameElement) {
      return; // skip iframes/frames
    }

    href = doc.location.href;

    options.onPageShow.call(doc, href, getContentDocument(tabBrowser.activeTab).location.href !== href);
  };

  tabSelectEvent = function (event) {
    var doc = getContentDocument(event.originalTarget);
    options.onPageShow.call(doc, doc.location.href, false);
  };

  tabProgressListener = {
    QueryInterface: function (aIID) {
      if (aIID.equals(Ci.nsIWebProgressListener) || aIID.equals(Ci.nsISupportsWeakReference) || aIID.equals(Ci.nsISupports)) {
        return this;
      }
      throw Cr.NS_NOINTERFACE;
    },
    onLocationChange: function (aProgress, aRequest, aURI) {
      options.onLocationChange(aURI.spec);
    }
  };

  windowTracker = new winUtils.WindowTracker({
    onTrack: function (window) {
      var appcontent;

      if (winUtils.isBrowser(window) && options.onPageShow) {
        appcontent = window.document.getElementById("appcontent");
        appcontent.addEventListener('hashchange', windowPageShowEvent);
        appcontent.addEventListener('pageshow', windowPageShowEvent, true);
      }
    },
    onUntrack: function (window) {
      var appcontent;

      if (winUtils.isBrowser(window) && options.onPageShow) {
        appcontent = window.document.getElementById("appcontent");
        appcontent.removeEventListener('hashchange', windowPageShowEvent);
        appcontent.removeEventListener('pageshow', windowPageShowEvent, true);
      }
    }
  });

  tabTracker = new tabBrowser.Tracker({
    onTrack: function (tabbrowser) {
      if (options.onPageShow) {
        tabbrowser.tabContainer.addEventListener('TabSelect', tabSelectEvent);
      }
      if (options.onLocationChange) {
        tabbrowser.addProgressListener(tabProgressListener);
      }
    },
    onUntrack: function (tabbrowser) {
      if (options.onPageShow) {
        tabbrowser.tabContainer.removeEventListener('TabSelect', tabSelectEvent);
      }
      if (options.onLocationChange) {
        tabbrowser.removeProgressListener(tabProgressListener);
      }
    }
  });

  return {
    remove : remove
  };
};

exports.ShowForPage = ShowForPage;
