(function(){
    var preview = null;
    $(function(){
        var hash = location.hash.substring(1);
        if(hash !== ""){
            toggleView(hash);
        }
        else{
            toggleView("play");
        }
        $("body")
            .hide()
            .fadeIn(600)
            .on("change", "#submit_photo", function(){
                if(isValidPhoto($("#submit_photo").val())){
                    if(this.files && this.files[0]){
                        var reader = new FileReader();
                        reader.addEventListener("load", function(event){
                            preview = event.target.result;
                            $("#preview").attr("src", preview); // Set src attribute to the uploaded image
                            $(".img-preview").fadeIn(600); // Fade in the preview, will only fire if the user hasn't uploaded a photo yet
                        });
                        reader.readAsDataURL(this.files[0]);
                    }
                }
                else{
                    showModal("Invalid file, please make sure it's an image file.");
                    $("#submit_photo").val(""); // Clear the currently uploaded file
                    return false;
                }
            })
            .on("click", ".button", function(){
                if($(this).attr("data-action")){
                    handleAction($(this).attr("data-action"), $(this).attr("data-id") ? $(this).attr("data-id") : null);
                }
            })
            .on("click", "#main-display .img-player", function(){
                handleAction("submit_vote", $(this).attr("id"));
            })
            .on("click", ".modal.closable", function(){
                $(this).fadeOut(600, function(){
                    $(this).remove();
                });
                $("body").css("overflow", ""); // Allow scrolling again
            })
            .on("keyup", "form[data-form='report'] textarea", function(){
                var len = clean($(this).val()).length;
                var $counter = $("#counter");
                if(len < 32){
                    $counter.html((32 - len) + " more characters needed");
                }
                else{
                    $counter.html((510 - len) + " characters remaining");
                }
            })
            .on("submit", "form", function(event){
                event.preventDefault(); // No need to do anything else, on click for .button already takes care of things
            });
        $(window)
            .on("hashchange", function(){
                toggleView(location.hash.substring(1));
            })
            .on("scroll", function(){
                var $header = $("#header");
                // Add .fixed to header if scrolled past inner height of header
                if($(window).scrollTop() > $header.innerHeight()){
                    $header.addClass("fixed");
                }
                else{
                    $header.removeClass("fixed");
                }
            });
    });
    function clean(string){
        return string.trim().replace(/\s+/g, " "); // Remove leading/trailing whitespaces and multiple whitespaces
    }
    function fancy(string){
        return clean(string).replace(/\\/g, "");
    }
    function getPreferredGender(){
        var gender = store.get("gender");
        // If 'gender' doesn't exist, or if existing 'gender' isn't female or male
        if(!store.has("gender") || (gender !== "f" && gender !== "m")){
            gender = "f";
        }
        store.set("gender", gender);
        return gender;
    }
    function getHashParameter(name){
        var params = location.hash.split("?")[1].split("&");
        for(var i = 0; i < params.length; i++){
            var param = params[i].split("=");
            if(param[0] === name){
                return param[1];
            }
        }
    }
    // https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site/3177838#3177838
    function timeSince(time){
        var seconds = Math.floor((new Date() - time) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }
    function hasSubmitted(){
        if(!store.has("submitted")){
            store.set("submitted", false);
        }
        return store.get("submitted");
    }
    function isLoggedIn(){
        // TODO: Fix synchronous AJAX request, use async method instead
        var loggedIn = false;
        $.ajax({
            url: "api/auth.php",
            type: "post",
            dataType: "json",
            async: false
        })
            .done(function(data){
                loggedIn = data.data.logged_in;
            })
            .fail(function(data){
                loggedIn = false; 
            });
        return loggedIn;
    }
    function isValidPhoto(filename){
        var extension = filename.replace(/^.*\./, ""); // Replace until we're left with the file extension
        if(filename == extension){
            extension = ""; // File has no extension, so it's blank
        }
        else{
            extension = extension.toLowerCase();
        }
        switch(extension){
            case "gif":
            case "jpg":
            case "png":
                return true;
            default:
                return false;
        }
    }
    function renderDashboard(){
        // Stop rendering if person isn't logged in
        if(!isLoggedIn()){
            showModal("Please log in first.");
            toggleView("login");
        }
        $.ajax({
            url: "api/data.php",
            type: "post",
            dataType: "json",
            data: {
                operation: "all"
            }
        })
            .done(function(data){
                var $display = $("#dashboard-display");
                $display.empty();
                for(var i = 0; i < data.data.length; i++){
                    var player = data.data[i];
                    // And here you have some very ugly JavaScript code
                    var html = 
                        "<div class='container-player' data-id='" + player.id + "'>" +
                            "<img src='api/photo.php?id=" + player.id + "' class='img-player' dragabble='false'>" +
                            "<div class='player-items'>" +
                                "<ul class='list-items'>" +
                                    "<li class='name'>" + fancy(player.first_name) + (player.last_name ? " " + fancy(player.last_name) : "") + "</li>"
                    ;
                    // List items for players that have been approved
                    if(player.ready == 1){
                        html += 
                                    "<li><b>" + parseInt(player.score).toLocaleString() + "</b> point" + (player.score == 1 ? "" : "s") + "</li>" +
                                    "<li><b>" + parseInt(player.wins).toLocaleString() + "</b> win" + (player.wins == 1 ? "" : "s") + "</li>" +
                                    "<li><b>" + parseInt(player.losses).toLocaleString() + "</b> loss" + (player.losses == 1 ? "" : "es") + "</li>" +
                                    "<li>From <b>" + player.ip + "</b></li>" +
                                    "<li>" +
                                        "<ul class='buttons'>" +
                                            "<li><input type='button' class='button b-button' data-action='view_player' data-id='" + player.id + "' value='Edit'></li>\n" +
                                            "<li><input type='button' class='button r-button' data-action='delete_player' data-id='" + player.id + "' value='Delete'></li>\n" +
                                        "</ul>" +
                                    "</li>"
                        ;
                    }
                    // Non-approved players that need approval
                    else{
                        html += 
                                    "<li>From <b>" + player.ip + "</b></li>" +
                                    "<li>Submitted <b><span title='" + new Date(parseInt(player.created_at * 1000)).toUTCString() + "'>"  + timeSince(player.created_at * 1000) + "</span></b> ago</li>" +
                                    "<li>" +
                                        "<ul class='buttons'>" +
                                            "<li><input type='button' class='button b-button' data-action='view_player' data-id='" + player.id + "' value='Edit'></li>\n" +
                                            "<li><input type='button' class='button g-button' data-action='approve_player' data-id='" + player.id + "' value='Approve'></li>\n" +
                                            "<li><input type='button' class='button r-button' data-action='delete_player' data-id='" + player.id + "' value='Delete'></li>" +
                                        "</ul>" +
                                    "</li>"
                        ;
                    }
                    html += 
                                "</ul>" +
                            "</div>" +
                        "</div>"
                    ;
                    $display.append(html);
                }
                if($display.is(":empty")){
                    $display.html("No new players were found.");
                }
            })
            .fail(function(data){
                showModal("Failed to render dashboard.");
            });
    }
    function renderImages(){
        $.ajax({
            url: "api/data.php",
            type: "post",
            dataType: "json",
            data: {
                operation: "random",
                gender: getPreferredGender()
            }
        })
            .done(function(data){
                if(data.data.length < 2){
                    $("#main-display").html("<p>There aren't enough players of this gender currently. You could help <a href='#submit'>change that</a>.</p>");
                    return;
                }
                var $display = $("#main-display");
                $display.hide();
                // Player 1
                var id = data.data[0].id;
                $("#player-one")
                    .attr("src", "api/photo.php?id=" + id)
                    .attr("data-id", id);
                // Player 2
                id = data.data[1].id;
                $("#player-two")
                    .attr("src", "api/photo.php?id=" + id)
                    .attr("data-id", id);
                $display.fadeIn(600);
            })
            .fail(function(data){
                showModal("Failed to fetch images.");
            });
    }
    function renderLeaderboard(){
        $.ajax({
            url: "api/data.php",
            type: "post",
            dataType: "json",
            data: {
                operation: "leaderboard",
                gender: getPreferredGender()
            }
        })
            .done(function(data){
                if(data.data.length < 2){
                    $("#leaderboard-display").html("<p>There aren't enough players of this gender currently. You could help <a href='#submit'>change that</a>.</p>");
                    return;
                }
                for(var i = 0; i < data.data.length; i++){
                    var player = data.data[i];
                    $("#leaderboard-display").append(
                        "<div class='container-player'>" +
                            "<img src='api/photo.php?id=" + player.id + "' class='img-player' dragabble='false'>" +
                            "<div class='player-items'>" +
                                "<h2 class='rank'> " + (i + 1) + "</h2>" +
                                "<ul class='list-items'>" +
                                    "<li class='name'>" + fancy(player.first_name) + (player.last_name ? " " + fancy(player.last_name) : "") + "</li>" +
                                    "<li><b>" + parseInt(player.score).toLocaleString() + "</b> point" + (player.score == 1 ? "" : "s") + "</li>" +
                                    "<li><b>" + parseInt(player.wins).toLocaleString() + "</b> win" + (player.wins == 1 ? "" : "s") + "</li>" +
                                    "<li><b>" + parseInt(player.losses).toLocaleString() + "</b> loss" + (player.losses == 1 ? "" : "es") + "</li>" +
                                    "<li title='" + player.ip_hash + "'>From <b>" + player.ip_hash.substring(0, 16) + "</b>...</li>" +
                                    "<ul class='buttons'>" +
                                        "<li><input type='button' class='button b-button' data-action='view_player' data-id='" + player.id + "' value='" + (isLoggedIn() ? "Edit" : "View") + "'></li>" +
                                    "</ul>" +
                                "</ul>" +
                            "</div>" +
                        "</div>"
                    );
                }
            })
            .fail(function(data){
                showModal("Failed to render leaderboard.");
            });
    }
    function renderPlayer(id){
        var $content = $("#content");
        $content.hide();
        $.ajax({
            url: "api/player.php",
            type: "post",
            dataType: "json",
            data: {
                operation: "data",
                id: id
            }
        })
            .done(function(data){
                var player = data.data;
                $("h1.heading").html(isLoggedIn() ? "Editing " + player.first_name + " (#" + player.id + ")" : player.first_name + "'s stats");
                $("#player_img").attr("src", "api/photo.php?id=" + player.id);
                $("#player_first_name").val(player.first_name);
                $("#player_last_name").val(player.last_name);
                $("#player_gender").find("option[value='" + player.gender + "']").attr("selected", "selected");
                $("#player_ip").val(isLoggedIn() ? player.ip : player.ip_hash);
                $("#player_score").val(player.score + " points");
                $("#player_wins").val(player.wins + " wins");
                $("#player_losses").val(player.losses + " losses");
                $("input[data-action]").attr("data-id", player.id);
                if(!isLoggedIn()){
                    // Remove empty fields from public view
                    $("input").each(function(){
                        if($(this).val() === ""){
                            $(this).remove();
                        }
                    });
                    // Disable all fields
                    $("input, select").attr("disabled", "disabled");
                    // Remove the buttons
                    $(".buttons").remove();
                }
                // Remove the approve button if the player is already approved
                if(player.ready == 1){
                    $("input[data-action='approve_player']").parent().remove();
                }
                $content.fadeIn(600);
            })
            .fail(function(data){
                showModal("Failed to render player profile.");
            });
    }
    function renderReports(){
        // Stop rendering if person isn't logged in
        if(!isLoggedIn()){
            showModal("Please log in first.");
            toggleView("login");
        }
        $.ajax({
            url: "api/report.php",
            type: "post",
            dataType: "json",
            data: {
                operation: "all"
            }
        })
            .done(function(data){
                var $display = $("#reports-display");
                $display.empty();
                for(var i = 0; i < data.data.length; i++){
                    var report = data.data[i];
                    $display.append(
                        "<div class='container-report' data-id='" + report.id + "'>" +
                            "<h1 class='heading'>#" + report.id + "</h1>" +
                            "<ul class='list-items'>" +
                                (report.name ? "<li><b>From:</b> " + fancy(report.name) + (report.email ? " (" + report.email + ")" : "") + "</li>" : (report.email ? "<li><b>From</b>: " + fancy(report.email) + "</li>" : "")) +
                                "<li><b>Received:</b> <span title='" + new Date(parseInt(report.created_at * 1000)).toUTCString() + "'>"  + timeSince(report.created_at * 1000) + " ago</span></li>" +
                                "<li><b>Message:</b> " + fancy(report.message) + "</p></li>" +
                            "</ul>" +
                            "<ul class='buttons'>" +
                                "<li><input type='button' data-action='delete_report' data-id='" + report.id + "' class='button r-button' value='Delete'></li>" +
                            "</ul>" +
                        "</div>"
                    );
                }
                if($display.is(":empty")){
                    $display.html("No new reports were found.");
                }
            })
            .fail(function(data){
                showModal("Failed to render reports.");
            });
    }
    function closeModals(){
        $("body").css("overflow", "");
        $(".modal").each(function(){
            $(this).fadeOut(600, function(){
                $(this).remove(); // Remove all other modals, so they don't overlap
            });
        });
    }
    function showModal(html, keep, closable){
        closeModals();
        html = clean(html);
        var $modal = $("<div/>");
        $modal
            .addClass("modal")
            .addClass(closable === undefined || closable ? "closable" : "")
            .append(closable === undefined || closable ? "<a class='close' title='Close'></a>" : "") // If modal can be closed by click
            .append("<div class='content'>" + html + "</div>") // Create the close button and inner content div
            .appendTo("body")
            .hide()
            .fadeIn(600);
        $("body").css("overflow", "hidden"); // Disable scrolling of the body under modal
        if(!keep){
            // Remove modal after n microseconds
            setTimeout(function(){
                closeModals();
            }, ((html.length * 10) / 60) * 1000); // Calculate the amount of time the modal should show, based on length of message
        }
    }
    function handleAction(action, data){
        switch(action.toLowerCase()){
            case "approve_player":
                $.ajax({
                    url: "api/player.php",
                    type: "post",
                    dataType: "json",
                    data: {
                        operation: "approve",
                        id: data
                    }
                })
                    .done(function(data){
                        showModal("Approved!");
                    })
                    .fail(function(data){
                        showModal("Failed to approve player.");
                    });
                break;
            case "delete_player":
                var id = data; // Another spaghetti
                $.ajax({
                    url: "api/player.php",
                    type: "post",
                    dataType: "json",
                    data: {
                        operation: "delete",
                        id: data
                    }
                })
                    .done(function(data){
                        $(".container-player[data-id='" + id + "']").fadeOut(800);
                        showModal("Deleted!");
                    })
                    .fail(function(data){
                        showModal("Failed to delete player.");
                    });
                break;
            case "delete_report":
                var id = data; // With meatballs?
                $.ajax({
                    url: "api/report.php",
                    type: "post",
                    dataType: "json",
                    data: {
                        operation: "delete",
                        id: data
                    }
                })
                    .done(function(data){
                        $(".container-report[data-id='" + id + "']").fadeOut(800);
                        showModal("Deleted!");
                    })
                    .fail(function(data){
                        showModal("Failed to delete report.");
                    });
                break;
            case "login":
                var user = clean($("#login_user").val());
                var password = clean($("#login_password").val());
                if(user && password){
                    $.ajax({
                        url: "api/auth.php",
                        type: "post",
                        dataType: "json",
                        data: {
                            operation: "login",
                            user: user,
                            password: password
                        }
                    })
                        .done(function(data){
                            if(data.data.logged_in){
                                showModal("Logging in...");
                                toggleView("dashboard");
                            }
                            else{
                                $("#login_password").val("");
                                showModal("Failed to log in, incorrect username or password specified.");
                            }
                        })
                        .fail(function(data){
                            showModal("Failed to authenticate login credentials.");
                        });
                }
                else{
                    showModal("Login username or password field is empty.");
                }
                break;
            case "logout":
                $.ajax({
                    url: "api/auth.php",
                    type: "post",
                    dataType: "json",
                    data: {
                        operation: "logout"
                    }
                })
                    .done(function(data){
                        if(data.status === "success"){
                            toggleView("login");
                            showModal("Logging out...");
                        }
                        else{
                            showModal("Failed to log out.");
                        }
                    })
                    .fail(function(data){
                        showModal("Failed to log out.");
                    });
                break;
            case "render_dashboard":
                toggleView("dashboard");
                break;
            case "render_reports":
                toggleView("reports");
                break;
            case "reset":
                preview = null;
                $("form")[0].reset();
                $("#counter").html("510 characters remaining");
                break;
            case "save_player":
                var firstName = clean($("#player_first_name").val());
                var lastName = clean($("#player_last_name").val());
                var gender = clean($("#player_gender").val());
                if(firstName && gender){
                    $.ajax({
                        url: "api/player.php",
                        type: "post",
                        dataType: "json",
                        data: {
                            operation: "edit",
                            id: data,
                            first_name: firstName,
                            last_name: lastName,
                            gender: gender
                        }
                    })
                        .done(function(data){
                            showModal("Saved!");
                        })
                        .fail(function(data){
                            showModal("Failed to save player.");
                        });
                }
                else{
                    showModal("Please make sure all fields were filled out.");
                }
                break;
            case "save_settings":
                var gender = $("#settings_gender").val();
                store.set("gender", gender ? gender : "f");
                showModal("Your settings have been saved.");
                break;
            case "set_gender":
                store.set("gender", data);
                store.set("played", true);
                toggleView("play");
                closeModals();
                break;
            case "submit_photo":
                var firstName = clean($("#submit_first_name").val());
                var lastName = clean($("#submit_last_name").val());
                var gender = $("#submit_gender").val();
                if(firstName && gender && isValidPhoto($("#submit_photo").val())){
                    $.ajax({
                        url: "api/submit_photo.php",
                        type: "post",
                        dataType: "json",
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                            gender: gender,
                            photo: preview
                        }
                    })
                        .done(function(data){
                            handleAction("reset");
                            $(".img-preview").fadeOut(600);
                            $("#preview").attr("src", ""); // Reset the preview image
                            store.set("submitted", true);
                            showModal("Successfully submitted photo! You'll see it soon.");
                        })
                        .fail(function(data){
                            console.log(data);
                            showModal("Failed to submit photo, please try again later.");
                        });
                }
                else{
                    showModal("You haven't filled everything out yet!");
                }
                break;
            case "submit_report":
                var name = clean($("#report_name").val());
                var email = clean($("#report_email").val());
                var message = clean($("#report_message").val());
                if(message.length >= 32 && message.length <= 510){
                    $.ajax({
                        url: "api/submit_report.php",
                        type: "post",
                        dataType: "json",
                        data: {
                            name: name,
                            email: email,
                            message: message,
                            gotcha: $("#report_gotcha").val(), // Honeypot for scrapers, if value is present, email will be silently ignored
                        }
                    })
                        .done(function(data){
                            handleAction("reset"); // Reset all fields in form, to discourage consecutive submissions
                            showModal("Thanks for the report! We'll get to you shortly.");
                        })
                        .fail(function(data){
                            showModal("Failed to submit report, please try again later.");
                        });
                }
                else{
                    showModal("Please fill the report out completely.");
                }
                break;
            case "submit_vote":
                $.ajax({
                    url: "api/vote.php",
                    type: "post",
                    dataType: "json",
                    data: {
                        winner: $("#" + data).attr("data-id"),
                        loser: $("#" + (data === "player-one" ? "player-two" : "player-one")).attr("data-id")
                    }
                })
                    .done(function(data){
                        renderImages();
                    })
                    .fail(function(data){
                        showModal("Failed to connect, please try again.");
                    });
                break;
            case "view_player":
                toggleView("player?id=" + data);
                break;
            default:
                showModal("Failed to handle, an unknown action was encountered.");
                break;
        }
    }
    function toggleView(hash){
        var page = hash.substring(0, hash.indexOf("?") != -1 ? hash.indexOf("?") : hash.length); // Removes hash params
        // Stop if hash is a dead anchor
        if(location.hash === "#"){
            return;
        }
        // Set gender preference if it hasn't been set yet
        if(!store.has("played") || !store.get("played")){
            showModal(
                "Which gender do you prefer?" +
                "<ul class='buttons'>" +
                    "<li><input type='button' class='button b-button' data-action='set_gender' data-id='m' value='Male'></li>\n" +
                    "<li><input type='button' class='button r-button' data-action='set_gender' data-id='f' value='Female'></li>" +
                "</ul>"
            , true, false);
        }
        var $content = $("#content");
        $.ajax({
            url: "views/" + page + ".html",
            dataType: "html"
        })
            .done(function(data){
                $content.hide(); // Hide initial HTML, to prevent a sudden change
                document.title = page.charAt(0).toUpperCase() + page.slice(1) + " \267 Faceclash"; // Update page title
                location.hash = "#" + hash; // Update hash
                // Remove blinking effect on submit button if player has submitted a photo already
                $content
                    .html(data) // Replace current HTML with new view
                    .fadeIn(600); // Enter new view...
                if(hasSubmitted()){
                    $("#header").find(".submit").removeClass("blink");
                }
                switch(page){
                    case "dashboard":
                        renderDashboard();
                        break;
                    case "leaderboard":
                        renderLeaderboard();
                        break;
                    case "login":
                        if(isLoggedIn()){
                            toggleView("dashboard");
                        }
                        break;
                    case "play":
                        renderImages();
                        break;
                    case "player":
                        renderPlayer(getHashParameter("id"));
                        break;
                    case "reports":
                        renderReports();
                        break;
                    case "submit":
                        hasSubmitted();
                        break;
                }
            })
            .fail(function(data){
                toggleView("error"); // Call toggleView again to display error
            });
    }
})();