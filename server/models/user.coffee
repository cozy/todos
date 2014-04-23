americano = require 'americano-cozy'


module.exports = User = americano.getModel 'User',
    email: type: String
