<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Friend finder</title>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:400,100,300,500">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
          integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    <link rel="stylesheet" href="public/fonts/font-awesome-4.6.3/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="public/css/style.css">
    <link rel="stylesheet" type="text/css" href="public/css/form-elements.css">

</head>
<body>
<main>
    <div id="userinfo"
         data-lat=""
         data-lng=""
         data-info="<?php session_start(); echo isset($_SESSION["userid"]) ? $_SESSION["userid"] : 0; ?>">
    </div>
    <header id="search">
        <div id="custom-search-input">
            <div class="input-group col-md-12">
                <input type="text" class="form-control input-lg js-search-box" placeholder="Search..." />
                    <span class="input-group-btn">
                        <button class="btn btn-info btn-lg" type="button">
                            <i class="glyphicon glyphicon-search"></i>
                        </button>
                    </span>
            </div>
        </div>
    </header>
    <section id="login" class="tab">
        <div class="form-box">
            <div class="form-top">
                <div class="form-top-left">
                    <h3>Login to our site</h3>
                    <p>Enter username and password to log on:</p>
                    <div class="notification"></div>
                </div>
                <div class="form-top-right">
                    <i class="fa fa-key"></i>
                </div>
            </div>
            <div class="form-bottom">
                <div class="alert alert-warning" style="display: none"></div>
                <form role="form" action="" method="post" id="login-form">
                    <div class="form-group">
                        <label class="sr-only" for="form-username">Username</label>
                        <input type="text" name="form-username" placeholder="Username"
                               class="form-username form-control" id="form-username">
                    </div>
                    <div class="form-group">
                        <label class="sr-only" for="form-password">Password</label>
                        <input type="password" name="form-password" placeholder="Password"
                               class="form-password form-control" id="form-password">
                    </div>
                    <div class="form-group">
                        <label for="form-remember">Remember me</label>
                        <input id="form-remember" type="checkbox" checked="checked"/>
                    </div>
                    <button id="login-btn" name="login-btn" type="submit" class="btn">Login</button>
                    <button id="register-btn" name="register-btn" class="btn">Register</button>
                </form>
            </div>
        </div>
    </section>

    <section id="register" class="tab">
        <div class="form-box">
            <div class="form-top">
                <div class="form-top-left">
                    <h3>Sign up now</h3>
                    <p>Fill in the form below to get instant access:</p>
                    <div class="notification"></div>
                </div>
                <div class="form-top-right">
                    <i class="fa fa-pencil"></i>
                </div>
            </div>
            <div class="form-bottom">
                <div class="alert alert-warning" id="register-alert" style="display: none;">
                </div>
                <form role="form" action="" method="post" id="registration-form">
                    <div class="form-group">
                        <label class="sr-only" for="form-register-username">Username</label>
                        <input type="text" name="form-register-username" placeholder="Username"
                               class="form-control" id="form-register-username" required>
                    </div>
                    <div class="form-group">
                        <label class="sr-only" for="form-first-name">First name</label>
                        <input type="text" name="form-first-name" placeholder="First name"
                               class="form-control" id="form-first-name" required>
                    </div>
                    <div class="form-group">
                        <label class="sr-only" for="form-last-name">Last name</label>
                        <input type="text" name="form-last-name" placeholder="Last name"
                               class="form-control" id="form-last-name" required>
                    </div>
                    <div class="form-group">
                        <label class="sr-only" for="form-email">Email</label>
                        <input type="email" name="form-email" placeholder="Email" class="form-control"
                               id="form-email" required>
                    </div>
                    <div class="form-group">
                        <label class="sr-only" for="form-register-password">Password</label>
                        <input type="password" name="form-register-password" placeholder="Password" class="form-control"
                               id="form-register-password" required>
                    </div>
                    <div class="form-group">
                        <label class="sr-only" for="form-confirm-pwd">Password confirm</label>
                        <input type="password" name="form-confirm-pwd" placeholder="Confirm password" class="form-control"
                               id="form-confirm-pwd" required>
                    </div>
                    <button id="register-send-btn" type="submit" class="btn">Register</button>
                    <button id="back-login-btn" name="back-login-btn" class="btn">Back</button>
                </form>
            </div>
        </div>
    </section>

    <section id="map" class="tab">

    </section>

    <section id="allpersons" class="tab">
        <div class="notification alert alert-info" role="alert"></div>
        <div id="persons">
            <h3>Suchresultate:</h3>
            <ul>

            </ul>
        </div>
        <div id="friendrequests">
            <h3>Offene Anfragen:</h3>
            <ul>

            </ul>
        </div>
        <div id="awaitingfriendrequests">
            <h3>Ausstehende Anfragen:</h3>
            <ul>

            </ul>
        </div>
        <div id="friends">
            <h3>Freunde:</h3>
            <ul>

            </ul>
        </div>
    </section>
    <nav class="navbar navbar-default navbar-fixed-bottom">
        <ul class="nav nav-pills nav-justified">
            <li role="presentation" class="map-view active">
                <a id="showmap" data-tab="showmap" href="#"><i class="glyphicon glyphicon-map-marker"></i> Go to Map</a>
            </li>
            <li role="presentation" class="allpersons-view">
                <a id="friendlist" data-tab="friendlist" href="#"><i class="glyphicon glyphicon-user"></i> Friend list</a>
            </li>
            <li role="presentation"><a id="logout" data-tab="logout" href="#"><i class="glyphicon glyphicon-off"></i> Logout</a></li>
        </ul>
    </nav>
</main>
</body>
<script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<script src="public/js/app.js"></script>
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=true&v=3"></script>
</html>