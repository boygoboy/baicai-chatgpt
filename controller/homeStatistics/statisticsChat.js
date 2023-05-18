const conversationStatistics=require('../../db/models/chatgpt/conversationStatisticsSchema');
const moment = require('moment');

const statisticsChatInfo=async (req,res)=>{
    let {type,model }=req.query
    let {userId}=req.user.userList
    let oneMonthAgo = moment().subtract(1, 'months').toDate();

    try {
        let chatCountPerDay = await conversationStatistics.aggregate([
            {
                $match: {
                    type: type,
                    model: model,
                    userId: userId, // 匹配userId
                    date: { $gte: oneMonthAgo }
                }
            },
            {
                $group: {
                    _id: {
                        userId: "$userId", // 分组userId
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" }
                    },
                    count: { $sum: 1 },
                    totalPoints: { $sum: "$count" }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                    '_id.day': 1
                }
            }
        ]);
                // Prepare data for ECharts
                const dates = chatCountPerDay.map(stat => `${String(stat._id.month).padStart(2, '0')}-${String(stat._id.day).padStart(2, '0')}`);
                const counts = chatCountPerDay.map(stat => stat.count);
                const totalPoints = chatCountPerDay.map(stat => stat.totalPoints);
        res.json({
            code:'0000',
            message:'success',
            data:{
                xAxisData: dates,
                yAxisCountsData: counts,
                yAxisTotalPointsData: totalPoints
            }
        })
    } catch (error) {
        return res.json({
            code: 500,
            message: '服务器错误！',
            data:error
        })
    }
}

module.exports = {
    statisticsChatInfo
}