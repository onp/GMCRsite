var dmPageScript = function(){
	$("div.sidebar ul").children().hover(
		function(){
		$(this).css("background-color","darkGray")
			.children("ul").stop(true,true).show("slide", {direction:"left"}, 200)},
		function(){
		$(this).css("background-color","gray")
			.find("ul").stop(true,true).hide("slide", {direction:"left"}, 200)});
			
	var dmListMaker = Mustache.compile(templates.dmListTemplate)
	var dmMaker = Mustache.compile(templates.dmTemplate)
	var optMaker = Mustache.compile(templates.optionTemplate) 
	Mustache.compilePartial("dmTemplate",templates.dmTemplate)
	Mustache.compilePartial("optionTemplate",templates.optionTemplate)
    
	var iconList = {icons:[	"question_mark.png",
                            "briefcase.png",
							"dam.png",
							"fist.jpg",
							"handshake.png",
							"tree.png",
							"water.png",
	]};	
    
	var newOpt = {optName:	"new option",
				  image:	iconList.icons[0]  };
	
    var newDM = {
		name: "new decision maker",
		options: [	newOpt	]
	};	

    $("div.dmList").html(dmListMaker(conflict));    //insert the conflict into the page
    //fill out the options list?
    $("ul.dmOptions").sortable({connectWith: "ul.dmOptions",
                                items:"> li:not(.addOpt)"});		
    $("ul.dmList").sortable({connectWith: "ul.dmList",
                             items:"> form:not(.addDM)"});		//make lists sortable
    
	
							 
	$("div.dmList").on("sortreceive","ul.dmOptions",function(){
		$(this).find("li.addOpt").appendTo(this);});			//keep "add Option" at end of list
	
	$("div.dmList").on("click","li.addOpt",function(){		//activate "add Option" button
		$(this).before(optMaker(newOpt));
	});
	
	$("div.dmList").on("click","li.addDM",function(){		//activate "add Option" button
		$(this).before(dmMaker(newDM));
		$("ul.dmOptions").sortable({connectWith: "ul.dmOptions",
							items:"> li:not(.addOpt)"});	
	});
	
	$("div.dmList").on("click","img.cornerX",function(){		//activate "remove" x's
		$(this).parent().remove();
	});
	
	var $iconPicker = $(Mustache.render(templates.iconChooserTemplate,iconList));
	$iconPicker.mouseleave(function(){$iconPicker.detach()});
	$iconPicker.find("img.iconPicker").click(function(){
		var newSrc = $(this).attr("src");
		$iconPicker.parent().find("img.icon").attr("src",newSrc);
		$iconPicker.detach();
	});
	$("div.dmList").on("click","img.icon",function(){
		$(this).after($iconPicker)
	});
	
    var optionCollector = function(){
        var $opt = $(this);
        var option = {};
        option.optName = $opt.find('input.optName').val();
        option.rev = $opt.find('select.rev').val();
        option.image = $opt.children('img.icon').attr('src')
            .match(/images\/option\_icons\/([.\w]+)/)[1];
        return option;
    };
    
    var dmCollector = function(){
        var $dm = $(this);
        var dm = {};
        dm.name = $dm.find('input.dmName').val();
        dm.options = $dm.find('li.option').map(optionCollector).get();
        return dm;
    };
    
    var confCollector = function(){
        var conf = {};
        conf.DecisionMakers = $('form.dmForm').map(dmCollector).get()
        return conf
    }

    $('#collector').click(function(){
        console.log(JSON.stringify(confCollector(), '    '));
        var conf = JSON.stringify(confCollector(), '    ')
        $.post("", {msg:conf})
            .done(function(data){console.log(data);})
            .fail(function(){console.log("failed");});
    });
};