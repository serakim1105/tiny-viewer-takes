$(document).ready(function () {
  let searchForm = $("#searchForm"),
    searchTermInput = $("#search_term"),
    searchKeywordInput = $("#search_keyword"),
    channelList = $("#channelList"),
    addChannelForm = $("#addChannelForm"),
    addReviewForm = $("#addReviewForm");

  $("#addChannelForm").submit(function (event) {
    event.preventDefault();
    if (validateAddChannelForm()) {
      const formData = {
        channelTitle: $("#channelTitle").val(),
        channelOwnerName: $("#channelOwnerName").val(),
        channelDescription: $("#channelDescription").val(),
        channelWebsite: $("#channelWebsite").val(),
        keywords: $("#keywords")
          .val()
          .split(",")
          .map((kw) => kw.trim()),
        categories: $("#categories")
          .val()
          .split(",")
          .map((cat) => cat.trim()),
        startingAge: parseInt($("#startingAge").val(), 10),
      };

      $.ajax({
        url: "/channels",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
          alert("Channel added successfully.");
          window.location.href = "/channels";
        },
        error: function (xhr) {
          let errorMessage = xhr.responseText || "An unknown error occurred.";
          if (xhr.status === 401) {
            errorMessage = "You are not logged in/unauthorized.";
            window.location.href = "/login";
          }
          $("#errorDisplay").text(errorMessage).show();
        },
      });
    } else {
      $("#errorDisplay").text("Please fill all required fields correctly.");
    }
  });

  searchForm.submit(function (event) {
    event.preventDefault();
    let searchQuery = searchTermInput.val();
    if (!searchQuery.trim()) {
      alert("Your search input must not be empty or made of just spaces");
      return;
    }

    $.ajax({
      method: "GET",
      url: `/channels/search?search_term=${encodeURIComponent(searchQuery)}`,
      dataType: "json",
      success: function (data) {
        channelList.empty();
        if (data.length > 0) {
          data.forEach(function (channel) {
            const link = $(
              '<a href="javascript:void(0);" data-id="' + channel._id + '">'
            ).text(channel.channelTitle);
            const listItem = $("<li>").append(link);
            channelList.append(listItem);
          });
          bindEventsToChannelItem();
        } else {
          channelList.append($("<li>").text("No channels found."));
        }
      },
      error: function () {
        alert("Error searching channels.");
      },
    });
  });

  $("#searchKeywordForm").submit(function (event) {
    event.preventDefault();
    let searchQuery = searchKeywordInput.val();
    if (!searchQuery.trim()) {
      alert("Please enter a keyword to search.");
      return;
    }

    $.ajax({
      method: "GET",
      url: `/channels/searchKeyword?search_keywords=${encodeURIComponent(
        searchQuery
      )}`,
      dataType: "json",
      success: function (data) {
        channelList.empty();
        if (data.length > 0) {
          data.forEach(function (channel) {
            const link = $(
              '<a href="javascript:void(0);" data-id="' + channel._id + '">'
            ).text(channel.channelTitle);
            const listItem = $("<li>").append(link);
            channelList.append(listItem);
          });
          bindEventsToChannelItem();
        } else {
          channelList.append($("<li>").text("No channels found."));
        }
      },
      error: function () {
        alert("Error searching channels by keyword.");
      },
    });
  });

  $("#addReviewForm").submit(function (event) {
    event.preventDefault(); // Prevent the default form submission

    let errorMessages = [];
    const reviewTitle = $("#reviewTitle").val().trim();
    const reviewDescription = $("#reviewDescription").val().trim();
    const reviewRating = parseFloat($("#reviewRating").val().trim());
    let isValid = true;

    // Validate Review Title
    if (!reviewTitle) {
      errorMessages.push("Review title cannot be empty.");
      isValid = false;
    }

    // Validate Review Description
    if (!reviewDescription) {
      errorMessages.push("Review description cannot be empty.");
      isValid = false;
    }

    // Validate Review Rating
    if (isNaN(reviewRating) || reviewRating < 1 || reviewRating > 5) {
      errorMessages.push("Rating must be a number between 1 and 5.");
      isValid = false;
    }

    // Display errors or submit the form
    if (!isValid) {
      $("#addReviewError").html(errorMessages.join("<br>")).show();
    } else {
      // If all validations pass, submit the form programmatically
      this.submit();
    }
  });

  function validateAddChannelForm() {
    return $("#addChannelForm")[0].checkValidity();
  }

  function bindEventsToChannelItem() {
    channelList.on("click", "a", function (event) {
      event.preventDefault();
      let channelId = $(this).data("id");
      window.location.href = `http://localhost:3000/channels/${channelId}`;
    });
  }
});

async function removeReview(id) {
  $.ajax({
    url: `/review/${id}`,
    method: "DELETE",
    success: function () {
      alert("Review removed successfully!");
      window.location.reload();
    },
    error: function (xhr) {
      console.log("Error received:", xhr.responseText);
      let errorMessage = "An unknown error occurred.";

      if (xhr.status === 401) {
        errorMessage = "You are not logged in/unauthorized.";
        alert(errorMessage);
        window.location.href = "/login";
      } else if (xhr.status === 400) {
        errorMessage = xhr.responseText;
        alert(errorMessage);
      }
      $("#reviewError").text(errorMessage).show();
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  function displayErrorMsg(errors) {
    const errorMsg = document.getElementById("error-message");
    errorMsg.innerHTML = "";
    errors.forEach((error) => {
      const list = document.createElement("li");
      list.textContent = error;
      errorMsg.appendChild(list);
    });
  }
  let registerationForm = document.getElementById("registration-form");
  let loginForm = document.getElementById("login-form");
  if (registerationForm) {
    registerationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let firstName = document.getElementById("firstNameInput").value;
      let lastName = document.getElementById("lastNameInput").value;
      let emailAddress = document.getElementById("emailAddressInput").value;
      let password = document.getElementById("passwordInput").value;
      let confirmPassword = document.getElementById(
        "confirmPasswordInput"
      ).value;
      //error handling
      let errorMsg = [];
      if (
        !firstName ||
        !lastName ||
        !emailAddress ||
        !password ||
        !confirmPassword
      ) {
        errorMsg.push("All fields need to be supplied");
      }
      // validations for input
      firstName = firstName.trim();
      lastName = lastName.trim();
      emailAddress = emailAddress.trim();
      password = password.trim();
      confirmPassword = confirmPassword.trim();
      if (typeof firstName !== "string" || typeof lastName !== "string") {
        errorMsg.push("Name need to be in string");
      }
      if (password !== confirmPassword) {
        errorMsg.push("Password does not match");
      }
      const pattern =
        /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      emailAddress = emailAddress.toLowerCase();
      if (typeof emailAddress !== "string" || !pattern.test(emailAddress)) {
        errorMsg.push("Email address is invalid.");
      }
      if (errorMsg.length > 0) {
        displayErrorMsg(errorMsg);
      } else {
        registerationForm.submit();
      }
    });
  }
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let emailAddress = document.getElementById("emailAddressInput").value;
      let password = document.getElementById("passwordInput").value;
      //error handling
      let errorMsg = [];
      if (!emailAddress || !password) {
        errorMsg.push("All fields need to be supplied");
      }
      // validations for input
      //email validation
      if (typeof emailAddress !== "string") {
        errorMsg.push("Email address need to be in string.");
      }
      emailAddress = emailAddress.trim();
      if (emailAddress.length === 0) {
        errorMsg.push(
          "Email address cannot be empty string or string with just spaces."
        );
      }
      const pattern =
        /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      emailAddress = emailAddress.toLowerCase();
      if (!pattern.test(emailAddress)) {
        errorMsg.push("Email address is invalid.");
      }
      //password validation
      if (typeof password !== "string") {
        errorMsg.push("Email address need to be in string.");
      }
      password = password.trim();
      if (password.length === 0) {
        errorMsg.push(
          "Password cannot be empty string or string with just spaces."
        );
      }
      if (errorMsg.length > 0) {
        displayErrorMsg(errorMsg);
      } else {
        loginForm.submit();
      }
    });
  }

  displayErrorMsg;
});
