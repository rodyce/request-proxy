var http = require('http'),
    util = require('util'),
    path = require('path'),
    fs = require('fs'),
    colors = require('colors'),
    httpProxy = require('http-proxy');

//
// Create a HTTP Proxy server with a HTTPS target
//
var proxy = httpProxy.createProxyServer();

var mappingData = [
    {
        "url": "/controller/saveLoan",
        "mapping": {
            "type": "JSON_FILE",
            "content-type": "application/json"
        }
    },
    {
        "url": "/controller2",
        "mapping": {
            "type": "PROXY"
        }
    }
]


http.createServer(function(req, res) {
    util.puts('URL: ' + req.url);

    var urlMap = loadMapping(mappingData);
    var mapValue = urlMap[req.url];

    util.puts( JSON.stringify( urlMap ));

    if ((typeof mapValue) != 'undefined' && mapValue != null) {
        util.puts('type: ' + mapValue.type);
        var filename = req.url.substring(1).replace(/\//g, '.') + '.json'; //Skip first slash and replace slashes with dots

        fs.readFile(filename, function(err, fileContent) {
            if (err) {
                util.puts('Error trying to read file. NO DATA WILL BE SENT'.red);
                res.end();
            } else {
                res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
                res.write( fileContent );
                res.end();
            }
        });
    } else {
        util.puts("Vamos a proxear!");
    }

    /*
    switch (req.url) {
        case '/controller':
            util.puts('Aqui vamos a capturar!'.red);
            break;
        default:
            proxy.web(req, res, {
                target: 'https://www.wikipedia.org',
                agent: https.globalAgent,
                headers: {
                    host: 'wikipedia.org'
                }
            });
    }
    */
}).listen(8011);

var loadMapping = function(data) {
    var result = {};
    for (var i = 0; i < data.length; i++) {
        entry = data[i];
        util.puts( JSON.stringify( entry ));

        if (entry.hasOwnProperty("url") && entry.hasOwnProperty("mapping"))
            result[entry["url"]] = entry["mapping"];
    }

    return result;
}

util.puts('http proxy server'.blue + ' started '.green.bold + 'on port '.blue + '8011'.yellow);
