var oldPatient = {}

Webcam.set({
    width: 320,
    height: 240,
    dest_width: 320,
    dest_height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90,


});
Webcam.attach('#my_camera');

class Patient {
    constructor(id, name, birthday, age, gender, contact, photo) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.age = Number.parseInt(age);
        this.gender = gender;
        this.contact = contact;
        this.photo = photo;


    }
}

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
    $(".alert").alert('close')
    var patientId = location.href.split('/')[location.href.split('/').length - 1];
    $.ajax({
        url: "/modify_patient/" + patientId,
        method: "GET",
        success: function (response) {
            console.log(response.patient)
            if (response.success) {
                load_Form(response.patient)
            }
        }
        ,
        error: function (xhr, status, error) {
            console.error(error);
            // alert('An error occurred while processing your request. Please try again.');
        }

    })




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
                url: '/validate_phone',
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

function load_Form(patient) {
    oldPatient = new Patient(patient.id, patient.name, patient.birthday, patient.age, patient.gender, patient.contact, patient.photo)

    $('#name').val(patient.name);
    $('#birthday').val(patient.birthday);
    $('#age').val(patient.age);
    $('#gender').val(patient.gender);
    $('#contact').val(patient.contact);
    var imgSrc = patient.photo;
    var imgElement = '<img src="' + imgSrc + '" width="320" height="240" />';
    $('#my_camera').html(imgElement);

}
function showAlert(message, type) {
    $('#alert-container').empty()
    var alertHtml = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                        ${message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                     </div>`;
    $('#alert-container').html(alertHtml);
}

function showConfirm(message, type, callback) {
    $('#alert-container').empty()
    var alertHtml = `<div class="modal" style="z-index:1010"  id="confirmationModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="confirm-btn">OK</button>
        </div>
      </div>
    </div>
  </div>`;

    
    $('#alert-container').html(alertHtml);
    document.querySelector('#confirmationModal .modal-body').innerHTML = message;
    $('#confirmationModal').modal('show');

    $('#confirm-btn').on('click', function () {
        $('#confirmationModal').modal('hide');
        callback();
    });
}
function getChangedFields(oldPatient, newPatient) {
    var changedFields = [];
    var keys = Object.keys(oldPatient);

    for (var key of keys) {
        if (oldPatient[key] !== newPatient[key]) {
            changedFields.push(key);
        }
    }

    return changedFields;
}
function submitForm() {

    var newPatient = new Patient(oldPatient.id,
        $('#name').val(),
        $('#birthday').val(),
        $('#age').val(),
        $('#gender').val(),
        $('#contact').val(),
        $('#my_camera img').attr('src')
    );
    console.log(newPatient);
    var formData = new FormData(document.getElementById('patient-form'));
    var fields = getChangedFields(oldPatient, newPatient)
    if (fields == 0) {
        showAlert("No changes in patient data.", "warning");
        setTimeout(function () {
            $(".alert").alert('close');
        }, 2000);
    }
    else {
        showConfirm(
            "Patient data has been updated. \nChanged fields: \n" + fields.join(', '),
            "success",
            function () {

                $.ajax({
                    url: "/modify_patient/" + oldPatient.id,
                    type: 'POST',
                    data: formData,
                    contentType: 'application/json',
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        showAlert(response.message, "success");
                        console.log(response);
                    },
                    error: function (response) {
                        alert('An error occurred. Please try again.');
                    }
                });
            })
    }
}