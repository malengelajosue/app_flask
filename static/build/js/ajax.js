$(document).ready(function(){
    var dataZone_timeline=$('#dataZone_timeline');
    var aside_home_btn,aside_sites_btn,containt_zone,timeline_txt_search;
    aside_home_btn=$('#aside_home_btn');
    aside_sites_btn=$('#aside_sites_btn');
    containt_zone=$('#containt_zone');
    timeline_txt_search=$('#timeline_txt_search');
    
    function getMessage(){
        var img;
     var img="<img src="+"{{ url_for('static', filename='img/loading.gif') }}" +"style='margin-left: auto;margin-right: auto; display: block'>";
        dataZone_timeline.html(img);
        var url="/getdata_timeline";
        $.get(url,function(data){
           
            dataZone_timeline.html(data);
        });
    }
    function getHomePage(){
        var img;
     var img="<img src="+"{{ url_for('static', filename='img/loading.gif') }}" +"style='margin-left: auto;margin-right: auto; display: block'>";
        containt_zone.html(img);
        var url="/home";
        $.get(url,function(data){
           
            containt_zone.html(data);
        });
    }
    function getSitePage(param){
        var img;
       
     var img="<img src="+"{{ url_for('static', filename='img/loading.gif') }}" +"style='margin-left: auto;margin-right: auto; display: block'>";
        containt_zone.html(img);
        var url="/sites/"+param;
        $.get(url,function(data){
           
            containt_zone.html(data);
        });
    }
 
    
    timeline_txt_search.keyup(function(){
        var param;
        
        param=$(this).val();
        alert(param);
        getSitePage(param);
    });
    setTimeout(getMessage,1);
    
    aside_home_btn.click(function(){
        
        getHomePage();
    });
    aside_sites_btn.click(function(){
       var p="";
        getSitePage("GC");
    });
    
});
