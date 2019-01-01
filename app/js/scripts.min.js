$(function() {
  /** hamburger */
  $(".hamburger").click(function() {
    $(".hamburger").toggleClass("change");
    $(".mobile-menu").slideToggle();
  });

  /** slider */
  $(".slider").slick({
    dots: true,
    arrows: false,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  });

  /** scroll to block */
  var $page = $("html, body");
  $(".example, .order-print, .order-print, .order-consultation-click").click(
    function() {
      $page.animate(
        {
          scrollTop: $(".calculate-order").offset().top - 150
        },
        400
      );
      return false;
    }
  );

  $(".order-call").click(function() {
    $page.animate(
      {
        scrollTop: $(".consulting").offset().top - 150
      },
      400
    );
    return false;
  });

  /** handler checkbox */
  let checkbox = false;
  Array.prototype.slice
    .call(document.querySelectorAll(".label-checkbox-1"))
    .map(node => {
      $(node).click(function() {
        checkbox = $(this).next()[0].checked;

        if ($(this).next()[0].checked) {
          $(".img-checkbox-1").attr("src", "images/svg/checkbox_active.svg");
        } else {
          $(".img-checkbox-1").attr("src", "images/svg/checkbox.svg");
        }
      });
    });

  let allFiles = [];
  let nameFile = "";

  $("input[type=file]").on("change", function() {
    const files = document.querySelector("#file").files;

    console.log(document.querySelector("#file").files);

  [file resume limit: ]

    const sizeFile = files[0].size;
    allFiles.push(files[0]);
    nameFile = files[0].name.slice(0, 10);

    if (allFiles.length > 6) {
      alert("Превышено максимальное число загружаемых файлов");
    } else {
      $(".attach-right").append(`
        <div class="attached">
          <img class="attached-file" src="images/file-append-jpeg.png" alt="" width="34" height="36">
          <p class="text">${nameFile}</p>
          <img data-id="${sizeFile}" class="close" src="images/close.png" alt="" width="11" height="11">
         </div>
      `);

      $(".close").click(function() {
        allFiles = allFiles.filter(
          item => +item.size !== +$(this).attr("data-id")
        );

        $(this)
          .parent()
          .remove();
      });
    }
  });

  /*** close thanks modal window ***/
  $(".thanks-close").click(() => {
    $(".thanks").fadeOut();
  });

  $("form").submit(function(e) {
    e.preventDefault();

    const name = $(this)
      .find("input[name=name]")
      .val();
    const phone = $(this)
      .find("input[name=phone]")
      .val();
    const email = $(this)
      .find("input[name=email]")
      .val();
    const comment = $(this)
      .find("input[name=comment]")
      .val();
    const nameForm = $(this).attr("name");

    let formData = new FormData();
    allFiles.map(file => {
      formData.append("files[]", file);
    });

    const data = {
      Имя: name,
      Телефон: phone,
      Емейл: email,
      Комментарий: comment || "Не заполнено",
      "Нет технического задания": checkbox ? "Нету" : "Не указано",
      "Имя формы": nameForm,
      formData
    };

    console.log(data);

    /*** send data to server */
    $.ajax({
      type: "GET",
      url: "/",
      contentType: "multipart/form-data",
      data,
      contentType: false,
      cache: false,
      processData: false,
      success: () => {
        $(this)
          .find("input")
          .val("");

        allFiles = [];

        checkbox = false;

        $(".img-checkbox-1").attr("src", "images/svg/checkbox.svg");
        $(".thanks")
          .fadeIn()
          .css("display", "flex");
      }
    });
  });
});
