// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection("gdTravelData").doc("gdData").update({
      data: {
        list: event.list
      }
    })
  } catch (e) {
    console.error(e);
  }
}