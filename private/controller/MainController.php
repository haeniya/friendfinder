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
    /*Update current Users Position*/
    public function updatePosition($position){
        $result['success'] = $this->positionRepo->savePosition($position);
        return json_encode($result);
    }

    /*Login user*/
    public function login($loginCredentials){
        $result = false;
        return $this->userRepo->checkLogin($loginCredentials);
    }

    /*Register user*/
    public function register($data){
        $result = false;
        return $this->userRepo->register($data);
    }

    /*get all friends*/
    public function getFriendsPosition(){
        if(isset($_SESSION['userid']) && !empty($_SESSION['userid'])){
            return json_encode($this->userRepo->getFriendsPosition());
        }
    }

    /*get all friends*/
    public function getFriends(){
        if(isset($_SESSION['userid']) && !empty($_SESSION['userid'])){
            return $friends = $this->userRepo->getFriends($_SESSION['userid']);
        }
    }

    /**Create new friend request
     * @param $userID
     * @return null
     */
    public function newFriendRequest($userID){
        $result = null;
        return $result;
    }

    /*delete friend*/
    public function deleteFriend($friendID){
        if($_SESSION['userid']) {
            return $this->userRepo->deleteFriend($friendID);
        }
        else {
            return "Permission error";
        }
    }

    /*get all open friendrequest*/
    public function getFriendRequests(){
        return $this->userRepo->getFriendRequests($_SESSION["userid"]);
    }

    /*get all open awaiting friendrequest*/
    public function getAwaitingFriendRequests(){
        return $this->userRepo->getAwaitingFriendRequests($_SESSION["userid"]);
    }
    /*decline friend request*/
    public function declineFriendRequest($friendID){
        return $this->userRepo->declineFriendRequest($_SESSION["userid"], $friendID);
    }

    /*accept friend request*/
    public function acceptFriendRequest($friendID){
        return $this->userRepo->acceptFriendRequest($_SESSION["userid"], $friendID);
    }

    /*get user according to prefix, used for search*/
    public function getUsers($prefix){
        if(isset($_SESSION['userid']) && !empty($_SESSION['userid'])) {
            return $this->userRepo->getUsers($prefix, $_SESSION['userid']);
        }
    }

    public function sendFriendRequest($friendID){
        return $this->userRepo->sendFriendRequest($_SESSION["userid"], $friendID);
    }

}