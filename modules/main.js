/*
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

var BASE = 'extensions.disablesearchengines@clear-code.com.';
var prefs = require('lib/prefs').prefs;

function toEngineNames(aString) {
  aString = aString || '';
   aString = aString.trim().split(/[,|\s]+/);
  return aString.map(function(aPart) {
    return aPart.trim();
  }).filter(function(aPart) {
    return aPart !== '';
  });
}

(function() {
  var { Services } = Components.utils.import('resource://gre/modules/Services.jsm', {});

  var disabledItems = toEngineNames(prefs.getPref(BASE + 'disabled'));
  var enabledItems = toEngineNames(prefs.getPref(BASE + 'enabled'));

  if (disabledItems.length > 0) { // blacklist style
    disabledItems.forEach(function(aName) {
      var engine = Services.search.getEngineByName(aName);
      if (engine)
        Services.search.removeEngine(engine);
    });
  }
  else (enabledItems.length > 0) { // whitelist style
    Services.search.getEngines().forEach(function(aEngine) {
      if (enabledItems.indexOf(aEngine.name) < 0)
        Services.search.removeEngine(aEngine);
    });
  }
})();

function shutdown() {
  prefs = toEngineNames = undefined;
}
