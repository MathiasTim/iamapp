<?php

/**
 * DatabaseRequest 
 *    handle the database request
 * 
 */

class DatabaseRequest {
    
    ////////////////////
    // PROPERTIES
    ////////////////////
    private $arrayEntireData = '';    

    
    ////////////////////
    // CONSTRUCTOR
    ////////////////////
    public function __construct($query){            
        
        $this->arrayEntireData = $this->getEntireData($query);

    }    
    
        
    ////////////////////
    // HELPER FUNCTION
    ////////////////////
    private function getEntireData($query){
               
          $array = array(); 
          
          $result = mysql_query($query);                 
        
          while($row = mysql_fetch_assoc($result)){                            
               array_push($array, $row);                               
          }
                
          return $array;   
        
    }   


    ////////////////////
    // GETTER
    ////////////////////
    
    /**
     * get formatted JSON-string
     *  - IMPORTANT!! json-string-format MUST be correct 
     *    to use in backbone
     * */
     public function getFormattedJSON($case){
        
        // variables
        $i = 0;
        $count = count($this->arrayEntireData);
        
        // first token
        $jsonString = '[';
        
            
        switch ($case) {
            
            // HOME
            ////////////////////////////////////////////////
            case 'home':
                
                for($i; $i<$count; $i++){                            
                    
                    $jsonString .= '{';
                    $jsonString .= '"site" : "' . $this->arrayEntireData[$i]['type'] . '",';
                    $jsonString .= '"description" : "' . $this->arrayEntireData[$i]['filename'] . '"';
                    $jsonString .= '}';       
                    
                    // no comma at the end 
                    if($count-1 != $i){
                        $jsonString .= ',';       
                    }
                
                }
                break;
            
            // LAPTOP
            ////////////////////////////////////////////////
            case 'laptop':
                
                break;
                
        }
        
        // last token
        $jsonString .= ']';
        
        // print formatted JSONstring
        print $jsonString;
        
     }
     
 
    /**
     * print entire array
     * */
    public function getEntireArrayPrinted(){
        
        echo '<pre>';
         print_r($this->arrayEntireData);
        echo '</pre>';
        
    }
     
     
     


    
}
