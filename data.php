<html>
    
    <body style="background-color: #94b8b8">
        
    <?php
    /** Todo: Connect to database */
    $configSettings = parse_ini_file("coursedb.ini", false, INI_SCANNER_RAW);
    //phpinfo();

    $Link = pg_connect("host=" . $configSettings['host'] . " " .
                       "dbname=" . $configSettings['dbname'] . " " . 
                       "user=" . $configSettings['user'] . " " .
                       "password=" . $configSettings['password']);

    $data = json_decode(file_get_contents("php://input"));

    $request = $data->request;

    $recipe_id = $data->recipe_id;
    $title_recipe = $data->title_recipe;
    $ingredients = $data->ingredients;
    $steps = $data->steps;
    $photo = $data->photo;
    $source_link = $data->source_link;


    $username = $data->username;
    $password = $data->password;

    
    
    $Query = "SELECT * from recipes
        WHERE recipe_id = '$recipe_id'";

    if(!($Result = pg_query($Link, $Query))) {
    print("Failed: " . pg_last_error($Link));
    //}else if (is_null($Result)){
     //   print ("Recipe already exists in recipe table");
    }else{
        $Query = "INSERT INTO recipes (api_id, title_recipe, ingredients, steps, photo, source_link)
    VALUES ('$recipe_id', '$title_recipe', '$ingredients', '$steps', '$photo', '$source_link')";
    
    if(!($Result = pg_query($Link, $Query))) {
        print("Failed: " . pg_last_error($Link));
    }else{
        print("Succeeded: New Recipe added = ". pg_result_status($Result));
    }
}
        
/*
    $Query = "SELECT * from favorites
    WHERE api_id = '$recipe_id' and user_id = 1";

    if(!($Result = pg_query($Link, $Query))) {
        print("Failed: " . pg_last_error($Link));
    //}else if (is_null($Result)){
        
       //print ("Recipe already exists in favorites table");
    }else{
        $Query = "INSERT INTO favorites (recipe_id, api_id, user_id, user_ingredients, user_steps, folder_name, version_id, v_id)
        Select recipe_id, '$recipe_id', 1, '$ingredients', '$steps', 'fav_folder', 1, 'version 1' from recipes where api_id = '$recipe_id'"; 
    
    if(!($Result = pg_query($Link, $Query))) {
        print("Failed: " . pg_last_error($Link));
    }else{
        print("Succeeded: New Favorite added = ". pg_result_status($Result));
    } 
    }

    */
    
    
    if(!($Result = pg_query($Link, $Query))) {
        print("Failed: " . pg_last_error($Link));
    }else{
        print("Succeeded: New Lines added = ". pg_result_status($Result));
    }

    
    /** Todo: Close the database */
    pg_close($Link);
?>
    </body>     
</html>