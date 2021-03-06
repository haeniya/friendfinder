<?php
require '../vendor/autoload.php';
require '../private/controller/MainController.php';
require "../private/repositories/UserRepository.php";
require "../private/repositories/PositionRepository.php";
require "../private/helpers/database.php";
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

header('Content-type:application/json; charset=uft-8');
$app = new \Slim\App();
$app->controller = new MainController(new UserRepository(new DatabaseHelper()), new PositionRepository(new DatabaseHelper()));
$app->get('/', function () use ($app) {
});
$app->post('/updatePosition', function (Request $request) use ($app) {
    $data = $request->getParsedBody();
    $position = $position = json_decode($data['position'], true);
    return $app->controller->updatePosition($position);
});
$app->post('/login', function (Request $request, Response $response) use ($app) {
    $data = $request->getParsedBody();
    $loginCredentials = [];
    $loginCredentials['username'] = filter_var($data['username'], FILTER_SANITIZE_STRING);
    $loginCredentials['password'] = filter_var($data['password'], FILTER_SANITIZE_STRING);
    return $app->controller->login($loginCredentials);
});
$app->post('/register', function (Request $request, Response $response) use ($app) {
    $registerData = $request->getParsedBody();
    return $app->controller->register($registerData);
});
$app->get('/users/{prefix}', function (Request $request, Response $response) use ($app) {
    return $app->controller->getUsers($request->getAttribute('prefix'));
});
$app->get('/logout', function (Request $request, Response $response) use ($app) {
    session_destroy();
    return null;
});
$app->get('/friendsPosition', function() use ($app) {
    return $app->controller->getFriendsPosition();
});
$app->get('/friends', function() use ($app) {
    return $app->controller->getFriends();
});
$app->get('/friends/{friendID}', function (Request $request, Response $response) use ($app) {
    return $app->controller->deleteFriend($request->getAttribute('friendID'));
});

$app->get('/FriendRequests', function (Request $request, Response $response) use ($app) {
    return $app->controller->getFriendRequests();
});
$app->get('/FriendRequests/awaiting', function (Request $request, Response $response) use ($app) {
    return $app->controller->getAwaitingFriendRequests();
});
$app->get('/FriendRequests/new/{userID}', function (Request $request, Response $response) use ($app) {
    return $app->controller->sendFriendRequest($request->getAttribute('userID'));
});
$app->get('/FriendRequests/accept/{friendID}', function (Request $request, Response $response) use ($app) {
    return $app->controller->acceptFriendRequest($request->getAttribute('friendID'));
});
$app->get('/FriendRequests/decline/{friendID}', function (Request $request, Response $response) use ($app) {
    return $app->controller->declineFriendRequest($request->getAttribute('friendID'));
});

$app->run();

?>
