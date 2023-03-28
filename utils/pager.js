module.exports = function (pageNum = 1, pageSize = 10) {
    let skipIndex
    if (pageNum <= 0) {
        skipIndex = 1
    } else {
        skipIndex = (pageNum - 1) * pageSize
    }

    console.log('skio', skipIndex)
    return {
        pager: {
            pageSize,
            pageNum
        },
        skipIndex
    }
}