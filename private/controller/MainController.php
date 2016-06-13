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
        //$result['success'] = $this->positionRepo->savePosition($position);
       // return json_encode($result);
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
    public function getFriends(){
        $result = null;
        return $this->userRepo->getFriends($_SESSION["userid"]);
    }

    /*get all open friendrequest*/
    public function getFriendRequests(){
        $result = null;
        return $this->userRepo->getFriendRequests($_SESSION["userid"]);
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
    public function deleteFriend(){
        $result = null;
        return $result;
    }

    /*decline friend request*/
    public function declineFriendRequest(){
        $result = null;
        return $result;
    }

    /*accept friend request*/
    public function acceptFriendRequest(){
        $result = null;
        return $result;
    }

    /*get user according to prefix, used for search*/
    public function getUsers($prefix){
        return $this->userRepo->getUsers($prefix);
    }

}