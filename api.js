var debug=require('debug')('apiserver')

function api_ping (req, res) {
    debug("GET",req.originalUrl)
    res.json({
        retcode: 200,
        message: 'pong',
    })
}



module.exports = {
    api_ping
}