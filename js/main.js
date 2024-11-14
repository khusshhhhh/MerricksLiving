/*---------------------------------------------------------
*	Author:			Travolgi
*	Theme:			BuildXpert
*	Version:			1.0.0
*	Created: 		02/08/2024
*	Last update:	02/08/2024
---------------------------------------------------------*/

/*--------------------------------------------------------
*	HELPER FUNCTIONS
--------------------------------------------------------*/
const getElement = (selector) => document.querySelector(selector);

const getAllElements = (selector) => document.querySelectorAll(selector);

const changeAttribute = (target, dataAttribute, val = true) =>
  target.setAttribute(dataAttribute, val);

const toggleClass = (target, toggleClass) => {
  target.classList.toggle(toggleClass);
};

const changeClass = (target, removeClass, addClass) => {
  target.classList.remove(removeClass);
  target.classList.add(addClass);
};

/*--------------------------------------------------------
*	PRELOAD
--------------------------------------------------------*/
(() => {
  if (window.addEventListener) {
    window.addEventListener(
      "load",
      () => (getElement("#preload").style.display = "none"),
      false
    );
  } else {
    window.attachEvent(
      "onload",
      () => (getElement("#preload").style.display = "none")
    );
  }
})();

/*--------------------------------------------------------
*	NAVBAR
--------------------------------------------------------*/
const header = getElement("header"),
  navToggle = getElement(".mobile-nav-toggle"),
  nav = getElement("#navbar"),
  subMenuLi = getAllElements(".has-submenu"),
  searchBtns = getAllElements("#search-btn, #search-btn-close"),
  searchForm = getElement("#search-form");

const openNavBar = (val = true) => {
  changeAttribute(nav, "data-visible", val);
  changeAttribute(navToggle, "aria-expanded", val);
};

navToggle.addEventListener("click", () => {
  const visible = nav.getAttribute("data-visible");
  if (visible === "false") {
    openNavBar();
  } else {
    openNavBar(false);
  }
});

if (subMenuLi) {
  subMenuLi.forEach((li) => {
    li.addEventListener("click", () => {
      subMenuLi.forEach((item) => {
        if (item !== li) {
          item.classList.remove("open");
        }
      });

      const liActive = li.nodeName === "I" ? li.parentNode : li;
      liActive.classList.toggle("open");
    });
  });
}

if (searchBtns) {
  searchBtns.forEach((btn) => {
    btn.addEventListener("click", () => toggleClass(searchForm, "open"));
  });
}

document.addEventListener("click", (e) => {
  if (!header.contains(e.target)) {
    openNavBar(false);
    subMenuLi.forEach((li) => li.classList.remove("open"));
  }
});

window.addEventListener("scroll", () =>
  header.classList.toggle("full-w", window.scrollY >= 100)
);

/*--------------------------------------------------------
*	HERO
--------------------------------------------------------*/
const heroSlider = getElement(".hero-slider");

if (heroSlider) {
  const heroImage = getElement(".hero-slide"),
    slides = heroImage.querySelectorAll("li"),
    heroBtnPrev = getElement("#hero-btn-prev"),
    heroBtnNext = getElement("#hero-btn-next");

  let curSlide = 1;
  let isTransitioning = false;

  const showSlide = (slide) => {
    slides.forEach((item, index) => {
      item.classList.remove("active", "previous");
      if (index + 1 === slide) {
        item.classList.add("active");
      }
      if (index + 1 === curSlide) {
        item.classList.add("previous");
      }
    });
  };

  const transitionSlide = (target) => {
    if (!isTransitioning) {
      isTransitioning = true;
      showSlide(target);
      curSlide = target;
      setTimeout(() => {
        isTransitioning = false;
      }, 800);
    }
  };

  const changeSlide = (target) => {
    transitionSlide(target);
  };

  setInterval(() => {
    const nextSlide = curSlide >= slides.length ? 1 : curSlide + 1;
    transitionSlide(nextSlide);
  }, 8000);

  heroBtnPrev.addEventListener("click", () => {
    const prevSlide = curSlide <= 1 ? slides.length : curSlide - 1;
    changeSlide(prevSlide);
  });

  heroBtnNext.addEventListener("click", () => {
    const nextSlide = curSlide >= slides.length ? 1 : curSlide + 1;
    changeSlide(nextSlide);
  });
}

/*--------------------------------------------------------
*	FILTERS 
--------------------------------------------------------*/
const filters = getAllElements("#filter-list li"),
  products = getAllElements("#product-grid .project");

if (filters) {
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");

      const filterValue = filter.getAttribute("data-filter");

      products.forEach((product) => {
        if (filterValue === "all") {
          product.classList.remove("hidden");
        } else {
          if (product.classList.contains(filterValue)) {
            product.classList.remove("hidden");
          } else {
            product.classList.add("hidden");
          }
        }
      });
    });
  });
}

/*--------------------------------------------------------
*	CAROUSELS 
--------------------------------------------------------*/
const carouselsInline = getAllElements(".carousel-inline");

if (carouselsInline) {
  carouselsInline.forEach((carousel) => {
    let scrollAmount = 0;

    function autoScroll() {
      scrollAmount += 1;
      if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
        scrollAmount = 0;
      }
      carousel.scrollLeft = scrollAmount;
      requestAnimationFrame(autoScroll);
    }

    autoScroll();
  });
}

/*--------------------------------------------------------
*	FAQ
--------------------------------------------------------*/
const faqs = getAllElements(".faq"),
  dataFaq = "data-faq-opened";

const toggleFaq = (e) => {
  const currentFaq = e.target.parentNode,
    iconFaq = currentFaq.querySelector("button i"),
    visible = currentFaq.getAttribute(dataFaq);

  faqs.forEach((faq) => {
    changeAttribute(faq, dataFaq, false);
    changeClass(
      faq.querySelector("button i"),
      "lnr-chevron-up",
      "lnr-chevron-down"
    );
  });

  if (visible === "false") {
    changeAttribute(currentFaq, dataFaq);
    changeClass(iconFaq, "lnr-chevron-down", "lnr-chevron-up");
  } else {
    changeAttribute(currentFaq, dataFaq, false);
    changeClass(iconFaq, "lnr-chevron-up", "lnr-chevron-down");
  }
};

if (faqs) {
  faqs.forEach((faq) => faq.addEventListener("click", toggleFaq));
}

/*--------------------------------------------------------
*	FOOTER 
--------------------------------------------------------*/
getElement("#thisYear").innerHTML = new Date().getFullYear();

const main = getElement("main"),
  footer = getElement("footer");

main.style.marginBottom = footer + "px";

function updateFooterHeight() {
  let footerHeight = footer.offsetHeight;
  main.style.marginBottom = footerHeight + "px";
}

updateFooterHeight();

window.addEventListener("resize", updateFooterHeight);

/*--------------------------------------------------------
*	SCROOL NAV AND GO TO TOP BUTTON
--------------------------------------------------------*/
const goTop = getElement("#goTop");

window.onscroll = () => {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    goTop.style.display = "grid";
  } else {
    goTop.style.display = "none";
  }
};

goTop.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

/*--------------------------------------------------------
*	AOS INIT
--------------------------------------------------------*/
AOS.init({
  duration: 500,
  easing: "ease-in-sine",
});

/*------------------Contact---------------*/

var clContactForm = function () {
  $("#contactForm").validate({
    submitHandler: function (form) {
      var sLoader = $(".submit-loader");

      $.ajax({
        type: "POST",
        url: "./contactForm.php", // Ensure this matches the backend handler
        data: $(form).serialize(),
        beforeSend: function () {
          sLoader.slideDown("slow"); // Show loader
        },
        success: function (response) {
          console.log("Response: ", response);

          // Handle success
          if (response.trim() === "success") {
            sLoader.slideUp("slow"); // Hide loader
            $(".message-warning").fadeOut();
            $("#contactForm").fadeOut(); // Hide the form
            $(".message-success").fadeIn(); // Show success message
          } else {
            // Handle server response errors
            sLoader.slideUp("slow");
            $(".message-warning").html(response); // Display response error
            $(".message-warning").slideDown("slow");
          }
        },
        error: function (xhr, status, error) {
          console.error("AJAX Error: ", error);

          // Handle AJAX errors
          sLoader.slideUp("slow");
          $(".message-warning").html("Something went wrong. Please try again.");
          $(".message-warning").slideDown("slow");
        },
      });
    },
  });
};

// Initialize the function when the document is ready
$(document).ready(function () {
  clContactForm();
});
