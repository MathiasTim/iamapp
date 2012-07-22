<?php

    /**
     * Info:
     *    - change the switch-case-statement below
     *    - otherwise you have to change the getFormattedJSON-function (DatabaseRequest.php)
     *      to get an formatted json-string for the use in backbone
     *
     */

    /////////////////////////////////////////////////////////////////////////////
    // Load config-files & connect to the database
    /////////////////////////////////////////////////////////////////////////////        
    include (__DIR__.'/config/iamapp.ini.php');
    include (__DIR__.'/config/iamapp.db.php');

 
    /////////////////////////////////////////////////////////////////////////////
    // AUTOLOADER
    /////////////////////////////////////////////////////////////////////////////
    function __autoload($class_name) {
            require_once $class_name.'.php';
    }
    
    
    /////////////////////////////////////////////////////////////////////////////
    // Handle
    /////////////////////////////////////////////////////////////////////////////    
    try{
        
        // GET
        $getRequest = fightSQLinjection($_GET['q']);
        
        
        // 
        switch ($getRequest) {
            
            // HOME
            ////////////////////////////////////////////////   
            case 'home':                                
                  $data = new DatabaseRequest("
                            SELECT *
                            FROM file_managed                            
                          ");
                  
                  $data->getFormattedJSON('home'); // 'home', it´s for the swich-case (DatabaseRequest.php)
                  
                  // test: print entire array to see what
                  //       keys & values are available
                  // $data->getEntireArrayPrinted();            
                  break;  
            
            // LAPTOP
            ////////////////////////////////////////////////                                   
            case 'laptop':
                
                 break;
            
            // DEFAULT
            ////////////////////////////////////////////////                        
            default:
                 throw new Exception('sorry, no case matched.');
                 break;
        }
        
    } catch(Exception $e){
        echo $e->getMessage();
    }
   


