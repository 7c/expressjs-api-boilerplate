var express = require('express');
var chalk=require('chalk');
var { softexit } = require('mybase')
var { getConfig,Sentry } = require('./config.js')
var argv = require('minimist')(process.argv.slice(2))
var bodyParser = require('body-parser');
var fs = require('fs')
var path = require('path')
var debug=require('debug')('apiserver')
var app = express();
var requestIp = require('request-ip');
var package = require('./package.json')
var cors = require('cors')
var { api_ping,requirePost,mw_authAdminUser } = require('./api')
var config

app.use(cors())
app.use(requestIp.mw())
// app.use(function (req, res, next) { mw_authAdminUser(req,res,next,config) })
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/ping', api_ping)

app.get('/:service/*', function(req, res) {
    var service = req.params.service
    if (config.services.hasOwnProperty(service)) {
        // res.send("tagId is set to " + req.params.service);
        var content = fs.readFileSync(path.join(__dirname,'search.html'),'utf8')
        var payload = {
            serviceName:config.services[service].name,
            service:service,
            url:req.url.replace(/\/[a-z]+\//,'/')
        }
        var body = content.replace(/var.*payload.*/,`var payload=JSON.parse('${JSON.stringify(payload)}')`)
        // console.log(content)
        // res.redirect(301,'/static/go.html?service='+service)
        res.send(body)
    } else res.status(404).send("Sorry!")
});

app.get('/p/:tagId', function(req, res) {
  res.send("tagId is set to " + req.params.tagId);
});

app.get('*', async function (req, res) {
    console.log(`/*`,chalk.bold(req.originalUrl))
    //+ req.originalUrl
    return res.redirect(301, 'https://targetdomain.com');
})

// function checkDefaults(req) {
//     // console.log(req)
//     // process.exit(0)
//     // defaults
//         // 'client'
//         // 'alang'
//         // 'cid'
//     if (   !req 
//         || !Object.hasOwnProperty.call(req,'body')
//         || !Object.hasOwnProperty.call(req.body,'cv')
//         || !Object.hasOwnProperty.call(req.body,'lang')
//     ) {
//         console.log(`Defaults are missing: >`,req.body,`<`)
//         res.json({ retcode: -50,msg:'defaults are missing'});        
//         return false
//     }
//     // verify cv
//     if (req.body.hasOwnProperty('cv') && req.body.cv.search(/^[0-9]+\.[0-9]+\.[0-9]+$/)!==0)
//     {
//         console.log(`invalid cv given ${req.body.cv}`)
//         res.json({ retcode: -50,msg:'invalid cv'});
//         return false
//     }
//     // all checks are passed
//     return true;
// }

async function bootstrap () {
    console.log(chalk.green(`Starting API Server`))
    try {
        config = await getConfig()

        // start api server
        app.listen(config.apiserver.port,config.apiserver.ip, ()=> {
            console.log(chalk.bold(`${package.name} ${package.version} API Server is running at ${config.apiserver.ip}:${config.apiserver.port}`));
        });
    } 
    catch(err) {
        console.log(chalk.red(`Exception at start:`),err.message)
        if (Sentry) Sentry.captureException(err,{extra:{location:'bootstrap'}})
        softexit(60)
    }
    
}

bootstrap()