<?php
    ////////////////////////////////////////////////////////////////////////
    // Fight against Hacks 
    ////////////////////////////////////////////////////////////////////////
    
	/** 
	 * Fight against XSS (CrossSiteScription) 
	 * URL POST/GET
	 * */
	function fightXSS($value){		
		$value = htmlspecialchars($value);		
		return $value; 			
	}

	/** 
	 * Fight against SQLinjection 
	 * Masks SQL Statements
	 * */
	function fightSQLinjection($value){		
		$value = mysql_escape_string($value);		
		return $value;		
	}

?>