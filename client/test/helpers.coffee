exports.waits = (done, time) ->
    func = -> done()
    setTimeout(func, time)
