<?php

/**
 * Created by PhpStorm.
 * User: Luecu
 * Date: 17.05.2016
 * Time: 15:46
 */
class PositionRepository
{

    public $db;

    function __construct(DatabaseHelper $databaseHelper)
    {
        $this->db = $databaseHelper->getDBConnection();
    }

    function __destruct(){
        $this->db = null;
    }

    function savePosition($position){
        $currentTime = time();
        $user_id = $_SESSION['user_id'];
        $selection = $this->db->prepare('SELECT * FROM positions WHERE user_id = ' . $user_id);
        $selection->execute();
        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        if(count($results) > 0){
            //update position
            $sql = 'UPDATE positions SET lat = \''. $position['lat'] .'\', long = \'' . $position['lng'] . '\', timestamp = ' . $currentTime . ' WHERE user_id = '. $user_id;
            $statement = $this->db->prepare($sql);
            $statement->execute();
            return $statement->rowCount();
        }else{
            //insert new position
            $sql = 'INSERT INTO positions (user_id, lat, long, timestamp) VALUES('. $user_id .'\''. $position['lat'] .'\', \'' . $position['lng'] . '\', '. $currentTime .')';
            $statement = $this->db->prepare($sql);
            $statement->execute();
            return $statement->rowCount();
        }
    }


}