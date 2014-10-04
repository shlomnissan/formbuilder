/**
 * jQuery form builder
 * Copyright (c) 2014 (v3.0) Shlomi Nissan, 1ByteBeta (http://www.1bytebeta.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function($) {
	
	$.fn.formBuilder = function(options) {
		
		// Set default settings
		var settings = $.extend({
			load_url: '/',
			save_url: '/'
        }, options);

		// Globl vars
		var currentlySelected = '';

		// Auto load templates
		dust.onLoad = function(name, callback) {
		  $.ajax('src/templates/' + name + '.tpl', {
		    success: function(data) {
		      callback(undefined, data);
		    },
		    error: function(jqXHR, textStatus, errorThrown) {
		      callback(textStatus, undefined);
		    }
		  });

		};

		// Load the base template
		var base = {
			fields: true,
			fieldSettings: false,
			formSettings: false
		};

		dust.render('formbuilder', base, function(err, out) {
		
			$('#wf-form-builder').append(out);

			// Get data
			$.getJSON( settings.load_url, function( data ) {
			 loadForm(data);
			});

			addField();
			bindFields();	
			highlightTab();
			settingsControls();
			tabs();

			$('#save').click(function(){
				serialize();
			});

	    });

		

		// Clear selected status
		var clearSelectedElements = function() {

			// Remove selected class from all elements
			currentlySelected = '';
			$('.form-element').each(function(){
				$(this).removeClass('selected');
			});

		}

		var attachSettings = function() {	
			// Field Label


			$('#field-label').val(currentlySelected.data('label'));
			$('#field-label').on("keyup", function() { 

				currentlySelected.children('label').children('.label-title').html($(this).val());
				currentlySelected.data('label', $(this).val());

			});

			// Choices
			if(currentlySelected.data('type') == 'element-multiple-choice') {


				$('#field-choices').css('display', 'block');
				$('#field-choices').html('<div class="form-group"><label>Choices</label></div>');

				currentlySelected.children('.choices').children('.radio').each(function(i){

					var checked = $(this).children('label').children('input').is(':checked') ? true : false;
					var bindingClass = $(this).children('label').children('input').attr('class');
					var title = $(this).children('label').children('.choice-label').html();

					var data = {
						'checked':checked,
						'title': title,
						'position': i+1,
						'bindingClass': bindingClass,
					};

					dust.render(currentlySelected.children('.choices').data('type'), data, function(err, out) {
						
						$('#field-choices').append(out);
						bindFields();
						bindMultipleChoiceControls();
						bindSettingsRadio();

				    });



				});

			} else {
				$('#field-choices').css('display', 'none');
			}

			// Required
			if( currentlySelected.hasClass('required') ) {
				$('#required').prop("checked", true);
			} else {
				$('#required').prop("checked", false);
			}

			$('#required').unbind();
			$('#required').change(function(){

				currentlySelected.toggleClass('required');

				var data = {};
				if(this.checked) {

					dust.render('required', data, function(err, out) {

						currentlySelected.children('label').append(out);

				    });

				} else {
					currentlySelected.children('label').children('.required-star').remove();
				}

			});

			// Reposition settings pan here...

		}

		// Highlight the default element based on tab selection
		var highlightTab = function() {

			// Switch tabs
			$('.toolbox-tab').click(function(){

				clearSelectedElements();

				if( $(this).data('target') == '#form-settings' ) {
					$('#form-settings-element').addClass('selected');
				}

				if( $(this).data('target') == '#field-settings' ) {
					$('#element-1').addClass('selected');
					currentlySelected = $('#element-1');
					attachSettings();
				}

			});

		}

		// Bind toolbox textfield to actual textfields
		var bindFields = function() {
			// Bind controls
			$('.bind-control').each(function(){

				var target = $(this).data('bind');

				$(this).on("keyup", function() {

					if(currentlySelected == '') {
						$(target).html($(this).val());
					} else {
						currentlySelected.find(target).next('.choice-label').html($(this).val());
					}

				  	
				});

			});
		}

		// Update elements ID according to position
		var reorderElements = function() {
			$('#sortable-elements li').each(function(i){
				$(this).attr( 'id', 'element-'+ (i+1) );
			});
			fieldSettings();
		}

		// Add a new field
		var addField = function() {

			// Bind new field buttons
			$('.new-element').click(function(){

				clearSelectedElements();

				var sortableElements = $('#sortable-elements');
				sortableElements.sortable({
					stop: function(){
						reorderElements();
					}
				});

				var tpl = $(this).data('type');

				var data = {
					'label': 'Untitled',
					'position': $('.form-element').length
				};

				dust.render(tpl, data, function(err, out) {
					sortableElements.append(out);
					fieldSettings();

					var newElement = $('#element-'+data['position']);
					currentlySelected = newElement;
					
					currentlySelected.addClass('selected');
					showTab('#field-settings');

					attachSettings();

		    	});

			});

		}

		// Show field settings
		var fieldSettings = function() {

			$('.form-element').unbind();

			// Form element clicked
			$('.form-element').click(function(){

				// Remove selected class from all elements
				clearSelectedElements();

				// Add selected class to selected element
				$(this).addClass('selected');

				// View the settings base on element type
				if( $(this).data('type') == 'form-settings' ) {
					
					showTab('#form-settings');

				} else {
					
					showTab('#field-settings');
					currentlySelected = $(this);
					attachSettings();

				}

			});
		}

		// Settings controls
		var settingsControls = function() {

			// Remove field
			$('#control-remove-field').click(function(){
				
				if( currentlySelected != '' ) {
					
					if( $('.form-element').length > 2 ) {
						currentlySelected.remove();
						reorderElements();
						showTab('#add-field');
						currentlySelected = '';
						clearSelectedElements();
					} else {
						alert('Unable to delete this field! You must have at least 1 field in your form.');
					}
	
				}

			});

			$('#control-add-field').click(function(){
				showTab('#add-field');
				currentlySelected = '';
				clearSelectedElements();
			});	

		}

		// Load form from JSON
		var loadForm = function(data) {

			$('#form-title').val(data.title);
			$('#form-title-label').html(data.title);

			$('#form-description').val(data.description);
			$('#form-description-label').html(data.description);

			// Set up a base context with global helpers
			var data;
			

			$.each(data.fields, function(i, item){

				var base = dust.makeBase({
					'label': item.title,
					'position': i,
					'required': item.required,
					'choices': item.choices
				});

	           	dust.render(item.type, base, function(err, out) {

					$('#sortable-elements').append(out);
					
					var position = $('#sortable-elements').children('li').length;

					fieldSettings();
					reorderElements();

					// Remove choices
					$('#element-'+ position).children('.choices').html('');

					if(item.type == 'element-multiple-choice') {

						var choiceData;

						for( var i=0; i<item.choices.length; i++ ) {

							choiceData = {
								'title': item.choices[i].title,
								'value': item.choices[i].value,
								'checked': item.choices[i].checked,
								'lastChoice': i,
								'elementId': position,
							}

							dust.render('choice-radio', choiceData, function(err, out) {

								$('#element-'+ position).children('.choices').append(out);

							});

						}

					}

		   		});

	        });

	        $('#sortable-elements').sortable({
				stop: function(){
					reorderElements();
				}
			});

		}

		var tabs = function() {

			$('.tab-content .tab-pane').css('display', 'none');
			showActiveTab();
			
			$('.nav-tabs li').click(function(){
				hideTabs();
				$(this).addClass('active');
				showActiveTab();
			});
			
		}

		var showActiveTab = function() {

			$('.nav-tabs li').each(function(i){
				
				var pane = $(this).data('target');
				
				if( $(this).hasClass('active') ) {
					$(pane).css('display', 'block');
				} else {
					$(pane).css('display', 'none');
				}

			});
		}

		var hideTabs = function() {
			$('.nav-tabs li').each(function(){
				$(this).removeClass('active');
			});
		}

		var showTab = function(tab) {
			hideTabs();
			
			$('.nav-tabs li').each(function(){
				if( $(this).data('target') == tab) {
					$(this).addClass('active');
				}
			});

			showActiveTab();
		}

		var bindMultipleChoiceControls = function() {
			
			// Remove choice
			$('.remove-choice').unbind();
			$('.remove-choice').click(function(){

				if( $(this).parent().parent().children('.choice').length > 1 ) {
					
					// Delete choice from form
					var deleteItem = $(this).data('delete');
					$(currentlySelected).find(deleteItem).parent().parent().remove();

					// Delete choice from settings
					$(this).parent().remove();

					// Bind new fields
					bindFields();
					bindMultipleChoiceControls();
				}

			});

			// Add Choice
			$('.add-choice').unbind();
			$('.add-choice').click(function(){
				
				// Get the choice count
				var lastChoice = 2;

				$(currentlySelected.children('.choices').children('.choice')).each(function(i){

					var choiceString = $(this).find('input').attr('class');
					var choiceSplit = choiceString.split('-');
					if( lastChoice < choiceSplit[1] ) {
						lastChoice = choiceSplit[1];
					}

				});

				lastChoice++;
				
				var data = {
					'bindingClass':'option-'+lastChoice,
					'title':'Untitled'
				};
				
				// Render a new choice in settings
				dust.render(currentlySelected.children('.choices').data('type'), data, function(err, out) {
					
					$('#field-choices').append(out);

					// Set template based on type
					if( currentlySelected.data('type') == 'element-multiple-choice' ) {
						template = 'choice-radio';
					}

					var elementId = currentlySelected.attr('id').replace('element-','');

					// Load template
					data = {
						'title': 'Untitled',
						'value': 'untitled',
						'lastChoice': lastChoice,
						'elementId': elementId
					}

					dust.render(template, data, function(err, out) {
						currentlySelected.children('.choices').append(out);
					});

					// Bind new fields
					bindFields();
					bindMultipleChoiceControls();
					bindSettingsRadio();

				});

			});

		}

		var bindSettingsRadio = function () {
			$('.radio-option').unbind();
			$('.radio-option').click(function(){
				var target = $(this).parent().next('input').data('bind');
				$(currentlySelected).find(target).prop("checked", true);
			});
		}

		var serialize = function() {
			
			var formData = {};
			
			formData['title'] 		= $('#form-title').val();
			formData['description'] = $('#form-description').val();

		
			formData['fields'] = Array();

			$('#sortable-elements li').each(function(){

				var element = {
					'title': $(this).data('label'),
					'type': $(this).data('type'),
					'required': $(this).hasClass('required') ? true : false,
				}

				// If element has multiple choices
				if( element['type'] == 'element-multiple-choice' ) {

					var choices = [];

					$(this).find('.choices').children('.choice').each(function(index){

						var choice = {
							'title': $(this).children('label').children('.choice-label').html(),
							'value': $(this).children('label').children('.choice-label').html(),
							'checked': $(this).children('label').children('input').is(':checked') ? true : false,
						}

						choices.push(choice);
						element['choices'] = choices;

					});


				}

				formData['fields'].push(element);
			});
			

			var serialized = JSON.stringify(formData);

			// Process the form data here...
			alert(serialized);

		}

	}

}(jQuery));
