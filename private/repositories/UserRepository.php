<?php
/**
 * Handles all queries to the database table User.
 *
 * Created by PhpStorm.
 * User: Luecu
 * Date: 17.05.2016
 * Time: 15:46
 */
class UserRepository
{

    /**
     * @var PDO
     */
    public $db;

    /**
     * UserRepository constructor.
     * @param DatabaseHelper $databaseHelper which opens the connection to our database
     */
    function __construct(DatabaseHelper $databaseHelper)
    {
        $this->db = $databaseHelper->getDBConnection();
    }

    /**
     * release connection to database when the object will be destroyed
     */
    function __destruct() {
        $this->db = null;
    }

    /**
     * Find all friends for the given in user. Prints out the result as json string.
     *
     * @param   int    $userid   user to search friends for
     */
    function getFriends($userid){
        $selection = $this->db->prepare('Select username, id from users where id IN (Select user2_id from relationships where user1_id = ? and friends = 1) OR id IN (Select user1_id from relationships where user2_id = ? and friends = 1)');
        $selection->bindValue(1, $userid);
        $selection->bindValue(2, $userid);
        $selection->execute();

        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        $selection->closeCursor();
        echo json_encode($results);
    }

    /**
     * Find all open friend request for the given user. Returns only the friendrequest the given user has received not the request he has send.
     * Print out the result as json string.
     * @param   int  $userid     User to search friend requests for
     */
    function getFriendRequests($userid){
        $selection = $this->db->prepare('Select username, id from users where id IN (Select user1_id from relationships where user2_id = ? and friends = 0)');
        $selection->bindValue(1, $userid);
        $selection->execute();

        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        $selection->closeCursor();
        echo json_encode($results);
    }


    /**
     * Find all awaiting friend request for the given user. Return only the friend requests the user has send and not have been answered yet.
     * Print out the result as json string
     * @param   int  $userid     User to search awaiting friend requests for
     */
    function getAwaitingFriendRequests($userid){
        $selection = $this->db->prepare('Select username, id from users where id IN (Select user2_id from relationships where user1_id = ? and friends = 0)');
        $selection->bindValue(1, $userid);
        $selection->execute();

        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        $selection->closeCursor();
        echo json_encode($results);
    }

    /**
     * Accept a open friend request. A friend can only be removed if there is an entry in the Relationship table for the two given user ID's.
     *
     * @param int $friendID
     * @param int $userID
     * @return JSONString a json object with the result of the request. 'acceptedfriendrequest' => true|false
     */
    function acceptFriendRequest($friendID, $userID){
        $selection = $this->db->prepare('UPDATE relationships SET friends = 1 where user1_id= ? and user2_id= ?');
        $selection->bindValue(2, $friendID);
        $selection->bindValue(1, $userID);
        $selection->execute();
        $selection->closeCursor();
        $resultArray = array('acceptedfriendrequest' => true);
        return json_encode($resultArray);
    }

    /**
     * Decline a open friend request. A friend can only be removed if there is an entry in the Relationship table for the two given user ID's
     *
     * @param int   $userID
     * @param int   $friendID
     * @return JSONString a json object with the result of the request. 'deletedfriendrequest' => true|false
     */
    function declineFriendRequest($friendID, $userID){
        $selection = $this->db->prepare('DELETE FROM relationships where user1_id= ? and user2_id= ?');
        $selection->bindValue(2, $friendID);
        $selection->bindValue(1, $userID);
        $selection->execute();
        $selection->closeCursor();
        $resultArray = array('deletedfriendrequest' => true);
        return json_encode($resultArray);
    }

    /**
     * Get users which contain the given prefix in the username.
     * print the result as json string
     *
     * @param String $prefix
     * @param int $userID
     */
    function getUsers($prefix, $userID) {
        $selection = $this->db->prepare('Select username, id from users where username like ? AND id NOT IN (Select user2_id from relationships where user1_id = ?) AND id NOT IN (Select user1_id from relationships where user2_id = ?) and id != '.$userID.'');

        //$selection = $this->db->prepare('SELECT username,id FROM users where username like ? and id != '.$userID.'');
        $selection->bindValue(1, $prefix.'%');
        $selection->bindValue(2, $userID);
        $selection->bindValue(3, $userID);
        $selection->execute();

        $results = $selection->fetchAll(PDO::FETCH_ASSOC);
        $selection->closeCursor();
        echo json_encode($results);
    }

    /**
     * Proof if the given credentials are valid and if the user table contains an entry with this username / password pair.
     * If the credentails are valid. The userId and username is set to the Session
     *
     * @param JSONString $credentials credentials which contains username and password
     * @return JsonString json string with loginstatus => true|false and userid => [userId]
     */
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

    /**
     * Get positions of all friends from the currently logged in user
     * @return array with all friends including position information
     */
    function getFriendsPosition(){
        //$sql = 'SELECT * FROM users u LEFT JOIN positions p ON (u.id = p.user_id) WHERE u.id IN (SELECT user2_id FROM relationships WHERE user1_id = '. $_SESSION['userid'] .' OR user2_id = '. $_SESSION['userid'] .')';
        $sql = 'SELECT * FROM users u LEFT JOIN positions p ON (u.id = p.user_id) WHERE u.id IN (SELECT user2_id FROM relationships WHERE user1_id = '. $_SESSION['userid'] .' and friends = 1) OR u.id IN(SELECT user1_id FROM relationships WHERE user2_id = '. $_SESSION['userid'] .' and friends = 1)';

        $statement = $this->db->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Register a new user
     *
     * @param JSONString $data contains all necessary information to register a new user
     * @return JSONString a json object with the result of the request. 'registerstatus' => true|false
     */
    function register($data) {
        $selection = $this->db->prepare('INSERT INTO users (firstname, lastname, username, livingplace, password, email) VALUES (:firstname, :lastname, :username, :livingplace, :password, :email)');
        $selection->bindParam(':firstname', $data['firstname']);
        $selection->bindParam(':lastname', $data['lastname']);
        $selection->bindParam(':username', $data['username']);
        $selection->bindParam(':livingplace', $data['livingplace']);
        $selection->bindParam(':password', sha1($data['password']));
        $selection->bindParam(':email', $data['email']);
        $selection->execute();
        $selection->closeCursor();

        $resultArray = array('registerstatus' => true);
        return json_encode($resultArray);
    }

    /**
     * Delete an existing friend. Removes the relationship between the currently logged in user and the given friendId in the Relationship table
     * @param int $friendID userId of the friend
     * @return JSONString  a json object with the result of the request. 'deletestatus' => true|false
     */
    function deleteFriend($friendID){
        $sql =  $this->db->prepare('DELETE FROM relationships where user1_id = ? AND user2_id = '.$_SESSION['userid'].' or user2_id = ? AND user1_id = '.$_SESSION['userid'].'');
        $sql->bindValue(1, $friendID);
        $sql->bindValue(2, $friendID);
        $sql->execute();
        $resultArray = array('deletestatus' => true);
        return json_encode($resultArray);
    }

    /**
     * Send friend request. Inserts a new entry in the table Relationship and marks it as open.
     *
     * @param int $userID userId of the user who sends the request
     * @param int $friendID userId of the user who will receive the request
     * @return JSONString  a json object with the result of the request. 'sendFriendRequest' => true|false
     */
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



