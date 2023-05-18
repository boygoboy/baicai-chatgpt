const express = require('express');
const router = express.Router();
const {getInterfaceRateList,postInterfaceRate,getInterfacePriceList,postInterfacePrice}=require('../../../controller/chatGpt/interfaceRate.js')
router.get("/interfaceratelist", (req, res) => {
    getInterfaceRateList(req, res);
})

router.post("/interfaceratelist", async(req, res) => {
        await postInterfaceRate(req, res);
})

router.get("/interfacepricelist", (req, res) => {
    getInterfacePriceList(req, res);
})

router.post("/interfacepricelist", (req, res) => {
     postInterfacePrice(req, res);
})
module.exports = router;