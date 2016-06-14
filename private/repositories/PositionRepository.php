<?php
/**
 * This Repository handles all queries for the database table Position.
 *
 * Created by PhpStorm.
 * User: Luecu
 * Date: 17.05.2016
 * Time: 15:46
 */
class PositionRepository
{
    /**
     * @var PDO
     */
    public $db;

    /**
     * PositionRepository constructor.
     * @param DatabaseHelper $databaseHelper which opens the connection to our database
     */
    function __construct(DatabaseHelper $databaseHelper)
    {
        $this->db = $databaseHelper->getDBConnection();
    }

    /**
     * release connection to database when the object will be destroyed
     */
    function __destruct(){
        $this->db = null;
    }


    /**
     * Saves a position for the current logged in user
     *
     * @param JSON  $position   position data as json string.
     * @return int boolean value indicating the success of the request as int ( 1 = successful, 2 = failed)
     */
    function savePosition($position){
        $user_id = $_SESSION['userid'];
        $selection = $this->db->prepare('SELECT * FROM positions WHERE user_id = ' . $user_id);
        $selection->execute();
        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        if(count($results) > 0){
            //update position
            $sql = 'UPDATE positions SET `lat` = \''. $position['lat'] .'\', `lng` = \'' . $position['lng'] . '\', `timestamp` = CURRENT_TIMESTAMP WHERE user_id = '. $user_id;
            $statement = $this->db->prepare($sql);
            $statement->execute();
            return 1;
        }else{
            //insert new position
            $sql = 'INSERT INTO positions (`user_id`, `lat`, `lng`) VALUES('. $user_id .',\''. $position['lat'] .'\', \'' . $position['lng'] . '\')';
            echo($sql);
            $this->db->exec($sql);
            return 1;
        }
    }

}