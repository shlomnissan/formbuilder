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


		/*******************************************************/
		/*	Fields and Tabs
		/*******************************************************/


		/*
			fieldAdd
			Adding a new form field on .new-element click
		*/
		var fieldAdd = function() {

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
					'position': $('.form-element').length - 1
				};

				dust.render(tpl, data, function(err, out) {
					
					sortableElements.append(out);
					fieldSelect();

					var newElement = $('#element-'+data['position']);
					currentlySelected = newElement;
					
					currentlySelected.addClass('selected');
					tabs.showTab('#field-settings');

					bindSettings();
					repositionToolbox();
					isFieldOptions();
		    	});

			});

		}


		/*
			fieldSelect
			Show settings pan and bind fields on .form-element click
		*/
		var fieldSelect = function() {

			$('.form-element').unbind();

			// Form element clicked
			$('.form-element').click(function(){

				// Remove selected class from all elements
				clearSelectedElements();

				// Add selected class to selected element
				$(this).addClass('selected');

				// View the settings base on element type
				if( $(this).data('type') == 'form-settings' ) {
					
					tabs.showTab('#form-settings');

				} else {
					
					tabs.showTab('#field-settings');
					currentlySelected = $(this);
					bindSettings();
					repositionToolbox();
					isFieldOptions();
				}

			});
		}


		/*
			tabSelect
			Adjust form fields based on tab selection
		*/
		var tabSelect = function() {

			// Switch tabs
			$('.toolbox-tab').click(function(){

				clearSelectedElements();

				if( $(this).data('target') == '#form-settings' ) {
					$('#form-settings-element').addClass('selected');
				}

				if( $(this).data('target') == '#field-settings' ) {
					
					if(!currentlySelected){
						$('#element-0').addClass('selected');
						currentlySelected = $('#element-0');
					} else {
						currentlySelected.addClass('selected');
					}

					bindSettings();
					repositionToolbox();
				}

			});

		}


		/*******************************************************/
		/*	Bind controls
		/*******************************************************/



		/*
			bindTextFields
			Binds textfields in the settings panel to form textfields
		*/
		var bindTextFields = function() {
			// Bind controls
			$('.bind-control').each(function(){

				var target = $(this).data('bind');

				$(this).on("keyup", function() {

					if(currentlySelected == '') {
						$(target).html($(this).val());
					} else {

						if( currentlySelected.data('type') != 'element-dropdown' ) {
							currentlySelected.find(target).next('.choice-label').html($(this).val());
						} else {

							currentlySelected.find(target).html($(this).val());
						}
						
					}

				  	
				});

			});
		}


		/*
			bindButtons (checkboxes and radio buttons)
			Binds buttons from the settings pane to form elements
		*/
		var bindButtons = function () {
			$('.option').unbind();
			
			$('.option').click(function(){

				var target = $(this).parent().next('input').data('bind');
				var value = ( $(currentlySelected).data('type') != 'element-dropdown' ) ? 'checked' : 'selected';

				$(currentlySelected).find(target).prop( value, function( i, val ) {
					return !val;
				});

			});
		}


		/*
			bindSettings
			Binds settings controls to form elements (labels, required, choices, etc)
		*/
		var bindSettings = function() {	
			
			// Field Label
			$('#field-label').val(currentlySelected.data('label'));

			$('#field-label').on("keyup", function() { 

				currentlySelected.children('label').children('.label-title').html($(this).val());
				currentlySelected.data('label', $(this).val());

			});

			// Description
			if( currentlySelected.data('type') == 'element-section-break' ) {
				$('#description').val(currentlySelected.children('.description').html());
			}

			$('#description').on("keyup", function() { 

				currentlySelected.children('.description').html($(this).val());
				currentlySelected.data('description', $(this).val());

			});

			// Choices
			if(currentlySelected.data('type') == 'element-multiple-choice' || currentlySelected.data('type') == 'element-checkboxes' || currentlySelected.data('type') == 'element-dropdown') {

				$('#field-choices').css('display', 'block');
				$('#field-choices').html('<div class="form-group"><label>Choices</label></div>');

				var choices = [];

				var items = currentlySelected.children('.choices').children('.choice');

				if( currentlySelected.data('type') == 'element-dropdown' ) {
					items = currentlySelected.children('.choices').children('option');
				}

				console.log(items);

				items.each(function(i){

					if( currentlySelected.data('type') != 'element-dropdown' ) {

						// Radio buttons, checkboxes

						var checked = $(this).children('label').children('input').is(':checked') ? true : false;
						var bindingClass = $(this).children('label').children('input').attr('class');
						var title = $(this).children('label').children('.choice-label').html();

					} else {

						// Dropdown

						var title = $(this).val();
						var bindingClass = $(this).attr('class');
						var checked = $(this).is(':selected') ? true : false;

					}

					

					var data = {
						'checked':checked,
						'title': title,
						'position': i+1,
						'bindingClass': bindingClass,
					};

					choices.push(data);

				});

				var data = {
					"choices":choices
				}

				console.log(data);

				// Render the choices

				dust.render(currentlySelected.children('.choices').data('type'), data, function(err, out) {
						
					$('#field-choices').append(out);
					bindTextFields();
					bindButtons();
					controlMultipleChoice();

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

		}



		/*******************************************************/
		/*	Controls
		/*******************************************************/



		/*
			controlSettings
			Attach settings control (Remove Field, Add Field)
		*/
		var controlSettings = function() {

			// Remove field
			$('#control-remove-field').click(function(){
				
				if( currentlySelected != '' ) {
					
					if( $('.form-element').length > 2 ) {
						currentlySelected.remove();
						reorderElements();
						tabs.showTab('#add-field');
						
						clearSelectedElements();
					} else {
						alert('Unable to delete this field! You must have at least 1 field in your form.');
					}
	
				}

			});

			$('#control-add-field').click(function(){
				tabs.showTab('#add-field');
				
				clearSelectedElements();
			});	

		}


		/*
			controlMutlipleChoice
			Attach multiple choice controls (remove choice, ddd choice)
		*/
		var controlMultipleChoice = function() {
			
			// Remove choice
			$('.remove-choice').unbind();
			$('.remove-choice').click(function(){

				if( $(this).parent().parent().children('.choice').length > 1 ) {
					
					// Delete choice from form
					var deleteItem = $(this).data('delete');

					if($(currentlySelected).data('type') == 'element-dropdown') {
						$(currentlySelected).find(deleteItem).remove();
					} else {
						$(currentlySelected).find(deleteItem).parent().parent().remove();
					}

					// Delete choice from settings
					$(this).parent().remove();

					// Bind new fields
					bindTextFields();
					controlMultipleChoice();
				}

			});

			// Add Choice
			$('.add-choice').unbind();
			$('.add-choice').click(function(){
				
				// Get the choice count
				var lastChoice = 2;

				// Dropdown
				if( currentlySelected.data('type') == 'element-dropdown' ) {
					var items = currentlySelected.children('.choices').children('option');
				} else {
					var items = currentlySelected.children('.choices').children('.choice');
				}

				console.log(items);

				$(items).each(function(i){

					if( currentlySelected.data('type') == 'element-dropdown' ) {
						var choiceString = $(this).attr('class');
					} else {
						var choiceString = $(this).find('input').attr('class');
					}

					
					var choiceSplit = choiceString.split('-');
					if( lastChoice < choiceSplit[1] ) {
						lastChoice = choiceSplit[1];
					}

				});

				lastChoice++;
				
				var choice = {
					'bindingClass':'option-'+lastChoice,
					'title':'Untitled'
				};

				var data = {
					"choices": choice
				}
				
				// Render a new choice in settings
				dust.render(currentlySelected.children('.choices').data('type'), data, function(err, out) {
					
					$('#field-choices').append(out);

					// Set template based on type
					if( currentlySelected.data('type') == 'element-multiple-choice' ) {
						template = 'choice-radio';
					}

					if( currentlySelected.data('type') == 'element-checkboxes' ) {
						template = 'choice-checkbox';
					}

					if( currentlySelected.data('type') == 'element-dropdown') {
						template = 'choice-dropdown';
					}


					var elementId = currentlySelected.attr('id').replace('element-','');

					// Load template
					data = {
						'title': 'Untitled',
						'value': 'untitled',
						'lastChoice': lastChoice,
						'elementId': elementId
					}

					console.log(data);

					dust.render(template, data, function(err, out) {
						currentlySelected.children('.choices').append(out);
					});

					// Bind new fields
					bindTextFields();
					bindButtons();
					controlMultipleChoice();


				});

			});

		}



		/*******************************************************/
		/*	Helpers
		/*******************************************************/

		var isFieldOptions = function() {
			if( currentlySelected.data('type') == 'element-section-break' ) {
				$('#field-options').hide();
				$('#field-description').show();
			} else {
				$('#field-options').show();
				$('#field-description').hide();
			}
		}

		/*
			repositionToolbox
			Change the position of the toolbox based on active selection
		*/
		var repositionToolbox = function() {
			topOffset = currentlySelected.position().top;
			toolboxOffset = 115;
			offset = topOffset - toolboxOffset;
			$('#field-settings').css('margin-top', offset + 'px');
			$('.left-col').css('height','100%');
		}


		/*
			clearSelectedElements
			Remove currently selected element
		*/
		var clearSelectedElements = function() {

			// Remove selected class from all elements
			$('.form-element').each(function(){
				$(this).removeClass('selected');
			});

		}

		/*
			reorderElements
			Update element id based on position
		*/
		var reorderElements = function() {

			$('#sortable-elements').sortable({
				stop: function(){
					reorderElements();
				}
			});

			$('#sortable-elements li').each(function(i){
				$(this).attr( 'id', 'element-'+ i );
			});

			fieldSelect();
		}


		/*
			serialize
			Serialize form elements into a JSON string
		*/
		var serialize = function() {
			
			var formData = {};
			
			formData['title'] 		= $('#form-title').val();
			formData['description'] = $('#form-description').val();

		
			formData['fields'] = Array();

			$('#sortable-elements li').each(function(i){

				var element = {
					'title': $(this).data('label'),
					'type': $(this).data('type'),
					'required': $(this).hasClass('required') ? true : false,
					'position': i+1,
					'description': $(this).data('description')
				}

				// If element has multiple choices
				if( element['type'] == 'element-multiple-choice' || element['type'] == 'element-checkboxes' ||  element['type'] == 'element-dropdown' ) {

					var choices = [];

					if( element['type'] == 'element-dropdown') {

						// Collect choices for dropdown
						$(this).find('.choices').children('option').each(function(index){

							var choice = {
								'title': $(this).val(),
								'value': $(this).val(),
								'checked': $(this).is(':selected') ? true : false,
							}

							choices.push(choice);
							element['choices'] = choices;

						});

					} else {

						// Collect choices for radio/checkboxes
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

				}

				formData['fields'].push(element);
			});
			

			var serialized = JSON.stringify(formData);

			// Process the form data here...
			return serialized;

		}


		/*******************************************************/
		/*	Entry Point
		/*******************************************************/

		// Globl vars
		var currentlySelected = '';
		var tabs = '';


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
		
		var base = {};

		//
		var obj = this;

		dust.render('formbuilder-base', base, function(err, out) {
			obj.append(out);
		});

		// Get data
		$.getJSON( settings.load_url, function( data ) {
			
			// Load the base template
			base = {
				form: data,
				fieldSettings: false,
				formSettings: false
			};

			// Render the form
			dust.render('formbuilder-fields', base, function(err, out) {
				

				$('.loading').fadeOut(function(){
					$('#form-col').html(out);
					$('#form-elements').fadeIn();

					$('#form-title').val(base['form']['title']);
					$('#form-description').val(base['form']['description']);

					fieldAdd();
					fieldSelect();
					tabSelect();

					bindTextFields();
					controlSettings();
					reorderElements();

					tabs = $('.nav-tabs').tabs();

					$('#save').click(function(e){
						
						var form_data = serialize();

						$.ajax({
							
							type: "POST",
							url: settings.save_url,
							data: {formData: form_data},
							
							success: function () { 
								settings.onSaveForm.call();
							}

						});

					});

				});

		    });

		});

		///

	} // End plugin

}(jQuery));
