<?php

/* formbuilder */
/* Copyright (c) 2014 (v3.0) Shlomi Nissan, 1ByteBeta (http://www.1bytebeta.com) */
/* Simple script that stores the form data in a session for demo purposes */

session_start();

$form_data = isset($_POST['formData']) ? $_POST['formData'] : FALSE;

if( !$form_data ) {
	throw new Exception("Error Processing Request", 1);
}

$_SESSION['form_data'] = $form_data;