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
        if(obj.allSelect){
            app.executeMenuCommand("selectallinartboard");
        }
        try {  
            app.doScript(obj.action,obj.set);  
        }  
        catch (e) {  
            return false;
        }  

        if(obj.save){
            saveAIdata();
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
}
