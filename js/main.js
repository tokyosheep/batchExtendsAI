window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();
    
    const filePath = csInterface.getSystemPath(SystemPath.EXTENSION) +`/js/`;
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    const actionFolder =  csInterface.getSystemPath(SystemPath.EXTENSION) +`/actions`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    const json_path = `${extensionRoot}colorData.json`;
    
    const fs = require("fs");
    const path = require("path");
    
    
    const set = document.getElementById("set");
    const action = document.getElementById("action");
    const batch = document.getElementById("batch");
    const allClose = document.getElementById("allClose");
    const reload = document.getElementById("reload");
    const scriptList = document.getElementById("scriptList");
    const loadScripts = document.getElementById("loadScripts");
    const save = document.getElementById("save");
    const ScriptMode = document.getElementById("ScriptMode");
    
    ScriptMode.addEventListener("click",()=>{
        const HideScript = Array.from(document.getElementsByClassName("HideScript"));
        const flag = ScriptMode.dataset.flag;
        console.log(flag);
        let visible;
        if(flag === "none"){
            visible = "block";
        }else{
            visible = "none";
        }
        HideScript.forEach(v=>{
            v.style.display = visible;
        });
        ScriptMode.dataset.flag = visible;
    });
    
    class DisabedFlag{
        constructor(btn,elm){
            this.btn = btn;
            this.elm = Array.from(elm);
            this.btn.addEventListener("click",this);
        }
        
        handleEvent(){
            console.log(this.elm);
            this.elm.forEach(v=>{
                console.log(v.disabled);
                v.disabled = !this.btn.checked;
            });
        }
    }
    
    const saveFormats = new DisabedFlag(save,document.getElementsByClassName("saveFormats"));
    
    class SortScripts{
        constructor(btn){
            this.btn = btn;
            this.btn.addEventListener("click",this);
        }
        
        async handleEvent(){
            const json = await getScript();
            removeChildren(scriptList);
            scriptList.size = json.length;
            json.forEach(v=>{
                const option = document.createElement("option");
                option.value = v;
                option.textContent = path.basename(v,path.extname(v));//ファイルネーム（拡張子抜き）
                scriptList.appendChild(option);
            });
        }
        
    }
    
    const sc = new SortScripts(loadScripts);
    sc.handleEvent();
    
    function getScript(){
        return new Promise(resolve=>{
            csInterface.evalScript(`$.evalFile("${extensionRoot}getScripts.jsx")`,(o)=>{
                const json = JSON.parse(o);
                console.log(json);
                resolve(json);
            });
        })
    }
    
    allClose.addEventListener("click",()=>{
        csInterface.evalScript(`$.evalFile("${extensionRoot}allClose.jsx")`);
    });
    
    class BatchProcess{
        constructor(){
            batch.addEventListener("click",this);
        }
        
        async handleEvent(){
            const obj = {
                set:set[set.selectedIndex].value,
                action:action[action.selectedIndex].value,
                script:scriptList[scriptList.selectedIndex].value
            }
            const options = Array.from(document.getElementsByClassName("options"));
            options.forEach(v=>{
                obj[v.id] = v.checked;
            });
            Array.from(document.getElementsByClassName("method")).forEach(v=>{
                obj[v.id] = v.checked;
            })
            obj.allOpened = true;//開いた画像全てに処理一択
            console.log(obj);
            //writeJson(obj);//デバッグ用json書き出し
            csInterface.evalScript(`batchProcess(${JSON.stringify(obj)})`);
        }
    }
    
    const bc = new BatchProcess();
    
    class ConstructAction{
        constructor(){
            set.addEventListener("change",this);
        }
        
        async handleEvent(){
            const index = set.selectedIndex;
            removeChildren(action);
            this.actionList = await getActionFromJsx();
            this.writeActionList(index);
        }
        
        async loadAction(){
            this.actionList = await getActionFromJsx();
            console.log(this.actionList);
            this.writeSetList();
            this.writeActionList(0);
        }
        
        writeSetList(){
            [set,action].forEach(v=>{
                removeChildren(v);
            });
            
            this.actionList.forEach((v,i)=>{
                    const option = document.createElement("option");
                    option.value = v.name;
                    option.textContent = v.name;
                    set.appendChild(option);
            })
        }
        
        writeActionList(index){
            this.actionList[index].actions.forEach((v,i)=>{
                    const option = document.createElement("option");
                    option.value = v;
                    option.textContent = v;
                    action.appendChild(option);
            });
        }
    }
    
    const ac = new ConstructAction();
    ac.loadAction();
    
    reload.addEventListener("click",()=>{
        ac.loadAction();
    });
    
    function removeChildren(parent){
        while(parent.firstChild){
            parent.removeChild(parent.firstChild);
        }
    }
    
    function fromHex(h) {
        var s = ''
        for (var i = 0; i < h.length; i+=2) {
            s += String.fromCharCode(parseInt(h.substr(i, 2), 16))
        }
        return decodeURIComponent(escape(s))
    }
    
    function writeJson(json){
        return new Promise((resolve,reject)=>{
            fs.writeFile(json_path,JSON.stringify(json,null,4),err=>{
                if(err){
                    alert(err);
                    reject(false);
                }else{
                    csInterface.evalScript(`alert("your preset is saved")`);
                }
                resolve(true);
            });
        });
    }
    
    function getActionFromJsx(){
        return new Promise(resolve=>{
            csInterface.evalScript(`$.evalFile("${extensionRoot}getAction.jsx")`,(o)=>{   
                const obj = JSON.parse(o);
                resolve(obj);    
            });
        });
    }
}
    
