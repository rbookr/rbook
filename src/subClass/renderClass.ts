import ejs from 'ejs'
import pathFn from 'path'
import fs from 'fs'
const md = require("../../../markdown-r")
//md.options.pangu = true
class RenderClass {
    parent:bookSystem
    constructor(parent:bookSystem){
        this.parent = parent
    }

    ejsRender(path:string,data:{} = {}){
        return new Promise( (res,rej)=>{
            ejs.renderFile(path, data,{},(err,str)=>{
                if(err)
                    rej(err)
                else
                    res(str)
            })
        })
    }


    render(path:string,data:{} = {},template=false){
        let filePath = path
        if( ! pathFn.isAbsolute(filePath))
            filePath = pathFn.join(this.parent.localRespository,filePath)

        let at_repo_filePath = "/"+pathFn.relative(this.parent.localRespository,pathFn.dirname(filePath))

        return this.ejsRender(path,data).then( (str)=>{
            //@ts-ignore
          let content = template ?  this.parent.Scan.splitTemplate(str) : this.parent.Scan.splitStr(str).content ;
            //@ts-ignore
            //content = article_id,在文章内得到 id,根据path得到id this.Url.path_2_url(at_repo_filePath.slice(1))
            //@ts-ignore
            content = content.replace(/@@@([^@^\n]+)@@@/g,($0,$1)=>{
                let article_path = $1
                if(!pathFn.isAbsolute($1)) article_path = pathFn.join(pathFn.dirname(filePath),article_path);
                //@ts-ignore
                return '/'+this.parent.Url.path_2_url(pathFn.relative(this.parent.localRespository,article_path))
            })
            return this.imagePath_translate(
                //@ts-ignore
                md.render(content), 
                at_repo_filePath
            )
        }).then( (str)=>{
            return this.linkPath_translate( str,at_repo_filePath)
        })
    }

    /* 转换imagepath */
    imagePath_translate(html:string,path:string){
        let cur_path = path || '/'

        if(cur_path.charAt(cur_path.length-1) !== '/') //最后一个字符
            cur_path += '/'

        let image_reg = /<img src="([\S\s]+?)"/g

        return html.replace(image_reg,function($1,$2){
            let rep_str = ""
            if($2.substring(0,2)=='./'){
                rep_str = cur_path + $2.slice(2)
            }
            else if($2.substring(0,3)=='/./')
                $2 = $2.slice(1)
            else if($2.substring(0,7) == "http://" || $2.substring(0,8) == "https://")
                rep_str =$2
            else if($2.charAt(0) === '/'){
                rep_str =$2
            }
            else
                rep_str = cur_path + $2

            return `<img src="${rep_str}"`
        })
    }

    /** 转换 a.href */
    linkPath_translate(html:string,path:string){
        let cur_path = path || '/'

        if(cur_path.charAt(cur_path.length-1) !== '/') //最后一个字符
            cur_path += '/'

        let link_reg = /<a href="([\S\s]+?)"/g

        return html.replace(link_reg,function($1,$2){
            let rep_str = ""

            if($2.substring(0,2)=='./'){
                rep_str = cur_path + $2.slice(2)
            }
            else if($2.substring(0,3)=='/./')
                $2 = $2.slice(1)
            else if($2[0] === '#' || $2.substring(0,7) == "http://" || $2.substring(0,8) == "https://")
                rep_str =$2
            else if($2.charAt(0) === '/'){
                rep_str =$2
            }
            else
                rep_str = cur_path + $2

            return `<a href="${rep_str}"`
        })

    }
}

export default RenderClass
