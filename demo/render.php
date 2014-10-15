<?php

/* formbuilder */
/* Copyright (c) 2014 (v3.0) Shlomi Nissan, 1ByteBeta (http://www.1bytebeta.com) */
/* Simple script that loads the form data from a session and uses the php loader to render it */

require '../loaders/php/formLoader.php';

session_start();

$form_data = isset($_SESSION['form_data']) ? $_SESSION['form_data'] : FALSE;
unset($_SESSION['form_data']);

if( !$form_data ) {
	header( 'Location: /' ) ;
}


