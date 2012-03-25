jQuery.pooptimeout=function(callback, timeout, param){ 
	var args = new Array();
	args.push(param);
	var _cb = function() {
		callback.apply(null, args)
	};
	return setTimeout(_cb, timeout);
};
(function($) { 
	$.fn.jspop = function(setting) {
		// 初始化配置 
		var opts = $.extend( {}, $.fn.jspop.defaults, setting); 
		var u = $(this).attr('href'); 
		var key =  opts.filterfunction(u) ; 
		var filter = $(this).attr(opts.filter); 
		if (  key =='' || filter == 'notpopup') { 
			return
		}   
		var hideDelayTimer = null;
		var showDelayTimer = null;
		var beingShown = false;
		var shown = false;
		$(this).mouseover(
						function() {
							if (hideDelayTimer)clearTimeout(hideDelayTimer);
							if (showDelayTimer)clearTimeout(showDelayTimer);
							var obj = {'obj1' : $(this),'key' : key};
							showDelayTimer = $.pooptimeout(
									function() {
										 var tt = obj.obj1;
										var key = obj.key; 
										showDelayTimer = null;
										if (beingShown || shown) {
											return
										} else {
											beingShown = true;
											position = tt.offset().top- $(window).scrollTop();
											xposition = $(window).width()- (tt.offset().left - $(window).scrollLeft());
											var popup = $('#' + opts.idpre + key);
											if (popup.length == 0) {
												$('body').append('<div id="' + opts.idpre + key + '"><div class="popuptc"><div class="point"></div><div class="popuptc_wai_up start">'+opts.loadingmsg+'</div></div></div>');
												var url = opts.ajaxurl;
												var keyvar = opts.key;
												$.post(url,{keyvar:key},function(data){ 
													var html = opts.createhtml(data) ;
													var toptemp = parseInt($('#' +opts.idpre  + key).css('top').replace('px',''));  
													var toptemp2 =  $('#' +opts.idpre  + key).height();
													$(".popuptc_wai_up",$('#' +opts.idpre + key).get(0)).html(html).attr('className','popuptc_wai_up');
													if (position > opts.yjheight&& xposition < opts.yjwidth) { 
														$('#' +opts.idpre  + key).css({top : toptemp- $('#' +opts.idpre  + key).height()+ toptemp2});
														$('.point',$('#' +opts.idpre  + key).get(0)).css('top',info.height() - 11)
													} else if (position <= opts.yjheight&& xposition < opts.yjwidth) { 
													} else if (position > opts.yjheight&& xposition > opts.yjwidth) { 
														$('#' +opts.idpre  + key).css({top : toptemp- $('#' +opts.idpre  + key).height()+ toptemp2});
														$('.point',$('#' +opts.idpre  + key).get(0)).css('top',info.height() - 11);
													} 
												}); 
											}
											var info = $('#' + opts.idpre + key);
											info.unbind('mouseover').mouseover(
													function() {
														tt.mouseover()
													}).unbind('mouseout')
													.mouseout(function() {
														tt.mouseout()
													});
											if (position > opts.yjheight&& xposition < opts.yjwidth) {
												info.attr('className',opts.mainclass+' rs');
												var top = tt.offset().top;
												var img = $('img', tt.get(0));
												if (img.length > 0) {
													top = img.offset().top
												} 
												info.css( {
													top : top - info.height(),
													left : tt.offset().left - info.width() + tt.width(),
													display : 'block',
													opacity : 1
												});
												$('.point', info.get(0)).css(
														'top',
														info.height() - 11)
											} else if (position <= opts.yjheight && xposition < opts.yjwidth) {
												info.attr('className',
														opts.mainclass+' rx');
												var top = tt.offset().top + 14;
												var img = $('img', tt.get(0));
												if (img.length > 0) { top = img.offset().top + img.height()} 
												info.css( {
													top : top,
													left : tt.offset().left - info.width() + tt.width(),
													display : 'block',
													opacity : 1
												});
												$('.point', info.get(0)).css( 'top', 2)
											} else if (position >  opts.yjheight && xposition >  opts.yjwidth) {
												info.attr('className', opts.mainclass+' ls');
												var top = tt.offset().top;
												var img = $('img', tt.get(0));
												if (img.length > 0) {
													top = img.offset().top
												}
												;
												info.css( {
													top : top - info.height(),
													left : tt.offset().left,
													display : 'block',
													opacity : 1
												});
												$('.point', info.get(0)).css(
														'top',
														info.height() - 11)
											} else {
												info.attr('className',
														opts.mainclass+' lx');
												var top = tt.offset().top + 14;
												var img = $('img', tt.get(0));
												if (img.length > 0) {
													top = img.offset().top
															+ img.height()
												}
												;
												info.css( {
													top : top,
													left : tt.offset().left,
													display : 'block',
													opacity : 1
												});
												$('.point', info.get(0)).css(
														'top', 2)
											}
									}
									 
											beingShown = false;
											shown = true; 
									}, opts.hideDelay, obj);
							return false
						}).mouseout(function() {
					if (hideDelayTimer)
						clearTimeout(hideDelayTimer);
					if (showDelayTimer)
						clearTimeout(showDelayTimer);
					hideDelayTimer = $.pooptimeout(function() {
						hideDelayTimer = null;
						shown = false;
						$("."+opts.mainclass).css('display', 'none')
					}, opts.hideDelay); 
					return false; }); 
	}
	$.fn.jspop.defaults = {
		// 过滤弹窗字段 当该字段为notpopup时不做弹出 如:<a href="/u/@" filter="notpopup"></a>
		filter:'filter',
		// 返回可以作为弹窗关键子的字段
		filterfunction:function(url){
			key = url.replace(/\/u\/@/g,"");
			return key;
		},
		// 500毫秒以内仍然在才触发弹出
		hideDelay:500,
		// 填充数据的url
		ajaxurl:'',
		// 弹窗关键字
		key:'key',
		// 弹窗ID前缀，确保唯一
		idpre:'jspopup_',
		// 弹窗class，确保唯一
		mainclass:'jspopup',
		//预计高度,用来判断弹出的上下方位
		loadingmsg:'loadding....',
		yjwidth:360,
		//预计宽度,用来判断弹出的左右方位
		yjheight:60,
		//写在弹出框内的方法，xml为ajaxurl返回的数据
		createhtml:function(xml){return "<br><br>"+xml+"<br><br>";}
		
	};
		
})(jQuery);
