var debug=require('debug')('apiserver')

function api_ping (req, res) {
    debug("GET",req.originalUrl)
    res.json({
        retcode: 200,
        message: 'pong',
    })
}


function mw_authAdminUser(req, res) {
    var headers = req.headers
    var uri = req.originalUrl.replace(/^\/api/, '')
    debug(`authAdminUser uri=${uri} headers=`, JSON.stringify(headers))
    if (headers.hasOwnProperty('token') &&
        config.auth_tokens.hasOwnProperty(headers['token']) &&
        (config.auth_tokens[headers['token']].includes('*') || config.auth_tokens[headers['token']].includes(uri))) {
        debug(`user ${headers['token']} has access to ${uri}`)
        return true
    }
    res.json({
        retcode: -1,
        message: 'Access denied'
    })
    return false
}


function requirePost(req, param) {
    return (req && req.hasOwnProperty('body') && Object.hasOwnProperty.call(req.body, param))
}

module.exports = {
    api_ping,
    requirePost,
    mw_authAdminUser
}