<?php

/**
 * Created by PhpStorm.
 * User: Luecu
 * Date: 17.05.2016
 * Time: 15:46
 */
class UserRepository
{

    var $db;

    function __construct(DatabaseHelper $databaseHelper)
    {
        $this->db = $databaseHelper->getDBConnection();
    }
    function __destruct() {
        $this->db = null;
    }

    function getAllUsers() {

        $selection = $this->db->prepare('SELECT * FROM users');
        $selection->execute();

        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        $selection->closeCursor();
        echo json_encode($results);
    }

    function checkLogin($credentials){
        //TODO: überprüfe Login
        $selection = $this->db->prepare('SELECT * FROM users where username = ? and password = ?');
        $selection->bindValue(1, $credentials['username']);
        $selection->bindValue(2, $credentials['password']);
        $selection->execute();
        $results = $selection->fetchAll(PDO::FETCH_ASSOC);

        $selection->closeCursor();
        $count=count($results);
        $resultArray = array('loginstatus' => false);
        if($count==1) {
            session_start();
            $_SESSION["username"] = $credentials['username'];
            $resultArray['loginstatus'] = true;
            return json_encode($resultArray);
        }
        else {
            return json_encode($resultArray);
        }
    }
}

/* Tests
 *
 * $userRepo = new UserRepository();
 * $userRepo->getAllUsers();
 */

