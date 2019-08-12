/*
obj = {
    "set": "初期設定アクション",
    "action": "不透明度60（選択範囲）",
    "save": true,
    "allSelect": true
};
batchProcess(obj);
*/
function batchProcess(obj){
    $.writeln(obj.allOpened);
    if(obj.allOpened){
    var docs = getAlldocs();
    for(var i=0;i<docs.length;i++){ 
        app.activeDocument = docs[i];
        if(!isActionExist(obj)){
            return false;
        }
    }
    }else{
        if(!isActionExist(obj)){
            return false;
        }
    }
    function getAlldocs(){
        var docs = [];
        for(var i=0;i<app.documents.length;i++){
            docs[i] = app.documents[i];
        }
        return docs;
    }

    function isActionExist(obj){
        if(obj.allUnlocked){
             unlockItems();
        }
        
        if(obj.allVisibleLayer){
            visibleLayers(activeDocument.layers);
        }
        
        if(obj.allSelect){
            app.executeMenuCommand("selectallinartboard");
        }
        try {  
            if(obj.Byaction){
                app.doScript(obj.action,obj.set);  
            }
            if(obj.Byscript){
                $.evalFile(obj.script);
            }
        }  
        catch (e) {  
            return false;
        }  

        if(obj.AiSave&&obj.save){
            saveAIdata();
        }
        if(obj.PDFSave&&obj.save){
            PDF();
        }
        return true;
    }
    function saveAIdata(){
        var savePath = new File(activeDocument.fullName);
        try{
            activeDocument.saveAs(savePath);
            return true;
        }catch(e){
            alert("the file hasn't saved yet");
            var saveFile = File.saveDialog("保存ファイルを入れてください。");
            activeDocument.saveAs(saveFile);
            return false;
        }
    }

    function PDF(){
        var savePath = new File(activeDocument.path);
        var option = new PDFSaveOptions();
        option.compatibility = PDFCompatibility.ACROBAT7;
        activeDocument.saveAs(savePath,option);
    }
    
    function unlockItems(){
        layerUnlock(activeDocument.layers);
        var p = activeDocument.pageItems;
        for(var i=0;i < p.length;i++){
            try{
            }catch(e){
                p[i].locked = false;
            }
        }
        function layerUnlock(lay){
            for(var i=0;i<lay.length;i++){
                lay[i].locked = false;
                $.writeln(lay[i].layers.length);
                if(lay[i].layers.length > 0){
                    layerUnlock(lay[i].layers);
                }
            }
        }
    }
    
    function visibleLayers(lay){
        for(var i=0;i<lay.length;i++){
            lay[i].visible = true;
            
            if(lay[i].layers.length > 0){
                visibleLayers(lay[i].layers);
            }
            
        }
    }
}
