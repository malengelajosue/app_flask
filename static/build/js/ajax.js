$(document).ready(function(){
    var dataZone_timeline=$('#dataZone_timeline');
    var aside_home_btn,
    aside_map_btn,
    aside_sites_btn,
    aside_control_btn,
    aside_settings_btn,
    containt_zone,
    timeline_txt_search;
    
    aside_home_btn=$('#aside_home_btn');
    aside_sites_btn=$('#aside_sites_btn');
    aside_map_btn=$('#aside_map_btn');
    aside_control_btn=$('#aside_control_btn');
    aside_settings_btn=$('#aside_settings_btn');
    containt_zone=$('#containt_zone');
    timeline_txt_search=$('#timeline_txt_search');
    
    function getMessage(){
     
        var url="/getdata_timeline";
        $.get(url,function(data){
           
            dataZone_timeline.html(data);
        });
    }
    function getMessage(){
      
       
        var url="/getdata_timeline";
        $.get(url,function(data){
           
            dataZone_timeline.html(data);
        });
    }
    function getHomePage(){
  
       
        var url="/home";
        $.get(url,function(data){
           
            containt_zone.html(data);
        });
    }
    function getMapPage(){
      
      
        var url="/map";
        $.get(url,function(data){
           
            containt_zone.html(data);
        });
    }
    function getControlPage(){

       
        var url="/control";
        $.get(url,function(data){
           
            containt_zone.html(data);
        });
    }
    function getSitePage(param){
 
      
        var url="/sites/"+param;
        $.get(url,function(data){
           
            containt_zone.html(data);
        });
    }
   
      function getSettingsPage(){
  

        var url="/settings";
        $.get(url,function(data){
           
            containt_zone.html(data);
        });
    }
   

    setTimeout(getMessage,1);
    
    aside_home_btn.click(function(){
        
        getHomePage();
    });
    aside_sites_btn.click(function(){
       var p="";
        getSitePage("%%");
    });
    aside_control_btn.click(function(){
        
        getControlPage();
    });
    aside_map_btn.click(function(){
        
        getMapPage();
    });
    aside_settings_btn.click(function(){
        
        getSettingsPage();
       
    });
    
    
});
