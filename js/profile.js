document.getElementById("backButton").addEventListener("click", function () {
  window.location.href = "../screens/homepage.html";
});

document.getElementById("outfits").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("createoutfit").classList.remove("active");
  document.getElementById("outfits").classList.add("active");
  document.querySelector(".create-outfit").style.display = "none";
  document.querySelector(".your-outfits").style.display = "block";
});

document.getElementById("createoutfit").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("outfits").classList.remove("active");
  document.getElementById("createoutfit").classList.add("active");
  document.querySelector(".your-outfits").style.display = "none";
  document.querySelector(".create-outfit").style.display = "block";
});

document.getElementById("outfitForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const outfitName = document.getElementById("outfitName").value;
  const outfitDescription = document.getElementById("outfitDescription").value;
  const outfitImage = document.getElementById("outfitImage").value;

  const outfitCard = document.createElement("div");
  outfitCard.classList.add("outfit-card");

  outfitCard.innerHTML = `
    <img src="${outfitImage}" alt="Outfit Image" class="outfit-img" />
  `;

  outfitCard
    .querySelector(".outfit-img")
    .addEventListener("click", function () {
      showPopup(outfitName, outfitDescription, outfitImage);
    });

  document.getElementById("createdContent").appendChild(outfitCard);
  document.getElementById("outfitForm").reset();
});

function showPopup(title, description, image) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
    <div class="popup-content">
      <span class="close-popup">&times;</span>
      <div class="popup-inner">
        <img src="${image}" alt="Popup Image" class="popup-image" />
        <div class="popup-text">
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  popup.querySelector(".close-popup").addEventListener("click", function () {
    document.body.removeChild(popup);
  });
}
