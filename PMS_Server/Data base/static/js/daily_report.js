$(document).ready(function () {
    $('#download-report').click(

        function () {
            var element = document.getElementById('report-container');
            var date=new Date();
            date = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay();
            var opt = {
                margin: 1,
                filename: 'daily_report_'+date+'.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            // New Promise-based usage:
            html2pdf().from(element).set(opt).save();
        });
    // Function to load the daily report data
    function loadDailyReport() {
        $.ajax({
            url: "get_daily_report",
            method: "GET",
            dataType: "json",
            success: function (response) {
                console.log(response);
                var reportBody = $('#report-body');
                reportBody.empty(); // Clear previous records

                if (response.records && response.records.length > 0) {
                    response.records.forEach(function (record) {
                        console.log(record.patient_name);
                        var row = $('<tr></tr>');
                        row.append('<td>' + record.patient_name + '</td>');
                        row.append('<td>' + record.charges+ '</td>');
                        reportBody.append(row);

                    });
                    var row2 = $('<tr></tr>');
                    row2.append('<td>Total</td>');
                    row2.append('<td>' + response.total[0].total + '</td>');
                    reportBody.append(row2);

                } else {
                    reportBody.append('<tr><td colspan="8">No records found for today.</td></tr>');
                }
            },
            error: function (xhr, status, error) {
                console.error(error);
                $('#report-body').empty().append('<tr><td colspan="8">An error occurred while loading the report. Please try again.</td></tr>');
            }
        });
    }

    // Load the daily report on page load
    loadDailyReport();
});