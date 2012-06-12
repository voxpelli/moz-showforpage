The experimental `showforpage` API allows for easy detection of new page loads in Firefox.

## Example ##

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

<api name="ShowForPage">
@class

Module exports `ShowForPage` constructor allowing users to add methods that are called when a new page is loaded.

<api name="ShowForPage">
@constructor
Creates a object that adds all of the listeners.

@param options {Object}
  Options for the listeners, with the following parameters:

@prop [onLocationChange] {Function}
  A callback called when the location is changed in the location bar. Is called with the HTML page as its context and the URL of the page as its only parameter.

@prop [onPageShow] {Function}
  Same as `onLocationChange`, but instead called when the page is loaded or when the hash is changed. Also includes an additional second parameter that is `true` if the background page is loaded in background and otherwise false. This second parameter is useful as it indicates that `onLocationChange` likely hasn't been called prior to `onPageShow`
</api>

<api name="remove">
@method
Removes the listeners from the browser, should eg. be used when a restartless add-on is disabled or uninstalled.
</api>
</api>
