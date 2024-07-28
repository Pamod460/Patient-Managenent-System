Webcam.set({
    width: 320,
    height: 240,
    dest_width: 640,
    dest_height: 480,
    image_format: 'jpeg',
    jpeg_quality: 90,
    force_flash: false

});

Webcam.attach('#my_camera');

function take_snapshot() {
    Webcam.snap(function (data_uri) {
        document.querySelector('.image-tag').value = data_uri;
        // document.getElementById('my_camera').innerHTML = '<img src="' + data_uri + '"/>';
    });
    Webcam.freeze()

}
function retake_snapshot() {
    Webcam.unfreeze()
    // document.getElementById('my_camera').innerHTML = '';
    Webcam.attach('#my_camera');

}
$().ready(function () {
    $('#birthday').on('input', function () {
        var today = new Date();
        var birthDate = new Date(this.value);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        $('#age').val(age);
    })
    $('#contact').on('input', function () {
        var phoneNumber = $(this).val();
        var formGroup = $(this).closest('.form-control:focus');
        if (phoneNumber === "") {
            // Clear styles and validation message if the input is empty
            formGroup.removeClass('valid invalid');
            $('#phone-validation-message').text('');
        } else {

            $.ajax({
                url: '/regexes',
                type: 'POST',
                data: { phone_number: phoneNumber },
                success: function (response) {
                    if (response.valid) {
                        $('#phone-validation-message').text('Valid phone number').css('color', 'green');
                        formGroup.removeClass('invalid').addClass('valid');
                    } else {
                        $('#phone-validation-message').text('Invalid phone number').css('color', 'red');
                        formGroup.removeClass('valid').addClass('invalid');
                    }
                }
            });
        }
    });
}
);
function submitForm() {
    var formData = new FormData(document.getElementById('patient-form'));

    $.ajax({
        url: "/add_patient",
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            alert('An error occurred. Please try again.');
        }
    });
}