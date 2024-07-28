$(document).ready(function () {
    $.ajax({
        url: "get_chart_data",
        method: "GET",
        success: function (data) {
            console.log(data);
            renderChart('patientCountChart', 'Daily Patient Count', data.patientCounts, data.labels);
            renderChart('incomeChart', 'Daily Income', data.income, data.labels);
        },
        error: function (xhr, status, error) {
            console.error(error);
            alert('An error occurred while fetching chart data. Please try again.');
        }
    });
});
function renderChart(chartId, label, data, labels) {
    var ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}