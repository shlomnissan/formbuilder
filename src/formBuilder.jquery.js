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
					$('#element-1').addClass('selected');
					currentlySelected = $('#element-1');
					bindSettings();
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
						currentlySelected.find(target).next('.choice-label').html($(this).val());
					}

				  	
				});

			});
		}


		/*
			bindRadioButtons
			Binds radio buttons form the settings pane to form elements
		*/
		var bindRadioButtons = function () {
			$('.radio-option').unbind();
			$('.radio-option').click(function(){
				var target = $(this).parent().next('input').data('bind');
				$(currentlySelected).find(target).prop("checked", true);
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

			// Choices
			if(currentlySelected.data('type') == 'element-multiple-choice') {


				$('#field-choices').css('display', 'block');
				$('#field-choices').html('<div class="form-group"><label>Choices</label></div>');

				var choices = [];

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

					choices.push(data);

				});

				var data = {
					"choices":choices
				}

				// Render the choices

				dust.render(currentlySelected.children('.choices').data('type'), data, function(err, out) {
						
					$('#field-choices').append(out);
					bindTextFields();
					bindRadioButtons();
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

			// Reposition settings pan here...

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
						currentlySelected = '';
						clearSelectedElements();
					} else {
						alert('Unable to delete this field! You must have at least 1 field in your form.');
					}
	
				}

			});

			$('#control-add-field').click(function(){
				tabs.showTab('#add-field');
				currentlySelected = '';
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
					$(currentlySelected).find(deleteItem).parent().parent().remove();

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

				$(currentlySelected.children('.choices').children('.choice')).each(function(i){

					var choiceString = $(this).find('input').attr('class');
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
					bindTextFields();
					bindRadioButtons();


				});

			});

		}



		/*******************************************************/
		/*	Helpers
		/*******************************************************/

		
		/*
			clearSelectedElements
			Remove currently selected element
		*/
		var clearSelectedElements = function() {

			// Remove selected class from all elements
			currentlySelected = '';
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
					'position': i+1
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
		
		// Get data
		$.getJSON( settings.load_url, function( data ) {
			
			// Load the base template
			var base = {
				form: data,
				fieldSettings: false,
				formSettings: false
			};

			// Render the form
			dust.render('formbuilder', base, function(err, out) {
				

				$('#wf-form-builder').append(out);

				fieldAdd();
				fieldSelect();
				tabSelect();

				bindTextFields();
				controlSettings();
				reorderElements();

				tabs = $('.nav-tabs').tabs();

				$('#save').click(function(){
					serialize();
				});

		    });

		});

		///

	} // End plugin

}(jQuery));
