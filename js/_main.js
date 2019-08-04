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
    
    class BatchProcess{
        constructor(){
            batch.addEventListener("click",this);
        }
        
        async handleEvent(){
            const obj = {
                set:set[set.selectedIndex].value,
                path:set[set.selectedIndex].dataset.path,
                action:action[action.selectedIndex].value
            }
            const options = Array.from(document.getElementsByClassName("options"));
            options.forEach(v=>{
                obj[v.id] = v.checked;
            });
            console.log(obj);
            writeJson(obj);
            //csInterface.evalScript(`batchProcess(${JSON.stringify(obj)})`);
        }
    }
    
    const bc = new BatchProcess();
    
    class GetAction{
        constructor(){
            set.addEventListener("change",this);
        }
        
        handleEvent(){
            const index = set.selectedIndex;
            removeChildren(action);
            this.actionList = this.loadAction();
            this.writeActionList(index);
        }
        
        loadAction(){
            //console.log(await getActionFromJsx());
            const actions = fs.readdirSync(actionFolder);
            this.fullPathList = actions.map(v => path.join(actionFolder,v));
            const contents = this.fullPathList.map(v=>{
                const f = fs.readFileSync(v,{encoding:"utf-8"});
                return f.split("/");
            });
            return contents.map(v => getNames(v));
            
            function getNames(array){
                const nameList = array.filter(value=>  value.substring(0,4) === "name");
                return nameList.map(value=>{
                    const n = value.match(/\w+(?=\s+\])/);
                    return fromHex(n[0]);
                });
            }
        }
        
        readActionList(){
            this.actionList = this.loadAction();
            this.writeSetList(0);
            this.writeActionList(0);
        }
        
        writeSetList(){
            [set,action].forEach(v=>{
                removeChildren(v);
            });
            
            this.actionList.forEach((v,i)=>{
                    const option = document.createElement("option");
                    option.value = v[0];
                    option.textContent = v[0];
                    option.dataset.path = this.fullPathList[i];
                    set.appendChild(option);
            })
        }
        
        writeActionList(index){
            this.actionList[index].forEach((v,i)=>{
                if(i !== 0){
                    const option = document.createElement("option");
                    option.value = v;
                    option.textContent = v;
                    action.appendChild(option);
                }
            });
        }
    }
    
    const ac = new GetAction();
    ac.readActionList();
    
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
    
