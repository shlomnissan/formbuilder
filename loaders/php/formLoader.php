<?php

/* formbuilder */
/* Copyright (c) 2014 (v3.0) Shlomi Nissan, 1ByteBeta (http://www.1bytebeta.com) */
/* Form builder loader class for PHP */

class formLoader {

	/**
	 * Form structure (JSON) 
	 *
	 * @var string
	 **/
	var $form_json;

	/**
	 * Constructor
	 *
	 * @return void
	 * @access public
	 **/
	public function __construct()
	{
		error_log(print_r($_POST,true));
	}

}