<?php
/**
 * Created by PhpStorm.
 * User: Luecu
 * Date: 31.05.2016
 * Time: 15:46
 */

/** database connection constants */
const connectionString = "mysql:host=localhost;dbname=friendfinder";
const user = "root";
const pwd = "";

/**
 * Class DatabaseHelper helps to create a connection to the database by creating a new PDF object
 */
class DatabaseHelper {

    /**
     * @return PDO object with the database connection
     */
    public function getDBConnection() {
        try {
            return new PDO(connectionString, user, pwd);
        } catch (PDOException $e) {
            exit('Keine Verbindung: Grund - ' . $e->getMessage());
        }
    }
}