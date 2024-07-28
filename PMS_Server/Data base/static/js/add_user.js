$(document).ready(function () {
    $('#alert').hide();
    $("#userForm").on('submit', function (event) {
        var username = $('#username').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm_password').val();
        var hashedPassword = CryptoJS.SHA256(password).toString();
        var hashedConfirmPassword = CryptoJS.SHA256(confirmPassword).toString();



        // Check if the passwords match
        console.log(password,confirmPassword);
        if (password !== confirmPassword) {
            $('#alert').show();
            $('#alert').text('Passwords does not match!').addClass('alert-danger').removeClass('alert-success');
            return;
        } else {
            $('#alert').hide();
            $('#alert').removeClass('alert-danger alert-success');
        }
        $.ajax({
            url: "/add_user",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                password: hashedPassword,
                confirm_password: hashedConfirmPassword
            }),
            processData: false,
            success: function (response) {
                console.log(response);
            },
            error: function (response) {
                alert('An error occurred. Please try again.');
            }
        });
    })

});