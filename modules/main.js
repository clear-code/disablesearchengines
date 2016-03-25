/*
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

var BASE = 'extensions.disablesearchengines@clear-code.com.';
var prefs = require('lib/prefs').prefs;

var { Services } = Components.utils.import('resource://gre/modules/Services.jsm', {});

function toEngineNames(aString) {
  aString = aString || '';
   aString = aString.trim().split(/[,|\s]+/);
  return aString.map(function(aPart) {
    return aPart.trim();
  }).filter(function(aPart) {
    return aPart !== '';
  });
}

function log(...aMessages) {
  if (!prefs.getPref(BASE + 'debug'))
    return;
  Services.console.logStringMessage('[disablesearchengines] ' + aMessages.map(function(aMessage) {
    if (aMessage && typeof aMessage == 'object')
      return JSON.stringify(aMessage);
    else
      return aMessage;
  }).join(', '));
}

(function() {

  var disabledItems = toEngineNames(prefs.getPref(BASE + 'disabled'));
  var enabledItems = toEngineNames(prefs.getPref(BASE + 'enabled'));

  log({
    disabledItems : disabledItems,
    enabledItems  : enabledItems
  });

  if (disabledItems.length > 0) { // blacklist style
    log ('applying the blacklist');
    disabledItems.forEach(function(aName) {
      var engine = Services.search.getEngineByName(aName);
      log('engine "' + aName + '": ' + engine);
      if (engine)
        Services.search.removeEngine(engine);
    });
  }
  else (enabledItems.length > 0) { // whitelist style
    log ('applying the whitelist');
    Services.search.getEngines().forEach(function(aEngine, aIndex) {
      log('engine ' + aEngine + '"' + aName + '": ' + engine);
      if (enabledItems.indexOf(aEngine.name) < 0)
        Services.search.removeEngine(aEngine);
    });
  }
})();

function shutdown() {
  Services = prefs = toEngineNames = log = undefined;
}
