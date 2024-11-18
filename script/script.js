let slideIndex = 0;
const slides = document.querySelector(".slides");
const dots = document.querySelectorAll(".dot");

function nextSlide() {
  slideIndex = (slideIndex + 1) % 3;
  updateSlide();
}

function prevSlide() {
  slideIndex = (slideIndex - 1 + 3) % 3;
  updateSlide();
}

function currentSlide(n) {
  slideIndex = n - 1;
  updateSlide();
}

function updateSlide() {
  slides.style.transform = `translateX(-${(slideIndex * 100) / 3}%)`;
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === slideIndex);
  });
}

setInterval(nextSlide, 5000);

function openUploadModal() {
  document.getElementById("upload-modal").style.display = "block";
}

function closeUploadModal() {
  document.getElementById("upload-modal").style.display = "none";
}

function uploadImage() {
  const fileInput = document.getElementById("image-upload");
  const commentInput = document.getElementById("comment");
  const recentlyPosted = document.getElementById("recently-posted");

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const imageSrc = e.target.result;

      const newImage = document.createElement("div");
      newImage.innerHTML = `
        <div class="image-item">
          <img src="${imageSrc}" alt="Uploaded Outfit" />
          <p>${commentInput.value}</p>
        </div>
      `;

      recentlyPosted.appendChild(newImage);
      closeUploadModal();
      fileInput.value = "";
      commentInput.value = "";
    };

    reader.readAsDataURL(file);
  }
}

const menu_btn = document.querySelector(".hamburger");
const mobile_menu = document.querySelector(".mobile-nav");
menu_btn.addEventListener("click", function () {
  menu_btn.classList.toggle("is-active");
  mobile_menu.classList.toggle("is-active");
});


const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("caption");


function openModal(imageSrc, description) {
  modal.style.display = "block";
  modalImg.src = imageSrc;
  captionText.innerHTML = description;
}

function closeModal() {
  modal.style.display = "none";
}

const images = document.querySelectorAll("#recently-posted img");
images.forEach((img) => {
  img.addEventListener("click", function () {
    const description = img.alt; 
    openModal(img.src, description);
  });
});

modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});
