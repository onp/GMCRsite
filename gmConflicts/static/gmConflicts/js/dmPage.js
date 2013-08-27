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
    
    function OptionObj(conflict,optionData){
        if (typeof optionData === "undefined"){
            optionData = {name:	"new option",
                          image:    iconList.icons[0],  
                          reversible: "Reversible"};
        };
        var _conf = conflict;
        var _opt = this;
        this.name = optionData.name;
        this.image = optionData.image;
        this.reversible = optionData.reversible;
        this.views = [];
        
        this.toJSON = function(){
            return {"name":this.name,"image":this.image,"reversible":this.reversible}
        }
        
        this.updateViews = function(){
            $.each(this.views,function(i){
                this.find('.rev').val(_opt.reversible);
                this.find('.optName').val(_opt.name);
                this.children('.icon').attr("src","/static/gmConflicts/images/option_icons/" + _opt.image);
            });
        };
        
        this.renderOption = function(){
            $newView = $(optMaker(_opt));
            $newView.find('.rev').val(this.reversible).change(function(){
                _opt.reversible = $(this).val();
                _opt.updateViews();
            });
            $newView.find('.optName').change(function(){
                _opt.name = $(this).val();
                _opt.updateViews();
            });
            $newView.children('.icon').change(function(){
                _opt.image = $(this).attr("src")
                                   .match(/images\/option\_icons\/([.\w]+)/)[1];
                _opt.updateViews();
            });
            this.views.push($newView);
            return $newView
        }
    }
    
    function DMObj(conflict,dmData){
        if (typeof dmData === "undefined"){
            dmData = {name:	"new Decision maker",
                      options: []};
        };
        var _conf = conflict;
        var _dm = this;
        this.name = dmData.name;
        this.options = $.map(dmData.options,function(opt){
            return _conf.options[opt]
        });
        
        this.renderDM = function(){
            $dm = $(dmMaker(this));
            $dm.find("input.dmName").change(function(){
                _dm.name = $(this).val();
            });
            $.each(this.options,function(){
                $dm.find(".dmOptions").append(this.renderOption());
                $dm.find(".addOpt").appendTo($dm.find(".dmOptions"));
            });
            
            $dm.find("li.addOpt").on("click",function(){		//activate "add Option" button
                newOpt = _conf.newOption();
                _dm.options.push(newOpt);
                $(this).before(newOpt.renderOption());
            });
            
            return $dm;
        };
        
        this.toJSON = function(){
            return {"name":this.name,
                    "options":$.map(_dm.options,function(opt){return opt.index})
            };
        };
    
    
    }
    
    function ConflictObj(conflict){
        var _conf = this
        this.options = $.map(conflict.options,function(opt){
            return new OptionObj(_conf,opt);
        });
         
        this.decisionMakers = $.map(conflict.decisionMakers,function(dm){
            return new DMObj(_conf,dm);
        });
        
        this.title = conflict.title;
        $("input.confName").change(function(){
            _conf.title = $(this).val();
        });
        this.description = conflict.description;
        $("textarea.confDesc").change(function(){
            _conf.description = $(this).val();
        });
        
        this.renderDMlist = function(){
            $dmList = $(dmListMaker(_conf));
            $.each(this.decisionMakers,function(){
                $dmList.append(this.renderDM());
            });
            $dmList.find("li.addDM").appendTo($dmList)
                    .on("click",function(){		        //activate "add DM" button
                        newDM = _conf.newDecisionMaker()
                        $(this).before(newDM.renderDM());
                        $("ul.dmOptions").sortable({connectWith: "ul.dmOptions",
                                            items:"> li:not(.addOpt)"});	
                    });
            return $dmList;
        };
        
        this.renderOptionList = function(){
            $optionList = $("<div class='optBank'>");
            $.each(this.options,function(){
                $optionList.append(this.renderOption());
            });
            return $optionList;
        };
            
        this.newOption = function(){
            var newOpt = new OptionObj(_conf);
            $("div.optBank").append(newOpt.renderOption())
            this.options.push(newOpt);
            return newOpt;
        }
        
        this.newDecisionMaker = function(){
            var newDM = new DMObj(_conf);
            this.decisionMakers.push(newDM);
            return newDM;
        }
         
        this.toJSON = function(){
            $.each(_conf.options,function(i){this.index = i;});

            return {"options":this.options,"decisionMakers":this.decisionMakers,
                    "title":this.title,"description":this.description};
        }
    
    };
    
    var conflict = new ConflictObj(conflictData);
      
    $("div.dmList").append(conflict.renderDMlist());    //insert the conflict into the page
    $("div.optList").append(conflict.renderOptionList());
    $("ul.dmOptions").sortable({connectWith: "ul.dmOptions",
                                items:"> li:not(.addOpt)"});		
    $("ul.dmList").sortable({connectWith: "ul.dmList",
                             items:"> form:not(.addDM)"});		//make lists sortable
    
	
							 
	$("div.dmList").on("sortreceive","ul.dmOptions",function(){
		$(this).find("li.addOpt").appendTo(this);});			//keep "add Option" at end of list
	
	$("div.dmList").on("click","img.cornerX",function(){		//activate "remove" x's
        $(this).parent().trigger("remove").remove();
	});
	
	var $iconPicker = $(Mustache.render(templates.iconChooserTemplate,iconList));
	$iconPicker.mouseleave(function(){$iconPicker.detach()});
	$iconPicker.find("img.iconPicker").click(function(){
		var newSrc = $(this).attr("src");
		$iconPicker.parent().find("img.icon").attr("src",newSrc).change();
		$iconPicker.detach();
	});
	$("div.dmList").on("click","img.icon",function(){
		$(this).after($iconPicker)
	});
    
    var packConflict = function(conf){
        packed = {};
        packed.confTitle = conf.title;
        packed.confDescription = conf.description;
        packed.conf = JSON.stringify(conf);
        return packed;
    };

    $('#saveButton').click(function(){
        console.log(packConflict(conflict));
        $.post("", packConflict(conflict))
            .done(function(data){
                if (data != "Ajax_save_success."){
                    window.history.replaceState({'blah':'blah'},'a title',data);
                };
                console.log(data);
                })
            .fail(function(data){
                console.log("failed");
                var win=window.open('about:blank');
                with(win.document)
                {
                  open();
                  write(data.responseText);
                  close();
                };
            });
    });
};