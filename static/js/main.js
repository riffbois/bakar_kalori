(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".sticky-top").addClass("shadow-sm").css("top", "0px");
    } else {
      $(".sticky-top").removeClass("shadow-sm").css("top", "-100px");
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000,
  });

  // Header carousel
  $(".header-carousel").owlCarousel({
    autoplay: false,
    animateOut: "fadeOutLeft",
    items: 1,
    dots: true,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: false,
    smartSpeed: 1000,
    center: true,
    dots: false,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
    },
  });
})(jQuery);

//navbar
document.addEventListener("DOMContentLoaded", function () {
  var navbarItems = document.querySelectorAll(".nav-item.nav-link");

  // Fungsi untuk menangani perubahan warna teks saat scroll
  function handleScroll() {
    var scrollPosition = window.scrollY;

    navbarItems.forEach(function (item) {
      var targetId = item.getAttribute("href");
      var targetSection = document.querySelector(targetId);

      if (
        targetSection &&
        targetSection.offsetTop <= scrollPosition &&
        targetSection.offsetTop + targetSection.offsetHeight > scrollPosition &&
        targetId !== "#prediksi" &&
        !item.classList.contains("active") // Tambahkan pengecualian untuk item "Metode"
      ) {
        // Tambahkan class active ke navbar item yang sesuai dengan halaman yang di-scroll
        navbarItems.forEach(function (nav) {
          nav.classList.remove("active");
        });
        item.classList.add("active");
      }
    });

    // Tambahan untuk menangani kondisi khusus #prediksi dan #metode
    var prediksiSection = document.querySelector("#prediksi");
    var metodeItem = document.querySelector('a[href="#metode"]');

    if (
      prediksiSection &&
      prediksiSection.offsetTop <= scrollPosition &&
      scrollPosition < prediksiSection.offsetTop + prediksiSection.offsetHeight
    ) {
      // Jika scroll berada di #prediksi, tetapkan item "Metode" sebagai aktif
      metodeItem.classList.remove("active"); // Hapus class active dari item "Metode"
    }
  }

  // Panggil fungsi handleScroll saat halaman di-scroll
  window.addEventListener("scroll", handleScroll);

  // Panggil handleScroll untuk pertama kali saat halaman dimuat
  handleScroll();
});

//Prediksi
document
  .getElementById("submitBtn")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Menghentikan pengiriman formulir yang standar

    const data = {
      Gender: document.getElementById("Gender").value,
      Age: document.getElementById("Age").value,
      Height: document.getElementById("Height").value,
      Weight: document.getElementById("Weight").value,
      Duration: document.getElementById("Duration").value,
      Heart_Rate: document.getElementById("Heart_Rate").value,
      Body_Temp: document.getElementById("Body_Temp").value,
    };

    fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Handle the response, such as updating the UI with the prediction
        if (data.prediction_text) {
          document.getElementById("predictionResult").innerText =
            data.prediction_text;
          $("#resultModal").modal("show"); // Tampilkan modal
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

//Reset form
document.addEventListener("DOMContentLoaded", (event) => {
  const closeModalButton = document.getElementById("closeModalButton");
  const form = document.getElementById("prediction-form");

  closeModalButton.addEventListener("click", () => {
    form.reset();
  });
});
