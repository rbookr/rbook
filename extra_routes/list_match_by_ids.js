/* 
 * 通过ids 来返回列表
 * list_mach_by_ids/?id=a,b,c,d
 * tags 必须都要被包含
 *
 * 返回
 * {
 *  status:0,
 *  messgage:ok,
 *  articles: [
 *      {
 *          "_id": "3ef076c6cf81bc82ab6ceaa9766ee993",
 *          "real_path": "/home/rainboy/mycode/pcs/uva/455/1.md",
 *          "resolve_path": "uva/455/1.md",
 *          "update_time": 1559581380,
 *          "title": "uva 445 Periodic Strings",
 *          "head": {
 *            "title": "uva 445 Periodic Strings",
 *            "level": 2,
 *            "author": "rainboy",
 *            "create": "2019-06-04 01:03",
 *            "update": "2019-06-04 01:03",
 *            "tags": [
 *              "uva",
 *              "字符串"
 *            ],
 *            "source": [
 *              {
 *                "oj": "uva",
 *                "url": "https://vjudge.net/problem/UVA-455#author=pangda"
 *              }
 *            ]
 *          }
 *        },
 *        ...
 *        ]
 *  }
 * */
const {ejsRenderHeadSourceUrl} = require("../utils")
module.exports = async function list_mach_by_tags(ctx,next){
  let _ids = ctx.request.query.ids|| ""
  let list_query = {}
  let ids = _ids.split(",").filter( id => id.length)
  // query is or exid in [ids]
  let articles = await bookSystem.Db.find({
    $or:[
      { _id:{$in:ids}},
      // 必需提供主_id
      //{"head.extra_id":{ $or:[$in] } }
    ]})
  //let articles = await bookSystem.Db.find({_id:{$in:ids}})

  articles.map( ({head}) =>  ejsRenderHeadSourceUrl(head,ctx.state) )
  //console.log(articles)
  let sorted_articles = Array(ids.length)
  for( let art of articles){
    let index = ids.indexOf(art._id)
    sorted_articles[index] = art
  }
  //console.log("============ sorted ================================")
  //console.log(sorted_articles)

  ctx.body = {
    message:'ok',
    //query,
    articles: sorted_articles.filter(d=>d)
  }
}
