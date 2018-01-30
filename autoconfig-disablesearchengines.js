{// Disable Search Engines, for Firefox 52/Thunderbird 52 and later
  let { classes: Cc, interfaces: Ci, utils: Cu } = Components;
  let { Services } = Cu.import('resource://gre/modules/Services.jsm', {});
  const BASE = 'extensions.disablesearchengines@clear-code.com.';

  let toEngineNames = (aString) => {
    aString = aString || '';
    aString = aString.trim().split(/[,|\n\t]+/);
    return aString.map(aPart => aPart.trim()).filter(aPart => aPart !== '');
  };

  let log = (...aMessages) => {
    if (!getPref(`${BASE}debug`))
      return;
    Services.console.logStringMessage('[disablesearchengines] ' + aMessages.map(aMessage => {
      if (aMessage && typeof aMessage === 'object')
        return JSON.stringify(aMessage);
      else
        return aMessage;
    }).join(' '));
  };

  var disabledItems = toEngineNames(getPref(`${BASE}disabled`));
  var enabledItems  = toEngineNames(getPref(`${BASE}enabled`));

  log({ disabledItems, enabledItems });

  if (disabledItems.length > 0) { // blacklist style
    log('disabling specified engines...');
    for (let name of disabledItems) {
      let engine = Services.search.getEngineByName(name);
      log(`engine "${name}": ${engine}`);
      if (engine) {
        Services.search.removeEngine(engine);
        log(' => disabled');
      }
    }
  }
  else if (enabledItems.length > 0) { // whitelist style
    log('disabling unspecified engines...');
    Services.search.getEngines().forEach((aEngine, aIndex) => {
      log(`engine ${aIndex}"${aEngine.name}": ${aEngine}`);
      if (enabledItems.indexOf(aEngine.name) < 0) {
        Services.search.removeEngine(aEngine);
        log(' => disabled');
      }
    });
  }
}
