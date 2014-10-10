formbuilder
===========

Wufoo style jQuery and HTML5 form builder

Demo: http://1bytebeta.com/projects/formbuilder/

Create:
$('#formBuilder').formBuilder({
  load_url: '/src/json/example.json'
});  


Translate:
$('#formBuilder').formBuilder({
  load_url: '/src/json/example.json',
  locale:'/src/i18n/pt-br.json'
});    

Change the title:
$('#formBuilder').formBuilder({
  load_url: '/src/json/example.json',
  title_form: text_area
});    


Get the serialized data form and do what you want:
var form_serialized = $('#formBuilder').formBuilderSerialized();