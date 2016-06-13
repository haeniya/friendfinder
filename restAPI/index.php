<?php
require '../vendor/autoload.php';
require '../private/controller/MainController.php';
require "../private/repositories/UserRepository.php";
require "../private/helpers/database.php";
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

header('Content-type:application/json; charset=uft-8');
$app = new \Slim\App();
$app->controller = new MainController(new UserRepository(new DatabaseHelper()));
$app->get('/', function () use ($app) {
});
$app->post('/updatePosition', function (Request $request) use ($app) {
    $data = $request->getParsedBody();
    return $app->controller->updatePosition($data['position']);
});
$app->post('/login', function (Request $request, Response $response) use ($app) {
    $data = $request->getParsedBody();
    $loginCredentials = [];
    $loginCredentials['username'] = filter_var($data['username'], FILTER_SANITIZE_STRING);
    $loginCredentials['password'] = filter_var($data['password'], FILTER_SANITIZE_STRING);
    return $app->controller->login($loginCredentials);
});

$app->get('/users/{prefix}', function (Request $request, Response $response) use ($app) {

    return $app->controller->getUsers($request->getAttribute('prefix'));
});

$app->get('/friends', function () use ($app) {
    return $app->controller->getFriends();
});
$app->post('/friends/{friend}', function (Request $request, Response $response) use ($app) {
    return $app->controller->deleteFriend($request->getAttribute('friend'));
});

$app->get('/FriendRequests', function (Request $request, Response $response) use ($app) {
    return $app->controller->getFriendRequests();
});
$app->post('/FriendRequests/new', function (Request $request, Response $response) use ($app) {
    return $app->controller->newFriendRequest($request->getAttribute('userid'));
});
$app->post('/FriendRequests/accept', function (Request $request, Response $response) use ($app) {
    $data = $request->getParsedBody();
    $friendRequestData = [];
    $friendRequestData['userID'] = filter_var($data['userID'], FILTER_SANITIZE_STRING);
    return $app->controller->acceptFriendRequest($friendRequestData);
});
$app->post('/FriendRequests/decline', function (Request $request, Response $response) use ($app) {
    $data = $request->getParsedBody();
    $friendRequestData = [];
    $friendRequestData['userID'] = filter_var($data['userID'], FILTER_SANITIZE_STRING);
    return $app->controller->acceptFriendRequest($friendRequestData);
});

$app->run();


?>
