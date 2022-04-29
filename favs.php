       
<?php


    /** Todo: Connect to database */
    $configSettings = parse_ini_file("coursedb.ini", false, INI_SCANNER_RAW);
    //phpinfo();

    $Link = pg_connect("host=" . $configSettings['host'] . " " .
                       "dbname=" . $configSettings['dbname'] . " " . 
                       "user=" . $configSettings['user'] . " " .
                       "password=" . $configSettings['password']);

    //$data = json_decode(file_get_contents("php://input"));
    
    
    $Query = "SELECT * from recipes";

    if(!($Result = pg_query($Link, $Query))) {
    print("Failed: " . pg_last_error($Link));
    //}else if (is_null($Result)){
     //   print ("Recipe already exists in recipe table");
    }else{
    
        $var = 1;
        while($row =pg_fetch_row($Result)) {
            // output data of each row
            if($var == 0){
                echo ", ";
            }else{
                $var = 0;
            }
            
              echo "title: (" . $row[1]. "), ingredients: (" . $row[2]. "), steps: (" . $row[3]. "), image: (" . $row[4]. "), source_link: (" . $row[5]. "), api_id: (" . $row[6].")";
            }

            
          
    }

    
    
    /** Todo: Close the database */
    pg_close($Link);

?>
    