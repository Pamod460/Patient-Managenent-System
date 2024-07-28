

$(document).ready(function () {
    $('#alert').hide()
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true
    });

    loadAllUsers((error, response) => {
        if (error) {
            console.error('An error occurred:', error);
        } else {
            console.log(response);
            loadTable(response)
        }
    });


    $('#txtSearchDOB').on('change input', function () {
        birthday = $(this).val();
        // console.log(birthday)
        $.ajax({
            url: "/search_patient",
            method: "POST",
            data: JSON.stringify({
                birthday: birthday
            }),
            contentType: 'application/json',
            success: function (response) {
                loadTable(response)
            }
            ,
            error: function (xhr, status, error) {
                console.error(error);
                // alert('An error occurred while processing your request. Please try again.');
            }

        })
    })

    $(document).on('click', '.btnAddRepo', function () {
        var patientId = $(this).data('patient-id');
        window.location.href = "add_record/" + patientId;
    });
    $(document).on('click', '.btnDelPatient', function () {
        var patientId = $(this).data('patient-id');
        if (patientId) {
            msg = "Are you sure you want to delete this patient?"
            loadAllUsers((error, response) => {
                if (error) {
                    console.error('An error occurred:', error);
                } else {
                    getName(patientId, response.patients).then(name => {
                        var msg = "Are you sure you want to delete " + name + "?";
                        customConfirm(msg).then((confirmed) => {
                            console.log(confirmed);
                            if (confirmed) {
                                $.ajax({
                                    url: "delete_patient/" + patientId,
                                    method: "DELETE",
                                    success: function (response) {
                                        $('#alert').show()
                                        $('#alertMessage').html(response.message)
                                        setTimeout(() => { $('#alert').hide() }, 2000);
                                        loadAllUsers((error, response) => {
                                            if (error) {
                                                console.error('An error occurred:', error);
                                            } else {
                                                console.log(response);
                                                loadTable(response)
                                            }
                                        });
                                    }
                                    ,
                                    error: function (xhr, status, error) {
                                        console.error(error);
                                        // alert('An error occurred while processing your request. Please try again.');
                                    }

                                })
                            }
                        })
                    })
                }
            });


        }
    });
    $(document).on('click', '.btnUpPatient', function () {
        var patientId = $(this).data('patient-id');
        location.href = "/update_patient/" + patientId
    }
    )

});

function updatePatient(patientId, updateData) {
    // $.ajax({
    //     url: "/update_patient/" + patientId,
    //     method: "POST",
    //     contentType: "application/json",
    //     data: JSON.stringify(updateData),
    //     success: function (response) {
    //         $('#alert').show();
    //         $('#alertMessage').html(response.message);
    //         setTimeout(function () {
    //             $('#alert').hide();
    //         }, 2000);
    //     },
    //     error: function (xhr, status, error) {
    //         console.error(error);
    //         $('#alert').show();
    //         $('#alertMessage').html("An error occurred while updating the patient.");
    //         setTimeout(function () {
    //             $('#alert').hide();
    //         }, 2000);
    //     }
    // });
}



function getName(patientId, patients) {
    return new Promise((resolve, reject) => {
        const patient = patients.find(patient => patient.id === patientId);
        if (patient) {
            resolve(patient.name);
        } else {
            reject("Patient not found");
        }
    });
}




function loadAllUsers(callback) {
    $.ajax({
        url: "/users",
        method: "GET",
        success: function (response) {
            callback(null, response);
        },
        error: function (xhr, status, error) {
            console.error(error);
            callback(error);
        }
    });
}
function loadDate(dt) {
    var date = new Date(dt);
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}
function loadTable(response) {
    console.log(response);
    var results = $('#results');
    results.empty();

    if (response.patients && response.patients.length > 0) {
        var table = $('<table class="table table-striped"></table>');
        var thead = $('<thead><tr><th>Name</th><th>Birthday</th><th>Action</th></tr></thead>');
        table.append(thead);

        var tbody = $('<tbody></tbody>');
        response.patients.forEach(function (patient) {

            var row = $('<tr></tr>');
            // row.append('<td>' + patient[0] + '</td>');
            row.append('<td>' + patient.name + '</td>');
            row.append('<td>' + loadDate(patient.birthday) + '</td>');
            row.append('<td><button type="button" class="btn btn-info btnAddRepo" data-patient-id="' + patient.id + '">Add Record</button></td>');
            row.append('<td><button type="button" class="btn btn-danger btnDelPatient" data-patient-id="' + patient.id + '">Delete Patient</button></td>');
            row.append('<td><button type="button" class="btn btn-warning btnUpPatient" data-patient-id="' + patient.id + '">Update Patient Details</button></td>'); tbody.append(row);
        });
        table.append(tbody);
        results.append(table);
    } else {
        results.append('<p>No patients found with that birthday.</p>');
    }
}

function customConfirm(data) {
    return new Promise((resolve, reject) => {
        console.log("Confirm", data);
        $('#customConfirm').show();
        $('#message').html(data)
        $('#confirmYes').off('click').on('click', function () {
            $('#customConfirm').hide();
            resolve(true);
        });

        $('#confirmNo').off('click').on('click', function () {
            $('#customConfirm').hide();
            resolve(false);
        });
    });
}