(function(){
    var docs = getAlldocs();
    for(var j=0;j<docs.length;j++){
        app.activeDocument = docs[j];
        app.undo();
    }
    function getAlldocs(){
        var docs = [];
        for(var i=0;i<app.documents.length;i++){
            docs[i] = app.documents[i];
        }
        return docs;
    }
})();