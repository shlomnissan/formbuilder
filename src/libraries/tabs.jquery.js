/**
 * Tabs
 * Copyright (c) 2014 (v1.0) Shlomi Nissan, 1ByteBeta (http://www.1bytebeta.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function($) {
	
	$.fn.tabs = function(options) {
		
		// Set default settings
		var settings = $.extend({
			
		}, options);

		var showActiveTab = function(tabs) {

			$(tabs).each(function(i){
				
				var pane = $(this).data('target');
				
				if( $(this).hasClass('active') ) {

					$(pane).css('display', 'block');

				} else {

					$(pane).css('display', 'none');

				}

			});
		}

		var showTab = function(tab, tabs) {

			$(tabs).each(function(){
				$(this).removeClass('active');
			});

			$(tabs).each(function(){
				if( $(this).data('target') == tab) {
					$(this).addClass('active');
				}
			});

			showActiveTab(tabs);

		}

		var tabs = $(this).children('li');

		$(tabs).each(function(i){
			
			var target = $(this).data('target');
			$(target).css('display', 'none');
			showActiveTab(tabs);

			$(this).click(function(){
				showTab(target, tabs);
			});

		});

		return {

			showTab: function(tab) {

				$(tabs).each(function(){
					$(this).removeClass('active');
				});

				$(tabs).each(function(){
					if( $(this).data('target') == tab) {
						$(this).addClass('active');
					}
				});

				$(tabs).each(function(i){
				
					var pane = $(this).data('target');
					
					if( $(this).hasClass('active') ) {

						$(pane).css('display', 'block');

					} else {

						$(pane).css('display', 'none');

					}

				});
			}

		}

	}

}(jQuery));
