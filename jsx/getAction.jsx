(function(){
    /*
    var ac = getAllAction() ;  
    for(var k in ac){
        $.writeln(k+":"+ac[k]);
    }  
    
    getAllProp(getAllAction());
    function getAllProp(ac){
        for(var k in ac){
            $.writeln(k+":"+ac[k]);
            if(typeof ac[k] == "object"){
                getAllProp(ac[k]);
            }
        }  
    }
    */
    return JSON.stringify(getAllAction());
    function getAllAction() {  
      var res = [] ;  
      var pref = app.preferences ;  
      var path = 'plugin/Action/SavedSets/set-' ;  
        
      var currentPath, setName, actionCount, actions ;  
      for(var i = 1 ; i <= 100 ; i++) {  
        currentPath = path + i.toString() + '/' ;  
      
        // get setName  
        setName = pref.getStringPreference(currentPath + 'name') ;  
        if(!setName) {break ;}  
          
        // get actionNames  
        actions = [] ;  
        actionCount = Number(pref.getIntegerPreference(currentPath + 'actionCount')) ;  
        for(var j = 1 ; j <= actionCount ; j++) {  
          actions.push(pref.getStringPreference(currentPath + 'action-' + j.toString() + '/name')) ;  
        }  
      
        res.push({name: setName, actions: actions}) ;  
      }  
        
      return res ;  
    }  
})();