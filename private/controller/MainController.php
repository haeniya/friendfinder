<?php
session_start();


/**
 * Created by PhpStorm.
 * User: Luecu
 * Date: 17.05.2016
 * Time: 15:49
 */
class MainController
{
    public $userRepo;
    public $positionRepo;

    function __construct(UserRepository $userRepository, PositionRepository $positionRepository)
    {
        $this->userRepo = $userRepository;
        $this->positionRepo = $positionRepository;
    }
    /**
     * Updates the position for the current user.
     * @param JSON $position contains all necessary position datas
     * @return string json string with indicates it the request was successfull or not
     */
    public function updatePosition($position){
        $result['success'] = $this->positionRepo->savePosition($position);
        return json_encode($result);
    }

    /**
     * Check if the given credentials are valid and log in the user.
     *
     * @param JSON $loginCredentials
     * @return JsonString
     */
    public function login($loginCredentials){
        return $this->userRepo->checkLogin($loginCredentials);
    }

    /**
     * Register a new user.
     * @param JSON $data contains all necessary information of the new user
     * @return JSONString result as json string
     */
    public function register($data){
        return $this->userRepo->register($data);
    }

    /**
     * Get all position data from the friends of the currently logged in user
     * @return string all friends including position information as json string
     */
    public function getFriendsPosition(){
        if(isset($_SESSION['userid']) && !empty($_SESSION['userid'])){
            return json_encode($this->userRepo->getFriendsPosition());
        }
    }

    /**
     * Get all friend for the currently logged in user
     * * @return string all friends as json string
     */
    public function getFriends(){
        if(isset($_SESSION['userid']) && !empty($_SESSION['userid'])){
            return $friends = $this->userRepo->getFriends($_SESSION['userid']);
        }
    }

    /**
     * Delete a friend from the friendlist of the currently logged in user
     * @param int $friendID userId of the friend which has to be removed
     * @return JSONString|string result as jsonString or errorMessage as string
     */
    public function deleteFriend($friendID){
        if($_SESSION['userid']) {
            return $this->userRepo->deleteFriend($friendID);
        }
        else {
            return "Permission error";
        }
    }

    /**
     * Get all open friend request of the currently logged in user
     */
    public function getFriendRequests(){
        return $this->userRepo->getFriendRequests($_SESSION["userid"]);
    }

    /**
     * Get all open awaiting friend request of the currently logged in user
     */
    public function getAwaitingFriendRequests(){
        return $this->userRepo->getAwaitingFriendRequests($_SESSION["userid"]);
    }
    /**
     * Decline the open friend request from the given friend
     * @param int $friendID userId of the sender from the friend request which has to be removed
     * @return JSONString result as json string
     */
    public function declineFriendRequest($friendID){
        return $this->userRepo->declineFriendRequest($_SESSION["userid"], $friendID);
    }

    /*accept friend request*/
    /**
     * Accept a open friend request from the given friendId
     * @param int $friendID userId from  the sender of the request which has to be accepted
     * @return JSONString result as json string
     */
    public function acceptFriendRequest($friendID){
        return $this->userRepo->acceptFriendRequest($_SESSION["userid"], $friendID);
    }

    /**
     * get user according to prefix
     * @param String $prefix prefix which the user has to contain in the usernam
     * @return JSONString all user which match the prefix as jsonString
     */
    public function getUsers($prefix){
        if(isset($_SESSION['userid']) && !empty($_SESSION['userid'])) {
            return $this->userRepo->getUsers($prefix, $_SESSION['userid']);
        }
    }

    /**
     * Send a friend requst to the user with the given userId
     * @param int $friendID
     * @return JSONString result as json string
     */
    public function sendFriendRequest($friendID){
        return $this->userRepo->sendFriendRequest($_SESSION["userid"], $friendID);
    }

}