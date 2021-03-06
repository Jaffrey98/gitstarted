// Initialize Firebase
var config = {
    apiKey: "AIzaSyBgVB3a5E7crskEMyX3dxL8-jLA_joc780",
    authDomain: "git-started-production.firebaseapp.com",
    databaseURL: "https://git-started-production.firebaseio.com",
    projectId: "git-started-production",
    storageBucket: "",
    messagingSenderId: "511844033342"
};
firebase.initializeApp(config);

var provider = new firebase.auth.GithubAuthProvider();
provider.addScope('user');

function signInPOP() {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = result.credential.accessToken;
        localStorage.setItem('token',token);
        // alert("Token : " + token);
        // The signed-in user info.
        var user = result.user;
        //alert(JSON.stringify(user));
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        console.log(errorCode);
        var errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}
function signIn() {
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            token = result.credential.accessToken;
            localStorage.setItem('token',token);
            // alert("Token : " + token);
            // ...
        }
        // The signed-in user info.
        var user = result.user;
        // alert(JSON.stringify(user));
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        console.log(errorCode);
        var errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

function logOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        // alert("Successfully signed out");
    }).catch(function (error) {
        // An error happened.
        alert("Sign Out Error");
    });
}


$(document).ready(function () {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            get_info();
            localStorage.removeItem('key');
             // alert(JSON.stringify(user));
            // User is signed in.

            // alert(user.displayName);
            $('.sign-in-logout').html(
                `<div class="navbar-buttons" style="margin-top:20px">
                <div class="navbar-collapse collapse right">
                    <span "margin-right:8%">Hello ` + user.displayName + `,&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <button type="button" class="btn btn-primary logout-btn" style="padding-right:20px;">
                        <span class="align-middle">
                           <span>LOG OUT</span>
                        </span>
                    </button>
                </div>
            </div>
            `
            );
            show_function()

            //show_recommendations();

        } else {
            // No user is signed in.
            $('#cards').html('')
            $('.sign-in-logout').html(
                `<div class="navbar-buttons" style="margin-top:20px">
                <div class="navbar-collapse collapse right">
                    <button type="button" class="btn btn-primary signin-btn" style="padding-right:20px;">
                        <span class="align-middle">
                             <i class="fab fa-github fa-lg" style="margin-right:8%"></i><span>SIGN IN</span>
                        </span>
                    </button>
                </div>
            </div>
            `
            );
            $('#show').html(
                `<div class="box text-center" data-animate="fadeInUp">
                <div class="container">
                    <div class="col-md-12">
                        <h3 style="font-style:italic;" >Hey there!</h3>
                        <p class="lead">Please login with your github account to see customized recommendations for you</p>
                    </div>
                </div>
            </div>

            <div class="container" id="cards">
                <div class="col-md-12" data-animate="fadeInUp"></div>
            </div>
            <br>`
                );
        }
        // var userx = firebase.auth().currentUser;

        // alert(JSON.stringify(userx));
        $('.signin-btn').click(function () {
            // alert('clicked signin');
            signInPOP();
        })

        $('.logout-btn').click(function () {
            // alert('clicked logout');
            logOut();
        })

        function lolm() {
            // alert("logo");
        }
    });

});


function slider_change()
{
    var slider = document.getElementById("slider_input");
    // console.log(slider.value)
}