const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require('path');
const imgScriptPath = path.join(__dirname, 'python/img.py');
async function calculateOffset(bg, fullbg) {
  return Promise.resolve().then(() =>
    (async function () {
      const { stdout } = await exec(`python ${imgScriptPath} ${bg} ${fullbg}`);
      const offset = parseInt(stdout.toString());
      return offset;
    })()
  );
}


const getOffset= async(bg,fullbg)=>{
    const result=  await calculateOffset(`https://static.geetest.com/${bg}`,`https://static.geetest.com/${fullbg}`)
   console.log(result)
    const trackdata= generateSlideTrace(result)
    console.log(trackdata)
    return{
        offset:result,
        trackdata:trackdata
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//生成滑块轨迹数据
function generateSlideTrace(distance) {
    console.log(distance)
    // 前两行按照刚才的观察来构造
    const trace = [
      [random(-50, -10), random(-50, -10), 0],
      [0, 0, 0],
    ]
    // 轨迹记录数量
    const count =  30 + Math.floor(distance / 2)
    // 耗时
    let t = random(50, 100)
    // 记录上一个轨迹
    let lastX = 0
    let lastY = 0
    let lastYCount = 0
    for (let i = 0; i < count; i++) {
      // 已滑动的距离
      const x = Math.round(i == count ? 1 : (1 - Math.pow(2, (-10 * i) / count)) * distance)
      // 耗时
      t += random(10, 20)
      if (x === lastX) {
        // 不合理
        continue
      }
      lastYCount += 1
      if (lastYCount > random(5, 10)) {
        // y 的变动不太大，连续多个 y 之后再考虑更新
        lastYCount = 0
        lastY = random(-2, 2)
      }
      lastX = x
      trace.push([x, lastY, t])
    }
    return trace
  }

  module.exports = {
    getOffset
  }



  




