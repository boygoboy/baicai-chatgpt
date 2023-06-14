//get.php
  //构造浏览器必要的环境变量
 export var info={}
function getBrowserInfo() {
    // 获取浏览器基础信息
    function tagCounts() {
        var tags = document.getElementsByTagName('*');
        var tagInfo = {};
        for (var i = 0; i < tags.length; i++) {
            var tagName = tags[i].tagName;
            tagInfo[tagName] = tagInfo.hasOwnProperty(tagName) ? tagInfo[tagName] + 1 : 1;
        }
        return tagInfo;
    }

    function detectFonts() {
        var baseFonts = ['monospace', 'sans-serif', 'serif'];
        var testString = "mmmmmmmmmmlli";
        var testSize = '72px';
        var h = document.getElementsByTagName("body")[0];

        var s = document.createElement("span");
        s.style.fontSize = testSize;
        s.innerHTML = testString;

        var defaultWidth = {};
        var defaultHeight = {};
        for (var index in baseFonts) {
            s.style.fontFamily = baseFonts[index];
            h.appendChild(s);
            defaultWidth[baseFonts[index]] = s.offsetWidth;
            defaultHeight[baseFonts[index]] = s.offsetHeight;
            h.removeChild(s);
        }

        var detectFont = function (font) {
            var detected = false;
            for (var index in baseFonts) {
                s.style.fontFamily = font + ',' + baseFonts[index];
                h.appendChild(s);
                var matched = (s.offsetWidth !== defaultWidth[baseFonts[index]] || s.offsetHeight !== defaultHeight[baseFonts[index]]);
                h.removeChild(s);
                detected = detected || matched;
            }
            return detected;
        };

        var fonts = ["Arial", "Arial Black", "Arial Narrow", "Book Antiqua", "Bookman Old Style", "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Comic Sans MS", "Consolas", "Courier", "Courier New", "Garamond", "Georgia", "Helvetica", "Impact", "Lucida Console", "Lucida Sans Unicode", "Microsoft Sans Serif", "Monotype Corsiva", "MS Gothic", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "Palatino Linotype", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Tahoma", "Times", "Times New Roman", "Trebuchet MS", "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"];
        var available = [];
        for (var i = 0, l = fonts.length; i < l; i++) {
            if (detectFont(fonts[i])) {
                available.push(fonts[i]);
            }
        }

        return available;
    }


 info = {
    ...tagCounts(),
    textLength: document.documentElement.innerText.length,
    HTMLLength: document.documentElement.innerHTML.length,
    documentMode: document.compatMode,
    browserLanguage: navigator.language,
    browserLanguages: navigator.languages.join(","),
    devicePixelRatio: window.devicePixelRatio,
    colorDepth: screen.colorDepth,
    userAgent: navigator.userAgent,
    cookieEnabled: navigator.cookieEnabled ? 1 : 0,
    netEnabled: navigator.onLine ? 1 : 0,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenAvailWidth: screen.availWidth,
    screenAvailHeight: screen.availHeight,
    screenLeft: window.screenLeft,
    screenTop: window.screenTop,
    screenAvailLeft: screen.availLeft,
    screenAvailTop: screen.availTop,
    localStorageEnabled: typeof(Storage) !== "undefined" ? 1 : 0,
    sessionStorageEnabled: typeof(Storage) !== "undefined" ? 1 : 0,
    indexedDBEnabled: 'indexedDB' in window ? 1 : 0,
    platform: navigator.platform,
    doNotTrack: navigator.doNotTrack === "1" ? 1 : 0,
    timezone: -(new Date().getTimezoneOffset()) / 60,
    canvas2DFP: '',
    canvas3DFP: 0, // 需要额外的代码来计算
    plugins: Array.from(navigator.plugins).map(p => p.name).join(","),
    maxTouchPoints: navigator.maxTouchPoints,
    flashEnabled: -1, // Flash 已被弃用，此项可能不再有效
    javaEnabled: navigator.javaEnabled() ? 1 : 0,
    hardwareConcurrency: navigator.hardwareConcurrency,
    jsFonts: detectFonts().join(","),
    mediaDevices: typeof(navigator.mediaDevices) !== "undefined" ? 1 : -1,
    timestamp: Date.now(),
    touchEvent: -1, // 需要额外的代码来检测
    performanceTiming: -1, // 需要额外的代码来获取性能时序数据
    internalip: -1 // 需要额外的代码来获取内部 IP 地址
};
return info;
}
getBrowserInfo()

export function loadCryptoJS() {
    // const script = document.createElement('script');
    // script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js';
    // document.body.appendChild(script);

    // script.onload = function() {
    //     callback();
    // };
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js';
        document.body.appendChild(script);

        script.onload = function() {
            resolve();
        };

        script.onerror = function() {
            reject(new Error('Failed to load the script'));
        };
    });
}

export function getCanvasFingerprint() {
    // const canvas = document.createElement('canvas');
    // const ctx = canvas.getContext('2d');

    // const txt = 'canvas fingerprinting test';
    // ctx.textBaseline = 'top';
    // ctx.font = '14px Arial';
    // ctx.textBaseline = 'alphabetic';
    // ctx.fillStyle = '#f60';
    // ctx.fillRect(125, 1, 62, 20);
    // ctx.fillStyle = '#069';
    // ctx.fillText(txt, 2, 15);
    // ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    // ctx.fillText(txt, 4, 17);

    // const dataURL = canvas.toDataURL('image/png');

    // const hash = CryptoJS.MD5(dataURL).toString();

    // // 使用回调函数返回结果
    // callback(hash);

    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const txt = 'canvas fingerprinting test';
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText(txt, 4, 17);

        const dataURL = canvas.toDataURL('image/png');

        const hash = CryptoJS.MD5(dataURL).toString();

        // 使用 resolve 返回结果
        resolve(hash);
    });



}

// // 使用示例
// loadCryptoJS(() => {
//     getCanvasFingerprint((canvasFingerprint) => {
//         // 这里canvasFingerprint是你要的值，你可以把它放到你的对象属性中
//         info.canvas2DFP=canvasFingerprint
//         // 打印或使用这个对象
//         console.log(get_i_arrstring(info))
        
//     });
// });


export function get_i_arrstring(info){
    console.log(info)
    var a_i_info= [
        "textLength",
        "HTMLLength",
        "documentMode",
        "A",
        "ARTICLE",
        "ASIDE",
        "AUDIO",
        "BASE",
        "BUTTON",
        "CANVAS",
        "CODE",
        "IFRAME",
        "IMG",
        "INPUT",
        "LABEL",
        "LINK",
        "NAV",
        "OBJECT",
        "OL",
        "PICTURE",
        "PRE",
        "SECTION",
        "SELECT",
        "SOURCE",
        "SPAN",
        "STYLE",
        "TABLE",
        "TEXTAREA",
        "VIDEO",
        "screenLeft",
        "screenTop",
        "screenAvailLeft",
        "screenAvailTop",
        "innerWidth",
        "innerHeight",
        "outerWidth",
        "outerHeight",
        "browserLanguage",
        "browserLanguages",
        "systemLanguage",
        "devicePixelRatio",
        "colorDepth",
        "userAgent",
        "cookieEnabled",
        "netEnabled",
        "screenWidth",
        "screenHeight",
        "screenAvailWidth",
        "screenAvailHeight",
        "localStorageEnabled",
        "sessionStorageEnabled",
        "indexedDBEnabled",
        "CPUClass",
        "platform",
        "doNotTrack",
        "timezone",
        "canvas2DFP",
        "canvas3DFP",
        "plugins",
        "maxTouchPoints",
        "flashEnabled",
        "javaEnabled",
        "hardwareConcurrency",
        "jsFonts",
        "timestamp",
        "performanceTiming",
        "internalip",
        "mediaDevices",
        "DIV",
        "P",
        "UL",
        "LI",
        "SCRIPT",
        "touchEvent"
    ]
    var a_i_info_value=[]
    for (var i = 0; i < a_i_info.length; i++) {
        if(info[a_i_info[i]]||info[a_i_info[i]]==0){
            a_i_info_value.push(info[a_i_info[i]])
        }else{
            a_i_info_value.push(-1)
        }
    }
    console.log(a_i_info_value)
    return a_i_info_value.join("!!")

}





