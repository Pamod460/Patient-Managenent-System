$(document).ready(function () {
  route()
  $.ajax({
    url: "/has_users",
    method: "GET",
    success: function (response) {
      console.log(response);
      if (response.has_users) {
        $("#btnSignup").hide();
      } else {
        $("#btnSignup").show();
      }
    },
    error: function (xhr, status, error) {
      console.error(error);
      alert('An error occurred while processing your request. Please try again.');
    }
  });
});

var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}

function route() {
  $('a').click(function (e) {
    // e.preventDefault();
    route = e.target.href.split(e.target.baseURI)[1]
    url ="app/template/index.html"
    $('#view').load(url);
  });
} 

function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  var mainContent = document.getElementById('main-content');
  var toggleBtn = document.querySelector('.sidebar-toggle');

  sidebar.classList.toggle('closed');
  mainContent.classList.toggle('closed');
  toggleBtn.classList.toggle('closed');
}