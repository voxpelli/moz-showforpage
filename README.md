ShowForPage for Mozilla Add-on SDK
=======

The experimental `showforpage` API allows for easy detection of new page loads in Firefox.

## Usage

    var showForPage = require('showforpage').ShowForPage,
      listeners;
    
    exports.main = function () {
      listeners = showForPage({
        onLocationChange : checkUrl,
        onPageShow : checkForStuffInHTML
      });
    };
    
    exports.onUnload = function (reason) {
      if (reason !== 'shutdown') {
        listeners.remove();
      }
    };

## Options

* **onLocationChange** - a callback that checks if the button should be showed on the current page or not. Called when the URL is changed. (optional)
* **onPageShow** - like `onLocationChange` but called when the page is loaded. (optional)

### Option syntax: onLocationChange

Should be a function. Is called with the URL of the current page as a single argument and has the document of the page that is checked as its context.

### Option syntax: onPageShow

Same as `onLocationChange` but also includes an additional second parameter that is `true` if the background page is loaded in background and otherwise false. That second parameter is useful as it indicates that `onLocationChange` likely hasn't been called prior to `onPageShow`.

## How to use

Follow the Add-on SDK's documentation for [third party packages](https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/adding-menus.html).

## Other modules usable with this one

* [UrlbarButton](https://github.com/voxpelli/moz-urlbarbutton)

## In action in

* **Flattr Firefox Add-on**: [Source](https://github.com/flattr/fx-flattr-addon)

## Changelog

### 0.1.0

* Moved the `onLocationChange` and `onPageShow` listeners, that were called when a new page was loaded, in the [UrlbarButton](https://github.com/voxpelli/moz-urlbarbutton) module into this new module and then also removed the callbacks that were included as an argument when those listeners were called.
