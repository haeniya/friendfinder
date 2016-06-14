<?php
/**
 * Created by PhpStorm.
 * User: Luecu
 * Date: 31.05.2016
 * Time: 15:46
 */

const connectionString = "mysql:host=localhost;dbname=friendfinder";
const user = "friendfinder";
const pwd = "ScdOmuPj";

class DatabaseHelper {

    public function getDBConnection() {
        try {
            return new PDO(connectionString, user, pwd);
        } catch (PDOException $e) {
            exit('Keine Verbindung: Grund - ' . $e->getMessage());
        }
    }
}