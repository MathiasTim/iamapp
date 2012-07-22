<?php 

    ////////////////////////////////////////////////////////////////////////
    // Connect to the database
    ////////////////////////////////////////////////////////////////////////	

	define ('DB_HOST', 'localhost');
	define ('DB_USER', 'iamapp');
	define ('DB_PASSWORD', 'I@M12d1.');
	define ('DB_NAME', 'iamapp_drupal');    
    
    $databaseConnection = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD) or die ( "<br />Sorry: It wasn´t possible to connect to the database.<br />");
   	mysql_select_db(DB_NAME, $databaseConnection); 
?>