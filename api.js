var debug=require('debug')('apiserver')

function api_ping (req, res) {
    debug("GET",req.originalUrl)
    res.json({
        retcode: 200,
        message: 'pong',
    })
}


function mw_authAdminUser(req, res,next,config) {
    var headers = req.headers
    var given_token = headers.hasOwnProperty('token') ? headers['token'] : false
    console.log(`given_token=${given_token}`)
    debug(`authAdminUser uri=${req.originalUrl} headers=`, JSON.stringify(headers))
    if (given_token && config.auth_tokens.hasOwnProperty(given_token))
    {
        
        var token_config = config.auth_tokens[given_token]
        for(var rx of token_config)
        {
            if (req.originalUrl.match(rx)) {
                console.log(`authAdminUser: token=${given_token} granted access to ${rx}`)
                return next()
            }
        }
    }
    
    res.json({
        retcode: -99,
        message: 'Access denied'
    })
    res.end()
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