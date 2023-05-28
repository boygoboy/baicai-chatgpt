const conversationStatistics=require('../../db/models/chatgpt/conversationStatisticsSchema');
const pagerFun = require('../../utils/pager')
const moment = require('moment');

const statisticsChatInfo=async (req,res)=>{
    let {type,model }=req.query
    let {userId}=req.user.userList
    let oneMonthAgo = moment().subtract(1, 'months').toDate();
    try {
         // 构建$match查询条件
    let matchQuery = {
        userId: userId, // 匹配userId
        date: { $gte: oneMonthAgo }
    };
    if (type) matchQuery.type = type; // 如果type存在，则匹配type
    if (model) matchQuery.model = model; // 如果model存在，则匹配model
        let chatCountPerDay = await conversationStatistics.aggregate([
            {
                $match: matchQuery // 使用动态构建的查询条件
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

        // 计算对应用户的近一个月的对话总次数和积分总使用
        let totalStatistics = await conversationStatistics.aggregate([
            {
                $match: {
                    userId: userId, // 匹配userId
                    date: { $gte: oneMonthAgo }
                }
            },
            {
                $group: {
                    _id: "$userId", // 根据userId分组
                    totalChats: { $sum: 1 }, // 计算总对话次数
                    totalPoints: { $sum: "$count" } // 计算总积分
                }
            }
        ]);

        // 如果没有找到该用户的数据，返回空的统计结果
        if(totalStatistics.length === 0) {
            totalStatistics = [{
                _id: userId,
                totalChats: 0,
                totalPoints: 0
            }];
        }
        const totalUsage = totalStatistics[0];
        res.json({
            errorCode:'0000',
            message:'success',
            data:{
                xAxisData: dates,
                yAxisCountsData: counts,
                yAxisTotalPointsData: totalPoints,
                totalUsage: totalUsage
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

const getChatDetail=async (req,res)=>{
    let {type,model,pageNum, pageSize }=req.query
    let {userId}=req.user.userList
    let pager = {}
    let params = {}
    if(type)params.type=type
     if(model)params.model=model
     if(userId)params.userId=userId
    try{
        const query = conversationStatistics.find(params)
        const chatlist = await query.skip(pagerFun(pageNum, pageSize).skipIndex).limit(pagerFun(pageNum, pageSize).pager.pageSize)
        const total = await conversationStatistics.countDocuments(params)
        pager.total = total
        pager.pageNum = parseInt(pageNum)
        console.log(chatlist)
        if (chatlist) { 
            chatlist.map(item=>{
                item._doc.date=moment(item._doc.date).format('YYYY-MM-DD HH:mm:ss')
            })
            return res.json({
                errorCode: '0000',
                message: '查询对话记录列表成功!',
                data: { chatlist, pager }
            })
     }
        return res.json({
            errorCode: '2002',
            message: '查询对话记录列表失败!',
            data:null
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
    }
}

module.exports = {
    statisticsChatInfo,getChatDetail
}