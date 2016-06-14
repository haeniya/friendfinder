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
        $user_id = $_SESSION['userid'];
        $selection = $this->db->prepare('SELECT * FROM positions WHERE user_id = ' . $user_id);
        $selection->execute();
        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        if(count($results) > 0){
            //update position
            $sql = 'UPDATE positions SET `lat` = \''. $position['lat'] .'\', `lng` = \'' . $position['lng'] . '\', WHERE user_id = '. $user_id;
            var_dump($sql);
            $statement = $this->db->prepare($sql);
            $statement->execute();
            return 1;
        }else{
            //insert new position
            $sql = 'INSERT INTO positions (`user_id`, `lat`, `lng`, `timestamp`) VALUES('. $user_id .',\''. $position['lat'] .'\', \'' . $position['lng'] . '\')';
            var_dump($sql);
            $this->db->exec($sql);
            return 1;
        }

    }


}