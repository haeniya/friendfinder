<?php

require "../helpers/database.php";

/**
 * Created by PhpStorm.
 * User: Luecu
 * Date: 17.05.2016
 * Time: 15:46
 */
class PositionRepository
{

    var $db;

    function __construct()
    {
        $dbHelper = new DatabaseHelper();
        $this->db = $dbHelper->getDBConnection();
    }
    function __destruct() {
        $this->db = null;
    }


}