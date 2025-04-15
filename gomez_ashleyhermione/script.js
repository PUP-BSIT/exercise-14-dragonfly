document.addEventListener("DOMContentLoaded", () => {
  initializeCommentSection();
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
      searchBtn.addEventListener("click", searchCountry);
  }
});

function initializeCommentSection() {
  const commentBtn = document.getElementById("submit_comment");
  const userName = document.getElementById("name");
  const userComment = document.getElementById("comment");
  const commentContainer = document.getElementById("comments_section");

  if (!commentBtn || !userName || !userComment || !commentContainer) return;

  commentBtn.disabled = true;

  const sortBtn = document.createElement("button");
  sortBtn.textContent = "Sort by Date ↑";
  sortBtn.id = "sort_button";

  let ascendingOrder = true;
  const storedComments = [
      {
          name: "Kevin Barcelos",
          text: "Wow, very artistic goals. Please teach me how to design my"
           + "website. I would like to learn from you.",
          timestamp: new Date(2025, 2, 19, 9, 0, 0),
      },
      {
          name: "Angelica Joy Uy",
          text: "I'm excited to see your progress in coding and design." 
          + "Keep it up!",
          timestamp: new Date(2025, 2, 19, 10, 0, 0),
      },
      {
          name: "Gener Andaya Jr.",
          text: "These are great goals! Keep pushing your creativity and"
          + "sharpening your skills—you're on the path to excellence!",
          timestamp: new Date(2025, 2, 19, 11, 0, 0),
      },
  ];

  function updateButtonState() {
      commentBtn.disabled = !(
          userName.value.trim() && userComment.value.trim()
      );
  }

  function addNewComment(event) {
      event.preventDefault();
      const nameValue = userName.value.trim();
      const commentValue = userComment.value.trim();

      if (nameValue && commentValue) {
          storedComments.push({
              name: nameValue,
              text: commentValue,
              timestamp: new Date(),
          });
          userName.value = "";
          userComment.value = "";
          updateButtonState();
          displayComments();
      }
  }

  function formatTimestamp(date) {
      return date.toLocaleString();
  }

  function displayComments() {
      commentContainer.innerHTML = "";
      const sorted = [...storedComments].sort((a, b) =>
          ascendingOrder
              ? a.timestamp - b.timestamp
              : b.timestamp - a.timestamp
      );

      sorted.forEach((c) => {
          const commentDiv = document.createElement("div");
          commentDiv.classList.add("comment");

          const author = document.createElement("h3");
          author.textContent = c.name;

          const message = document.createElement("p");
          message.textContent = c.text;

          const time = document.createElement("p");
          time.classList.add("comment-timestamp");
          time.textContent = formatTimestamp(c.timestamp);

          commentDiv.appendChild(author);
          commentDiv.appendChild(message);
          commentDiv.appendChild(time);
          commentContainer.appendChild(commentDiv);
      });
  }

  function toggleSortOrder() {
      ascendingOrder = !ascendingOrder;
      sortBtn.textContent = `Sort by Date ${ascendingOrder ? "↑" : "↓"}`;
      displayComments();
  }

  userName.addEventListener("input", updateButtonState);
  userComment.addEventListener("input", updateButtonState);
  commentBtn.addEventListener("click", addNewComment);
  sortBtn.addEventListener("click", toggleSortOrder);

  commentContainer.parentElement.insertBefore(sortBtn, commentContainer);
  displayComments();
}

async function searchCountry() {
  const countryInput = document.getElementById("countryInput").value.trim();
  const result = document.getElementById("result");
  const regionBox = document.getElementById("region");

  result.innerHTML = "";
  regionBox.innerHTML = "";

  if (!countryInput) {
      alert("Please enter a country name.");
      return;
  }

  try {
      const res = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(
              countryInput
          )}`
      );
      if (!res.ok) throw new Error("Country not found!");
      const data = await res.json();
      const country = data[0];

      const name = country.name.common;
      const region = country.region;
      const capital = country.capital?.[0] || "N/A";
      const languages = country.languages
          ? Object.values(country.languages).join(", ")
          : "N/A";
      const currency = country.currencies
          ? Object.values(country.currencies)[0].name
          : "N/A";
      const flag = country.flags.svg;

      let topPlaceHTML = "";
      if (name.toLowerCase() === "philippines") {
          topPlaceHTML = `<p><strong>Top Place to Visit:</strong> Palawan</p>`;
      }

      result.innerHTML = `
          <h2>${name}</h2>
          <p><strong>Capital:</strong> ${capital}</p>
          <p><strong>Languages:</strong> ${languages}</p>
          <p><strong>Currency:</strong> ${currency}</p>
          <p><strong>Region:</strong> ${region}</p>
          ${topPlaceHTML}
          <img src="${flag}" class="flag" alt="Flag of ${name}" />
      `;

      const regionRes = await fetch(
          `https://restcountries.com/v3.1/region/${encodeURIComponent(
              region
          )}`
      );
      if (!regionRes.ok) throw new Error("Failed to fetch region data.");
      const regionCountries = await regionRes.json();

      regionBox.innerHTML = `<h3>Other countries in ${region}:</h3>`;
      regionCountries.forEach((c) => {
          if (c.name.common.toLowerCase() !== name.toLowerCase()) {
              const el = document.createElement("span");
              el.classList.add("region-country");
              el.textContent = c.name.common;
              regionBox.appendChild(el);
          }
      });
  } catch (error) {
      result.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}