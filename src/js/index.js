const { errorToString } = require('./util');

try {


    const scripts = document.getElementsByTagName('script');
    const legacyDomain = scripts[scripts.length-1].getAttribute("src").indexOf("oldtube.us") !== -1;

    // We use require instead of imports here to be able to enclose it all in a try-catch for debugging purposes on the TV

    const configurator = require('core-js/configurator');

    configurator({
        usePolyfill: ['Set', 'Promise', 'Object'], // polyfills will be used anyway
    });

    require('core-js/features/set');
    require('core-js/features/promise');
    require('core-js/features/object');
    require('core-js/features/function');
    require('core-js/features/array/find');
    require('core-js/features/array/includes');
    require('core-js/features/string/includes');
    require('core-js/features/string/replace-all');
    require('core-js/web/url');
    require('core-js/web/url-search-params');

    const React = require('react');
    const ReactDOM = require('react-dom');

    const App = require('./App').default;

    ReactDOM.render(<App legacyDomain={legacyDomain}/>, document.getElementById('root'));

    window.onload = function() {
        var NNaviPlugin = document.getElementById("pluginObjectNNavi");
        NNaviPlugin.SetBannerState(1);

        var pluginAPI = new Common.API.Plugin();
        var tvKey = new Common.API.TVKeyValue();

        // Unregister keys for volume OSD.
        pluginAPI.SetBannerState(1);
        pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
        pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
        pluginAPI.unregistKey(tvKey.KEY_MUTE);
    };

    // 2. This code loads the IFrame Player API code asynchronously.
    const tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const gtmTag = document.createElement('script');
    gtmTag.src = "https://www.googletagmanager.com/gtag/js?id=G-JZNXHHJWW5";

    firstScriptTag.parentNode.insertBefore(gtmTag, firstScriptTag);

    window.dataLayer = window.dataLayer || [];
    
    function gtag(){dataLayer.push(arguments);}
    
    gtag('js', new Date());

    const GA_LOCAL_STORAGE_KEY = 'ga:clientId';

    gtag('config', 'G-JZNXHHJWW5', {
        'storage': 'none',
        'cookieDomain': 'none',
        'clientId': localStorage.getItem(GA_LOCAL_STORAGE_KEY)
    }, function(tracker) {
        const clientId = tracker.get('clientId');
        localStorage.setItem(GA_LOCAL_STORAGE_KEY, clientId);
        alert("GA clientId: " + clientId);
    });

    // gtag('set', 'checkProtocolTask', null); // Disable file protocol checking.
    gtag('set', 'legacyDomain', legacyDomain);


} catch (err) {
    alert(errorToString(err));
    const widgetAPI = new Common.API.Widget();
    widgetAPI.sendReadyEvent();
    document.write("<h1>Error:" + errorToString(err) + "</h1>");
}