<?php
/**
 * Created by PhpStorm.
 * User: Luecu
 * Date: 17.05.2016
 * Time: 15:46
 */
class UserRepository
{

    public $db;

    function __construct(DatabaseHelper $databaseHelper)
    {
        $this->db = $databaseHelper->getDBConnection();
    }

    function __destruct() {
        $this->db = null;
    }

    function getAllUsers() {
        $selection = $this->db->prepare('SELECT * FROM users');
    function getFriends($userid){
        $selection = $this->db->prepare('Select username from users where id IN (Select user2_id from relationships where user1_id = ? and friends = 1)');
        $selection->bindValue(1, $userid);
        $selection->execute();

        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        $selection->closeCursor();
        echo json_encode($results);
    }

    function getFriendRequests($userid){
        $selection = $this->db->prepare('Select username from users where id IN (Select user2_id from relationships where user1_id = ? and friends = 0)');
        $selection->bindValue(1, $userid);
        $selection->execute();

        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        $selection->closeCursor();
        echo json_encode($results);
    }

    function getUsers($prefix) {

        $selection = $this->db->prepare('SELECT * FROM users where username like ?');
        $selection->bindValue(1, $prefix.'%');
        $selection->execute();

        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        $selection->closeCursor();
        echo json_encode($results);
    }

    function checkLogin($credentials){
        $selection = $this->db->prepare('SELECT * FROM users where username = ? and password = ?');
        $selection->bindValue(1, $credentials['username']);
        $selection->bindValue(2, sha1($credentials['password']));
        $selection->execute();
        $results = $selection->fetchAll(PDO::FETCH_ASSOC);

        $selection->closeCursor();
        $count=count($results);
        $resultArray = array('loginstatus' => false);
        if($count==1) {
            $_SESSION["username"] = $credentials['username'];
            $_SESSION["userid"] = $results[0]['id'];
            $resultArray['loginstatus'] = true;
            $resultArray['userid'] = $results[0]['id'];
            return json_encode($resultArray);
        }
        else {
            return json_encode($resultArray);
        }
    }

    function getFriends(){
        $sql = 'SELECT * FROM users u LEFT JOIN positions p ON (u.id = p.user_id) WHERE u.id IN (SELECT user2_id FROM relationships WHERE user1_id = '. $_SESSION['userid'] .')';
        $statement = $this->db->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    function register($data) {
        $selection = $this->db->prepare('INSERT INTO users (firstname, lastname, username, password) VALUES (:firstname, :lastname, :username, :password)');
        $selection->bindParam(':firstname', $data['firstname']);
        $selection->bindParam(':lastname', $data['lastname']);
        $selection->bindParam(':username', $data['username']);
        $selection->bindParam(':password', sha1($data['password']));
        $selection->execute();
        $selection->closeCursor();

        $resultArray = array('registerstatus' => true);
        return json_encode($resultArray);
    }
}

/* Tests
 *
 * $userRepo = new UserRepository();
 * $userRepo->getAllUsers();
 */

