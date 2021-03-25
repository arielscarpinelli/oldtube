try {

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
    require('core-js/web/url');
    require('core-js/web/url-search-params');

    const React = require('react');
    const ReactDOM = require('react-dom');

    const App = require('./App').default;

    ReactDOM.render(<App/>, document.getElementById('root'));

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
    let tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";

    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    let GA_LOCAL_STORAGE_KEY = 'ga:clientId';

    ga('create', 'UA-102778294-1', {
        'storage': 'none',
        'cookieDomain': 'none',
        'clientId': localStorage.getItem(GA_LOCAL_STORAGE_KEY)
    });
    ga(function(tracker) {
        var clientId = tracker.get('clientId');
        localStorage.setItem(GA_LOCAL_STORAGE_KEY, clientId);
        alert("GA clientId: " + clientId);
    });

    ga('set', 'checkProtocolTask', null); // Disable file protocol checking.
    ga('send', 'pageview');


} catch (err) {
    alert(err);
    const widgetAPI = new Common.API.Widget();
    widgetAPI.sendReadyEvent();
    document.write("<h1>Error:" + err + "</h1>");
}