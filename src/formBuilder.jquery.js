/**
 * jQuery form builder
 * Copyright (c) 2014 (v3.0) Shlomi Nissan, 1ByteBeta (http://www.1bytebeta.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function($) {
	var serialize = function (){};

	$.fn.formBuilderSerialized = function() {
		return serialize();
	}
	
	$.fn.formBuilder = function(options) {
		
		// Set default settings
		var settings = $.extend({
			load_url: '/',
			save_url: '/',
			callback: function() {},
			locale:'default',
			title_form:''
        }, options);


		/*******************************************************/
		/*	Fields and Tabs
		/*******************************************************/

		var fields_id = {
			elementsinglelinetext: 1,
			elementnumber:2,
			elementparagraphtext:3,
			elementmultiplechoice: 4,
			elementcheckboxes: 5
		}

		/*
			fieldAdd
			Adding a new form field on .new-element click
		*/
		var fieldAdd = function() {

			// Bind new field buttons
			$('.new-element').click(function(event){
				event.preventDefault();

				clearSelectedElements();

				var sortableElements = $('#sortable-elements');
				sortableElements.sortable({
					stop: function(){
						reorderElements();
					}
				});

				var tpl 	   =  $(this).data('type');
				var cod_fields =  $(this).data('type').replace(/-/g, "");

				var data = {
					'id':fields_id[cod_fields],
					'label': localize_i18n.untitled,
					'position': $('.form-element').length - 1, 
					'localize_i18n': localize_i18n
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
			$('.form-element').click(function(event){
				event.preventDefault();

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
			$('.toolbox-tab').click(function(event){
				event.preventDefault();

				clearSelectedElements();

				if( $(this).data('target') == '#form-settings' ) {
					$('#form-settings-element').addClass('selected');
				}

				if( $(this).data('target') == '#field-settings' ) {
					$('#element-0').addClass('selected');
					currentlySelected = $('#element-0');
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
			bindButtons (checkboxes and radio buttons)
			Binds buttons from the settings pane to form elements
		*/
		var bindButtons = function () {
			$('.option').unbind();
			$('.option').click(function(event){
				event.preventDefault();
				var target = $(this).parent().next('input').data('bind');
				$(currentlySelected).find(target).prop( "checked", function( i, val ) {
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

			// Choices
			if(currentlySelected.data('type') == 'element-multiple-choice' || currentlySelected.data('type') == 'element-checkboxes') {


				$('#field-choices').css('display', 'block');
				$('#field-choices').html('<div class="form-group"><label>'+localize_i18n.field_options.choices+'</label></div>');

				var choices = [];

				currentlySelected.children('.choices').children('.choice').each(function(i){

					var checked = $(this).children('label').children('input').is(':checked') ? true : false;
					var bindingClass = $(this).children('label').children('input').attr('class');
					var title = $(this).children('label').children('.choice-label').html();

					var data = {
						'checked':checked,
						'title': title,
						'position': i+1,
						'bindingClass': bindingClass
					};

					choices.push(data);

				});

				var data = {
					"choices":choices,
					'localize_i18n': localize_i18n
				}

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
			$('#control-remove-field').click(function(event){
				event.preventDefault();
				
				if( currentlySelected != '' ) {
					
					if( $('.form-element').length > 2 ) {
						currentlySelected.remove();
						reorderElements();
						tabs.showTab('#add-field');
						currentlySelected = '';
						clearSelectedElements();
					} else {
						alert(localize_i18n.remove_error);
					}
	
				}

			});

			$('#control-add-field').click(function(event){
				event.preventDefault();
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
			$('.remove-choice').click(function(event){
				event.preventDefault();

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
			$('.add-choice').click(function(event){
				event.preventDefault();
				
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
					'title': localize_i18n.untitled
				};

				var data = {
					"choices": choice,
					'localize_i18n': localize_i18n
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


					var elementId = currentlySelected.attr('id').replace('element-','');

					// Load template
					data = {
						'title': localize_i18n.untitled,
						'value': localize_i18n.untitled,
						'lastChoice': lastChoice,
						'elementId': elementId
					}

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
		serialize = function() {
			
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
				if( element['type'] == 'element-multiple-choice' || element['type'] == 'element-checkboxes'  ) {

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
			

			// Process the form data here...
			return formData
		}

		var save = function(serialized) {};

		/*******************************************************/
		/*	Entry Point
		/*******************************************************/


		// Global vars
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

		// Define default messages
		var localize_i18n = {
			formName:         "My form",
			description_form: "Please, fill it out.",
			untitled:         "Untitled",
			tabs: {
				addfield:       "Add Field",
				settings:       "Field Settings",
				form:           "Form Settings"
			},        
			fields: {       
				text:           "Text",
				number:         "Number",
				paragraph:      "Paragraph",
				dropdown:       "Dropdown",
				chebox:         "Checkbox"
			}, 
			field_options: {     
				title:          "Title",
				label:          "Field label",
				choices:        "Choices",
				options:        "Options",
				required:       "Required",
				description:    "Description"
			},     
			placeholders: {     
				first:          "First",
				second:         "Second",
				third:          "Third",
			},   
			buttons: {     
				save:           "Save form",
				remove:         "Remove",
				add:            "Add Field"
			},       
		}   

		// Load locale
		if (settings.locale != "default"){
			$.ajax({
			 url: settings.locale,
			 dataType: 'json',
			 async: false,
			 success: function( data ) {
			   localize_i18n = data;
			 },
			 error: function( data ) {
			   alert("File not found or json localize is wrong!")
			 }
			});
		}

    	var base = {
			localize_i18n: localize_i18n
		};

		dust.render('formbuilder-base', base, function(err, out) {
			$('#wf-form-builder').append(out);
		});

		// Get data
		$.getJSON( settings.load_url, function( data ) {
			

			//Changes de default title
			if (settings.title != ''){
				data['title'] = settings.title_form; 
			}

			// Load the base template
			base = {
				form: data,
				fieldSettings: false,
				formSettings: false,
				localize_i18n: localize_i18n
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

					$('#save').click(function(event){
						event.preventDefault();
						serialize();
					});

				});

		    });

		});

		///

	} // End plugin Formbuilder


}(jQuery));