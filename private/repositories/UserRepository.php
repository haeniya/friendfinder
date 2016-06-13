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
        return "1";
    }
}

/* Tests
 *
 * $userRepo = new UserRepository();
 * $userRepo->getAllUsers();
 */

