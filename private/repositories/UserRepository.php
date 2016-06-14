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

    function getAllUsers(){
        $selection = $this->db->prepare('SELECT * FROM users');
    }

    function getFriends($userid){
        $selection = $this->db->prepare('Select username, id from users where id IN (Select user2_id from relationships where user1_id = ? and friends = 1) OR id IN (Select user1_id from relationships where user2_id = ? and friends = 1)');
        $selection->bindValue(1, $userid);
        $selection->bindValue(2, $userid);
        $selection->execute();

        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        $selection->closeCursor();
        echo json_encode($results);
    }

    function getFriendRequests($userid){
        $selection = $this->db->prepare('Select username, id from users where id IN (Select user1_id from relationships where user2_id = ? and friends = 0)');
        $selection->bindValue(1, $userid);
        $selection->execute();

        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        $selection->closeCursor();
        echo json_encode($results);
    }

    function acceptFriendRequest($friendID, $userID){
        $selection = $this->db->prepare('UPDATE relationships SET friends = 1 where user1_id= ? and user2_id= ?');
        $selection->bindValue(2, $friendID);
        $selection->bindValue(1, $userID);
        $selection->execute();
        $selection->closeCursor();
        $resultArray = array('acceptedfriendrequest' => true);
        return json_encode($resultArray);
        return $resultArray;
    }

    function declineFriendRequest($friendID, $userID){
        $selection = $this->db->prepare('DELETE FROM relationships where user1_id= ? and user2_id= ?');
        $selection->bindValue(2, $friendID);
        $selection->bindValue(1, $userID);
        $selection->execute();
        $selection->closeCursor();
        $resultArray = array('deletedfriendrequest' => true);
        return json_encode($resultArray);
        return $resultArray;
    }

    function getUsers($prefix) {

        $selection = $this->db->prepare('SELECT username,id FROM users where username like ?');
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

    function getFriendsPosition(){
        //$sql = 'SELECT * FROM users u LEFT JOIN positions p ON (u.id = p.user_id) WHERE u.id IN (SELECT user2_id FROM relationships WHERE user1_id = '. $_SESSION['userid'] .' OR user2_id = '. $_SESSION['userid'] .')';
        $sql = 'SELECT * FROM users u LEFT JOIN positions p ON (u.id = p.user_id) WHERE u.id IN (SELECT user2_id FROM relationships WHERE user1_id = '. $_SESSION['userid'] .' and friends = 1) OR u.id IN(SELECT user1_id FROM relationships WHERE user2_id = '. $_SESSION['userid'] .' and friends = 1)';

        $statement = $this->db->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    function register($data) {
        $selection = $this->db->prepare('INSERT INTO users (firstname, lastname, username, password, email) VALUES (:firstname, :lastname, :username, :password, :email)');
        $selection->bindParam(':firstname', $data['firstname']);
        $selection->bindParam(':lastname', $data['lastname']);
        $selection->bindParam(':username', $data['username']);
        $selection->bindParam(':password', sha1($data['password']));
        $selection->bindParam(':email', $data['email']);
        $selection->execute();
        $selection->closeCursor();

        $resultArray = array('registerstatus' => true);
        return json_encode($resultArray);
    }

    function deleteFriend($friendID){
        $sql =  $this->db->prepare('DELETE FROM relationships where user1_id = ? AND user2_id = '.$_SESSION['userid'].' or user2_id = ? AND user1_id = '.$_SESSION['userid'].'');
        $sql->bindValue(1, $friendID);
        $sql->bindValue(2, $friendID);
        $sql->execute();
        $resultArray = array('deletestatus' => true);
        return json_encode($resultArray);
        return $resultArray;
    }

    function sendFriendRequest($userID, $friendID){
        $selection = $this->db->prepare('INSERT INTO relationships (user1_id, user2_id, friends) VALUES (:user1_id, :user2_id, 0)');
        $selection->bindParam(':user1_id', $userID);
        $selection->bindParam(':user2_id', $friendID);
        $selection->execute();
        $selection->closeCursor();

        $resultArray = array('sendFriendRequest' => true);
        return json_encode($resultArray);
    }
}

/* Tests
 *
 * $userRepo = new UserRepository();
 * $userRepo->getAllUsers();
 */

