var debug = require('debug')('config')
var { isLocal } = require('mybase')
var argv = require('minimist')(process.argv.slice(2));
var Sentry = require('raven')
// Sentry.config('<URL>',{
//     captureUnhandledRejections: true,
//     name: require('os').hostname()
// }).install()


var config = {
    apiserver: {
        ip:'127.0.0.1',
        port:7600
    }
}


function getConfig() {
    return new Promise(async function (resolve,reject) {
        resolve(config)
    })
}

if (require.main===module) {
    getConfig().then(c=>{
        console.log(c)
        process.exit(0)
    })
}

module.exports = { getConfig,Sentry }