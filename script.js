const commerceKarmaUrl = "https://commerce-karma.vercel.app";

// Must be defined first

const injectSignIn = () => {
  const signInContainer = document.getElementById("CK-signin");
  signInContainer.innerHTML = `
        <h1 id="CK-signin-heading">Please Sign In</h1>
        <p id="CK-signin-message">Sign in to Commerce Karam to rate your customers and view customer ratings.</p>
        <button id="CK-signin-btn"><a href="${commerceKarmaUrl}/sign-in?redirect_url=${window.location.href}" id="CK-signin-link">Sign In</a></button>
    `;
};

// Utils

const arrayToKeyValueObject = (arr) => {
  if (arr.length % 2 !== 0) {
    throw new Error("Array length must be even for key-value pairing.");
  }

  const resultObject = {};

  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    const value = arr[i + 1];
    resultObject[key] = value;
  }

  return resultObject;
};

const createStarElement = (src, alt) =>
  `<img src="${src}" alt="${alt}" height="40" class="star" />`;

const createStars = (count) => {
  let starsHtml = "";
  
  const fullStars = Math.floor(count);
  const halfStars = Math.round((count % 1) * 10) / 10;
  const emptyStars = 5 - fullStars - (halfStars > 0 ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    starsHtml += createStarElement(
      "/assets/full-star.png",
      "Rating star"
    );
  }

  if (halfStars > 0) {
    starsHtml += createStarElement(
      "/assets/half-star.png",
      "Rating half star"
    );
  }
  
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += createStarElement(
      "/assets/empty-star.png",
    );
  }
  
  return starsHtml;
};

// Get cookie

const readCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return "";
};

// Fetch calls for data

const get = async (id, filters, url) => {
  const encodedFilters = btoa(JSON.stringify(filters));

  // Required to complete any requests other than OPTIONS

  const authorization = readCookie("CK-jwt");

  const rawResponse = await fetch(url, {
    headers: {
      id: id,
      filters: encodedFilters,
      Authorization: authorization,
    },
  });

  const response = await rawResponse.json();

  return response;
};

const post = async (createData, url) => {
  // Required to complete any requests other than OPTIONS

  const authorization = readCookie("CK-jwt");

  const rawResponse = await fetch(url, {
    body: JSON.stringify({ body: createData }),
    method: "POST",
    headers: { Authorization: authorization },
  });
  const response = await rawResponse.json();

  return response;
};

// Inject data into correct divs

const injectReviews = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("CK-id");

  const data = await get(
    "",
    id ? { recipient: id } : null,
    `${commerceKarmaUrl}/api/reviews/add`
  );

  if (data.error) {
    return false;
  }

  const reviews = data.reviews;

  const reviewsContainer = document.getElementById("CK-reviews");

  let injectHtml = "";

  for (let i = 0; i < reviews.length; i++) {
    injectHtml += `
          
          <div class="CK-review">
              <h1 class="CK-review-title">${reviews[i].title}</h1>
              <b>${reviews[i].stars}</b>
              <p class="CK-review-text">${reviews[i].text}</p>
              <div id="CK-review-stars-${reviews[i]._id}">${createStars (reviews[i].stars)}</div>
          </div>`;
  }

  reviewsContainer.innerHTML += injectHtml;
};

const injectUser = async (link, filters) => {
  const urlParams = new URLSearchParams(window.location.search);

  if (!filters && urlParams) {
    for (let params of urlParams) {
      let paramsArray = [];
      params.forEach((param) => {
        paramsArray.push(param.replace("CK-", ""));
      });
      filters = arrayToKeyValueObject(paramsArray);
    }
  }

  const data = await get(
    "",
    filters ? filters : {},
    `${commerceKarmaUrl}/api/user`
  );

  console.log(data);

  if (data.error) {
    return false;
  }

  const users = data.user;

  const usersContainer = document.getElementById("CK-users");

  let injectHtml = "";

  for (let i = 0; i < users.length; i++) {
    injectHtml += `        
          <div class="CK-user">
             <a href="${link ? link : `/`}?CK-id=${
      users[i]._id
    }" class="CK-user-link">
                <h1 class="CK-user-name">${users[i].name}</h1>
                <div id="CK-user-stars-${users[i]._id}">${createStars (users[i].customerRating)}</div>
              </a>
          </div>`;
  }

  usersContainer.innerHTML = injectHtml;

};

const injectSearch = async () => {
  const searchContainer = document.getElementById("CK-search");
  searchContainer.innerHTML = `
          <input type="text" placeholder="Search for anyone" id="CK-search-bar"/>
          <select id="CK-search-options" name="search">
            <option value="name" class="CK-option">By name</option>
            <option value="email" class="CK-option">By email</option>
            <option value="phone" class="CK-option">By phone number</option>
          </select>
          <button id="CK-search-btn">Search</button>
      `;

  const searchBox = document.getElementById("CK-search-bar");
  const searchBtn = document.getElementById("CK-search-btn");
  const searchOptions = document.getElementById("CK-search-options");

  searchBtn.onclick = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(`CK-${searchOptions.value}`, searchBox.value);
    window.location.search = urlParams;
  };
};

// This is currently unavailable

const injectCreateReview = async () => {
  const createReviewContainer = document.getElementById("CK-create-review");
  createReviewContainer.innerHTML = `
    <button id="CK-add-review-btn">Add review</button>
  `;
  const createReviewBtn = document.getElementById("CK-add-review-btn");

  createReviewBtn.addEventListener("click", () => {
    createReviewContainer.innerHTML = `
        <form id="CK-create-review-form">
        <label class="CK-create-review-label">How many stars?</label>
        <select id="CK-create-review-stars">
          <option class="CK-create-review-option">1 star</option>
          <option class="CK-create-review-option">2 stars</option>
          <option class="CK-create-review-option">3 stars</option>
          <option class="CK-create-review-option">4 stars</option>
          <option class="CK-create-review-option" selected>
            5 stars
          </option>
        </select>
        <br />
        <label class="CK-create-review-label">What&apos;s your title?</label>
        <input
          class="CK-create-review-input"
          id="CK-create-review-title"
          name="title"
          placeholder="Great to work with!"
        />
        <br />
        <label>What do you want to say?</label>
        <br />
        <textarea
          name="review"
          placeholder="Write your review..."
          class="CK-create-review-input"
          id="CK-create-review-text"
        ></textarea>
        <br />
        <button
         id="CK-create-review-submit"
          aria-label="Send"
          type="submit"
        >
          Publish
        </button>
        </form>
    `;
    const publishBtn = document.getElementById("CK-create-review-submit");

    publishBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const stars = document.getElementById("CK-create-review-stars").value;
      const title = document.getElementById("CK-create-review-title").value;
      const text = document.getElementById("CK-create-review-text").value;
    });
  });
};

const injectCreateUser = (name, email, city) => {
  const createUserContainer = document.getElementById("CK-create-user");
  if (name && email && city) {
    createUserContainer.innerHTML = `
        <button id="CK-create-user-btn">Add to Commerce Karma</button>
      `;
    const createUserBtn = document.getElementById("CK-create-user-btn");
    createUserBtn.addEventListener("click", async () => {
      await post({ name, email, city }, `${commerceKarmaUrl}/api/user`);
    });
    return;
  }
  createUserContainer.innerHTML = `
      <form id="CK-create-user-form">
        <label>Name</label>
        <input class="CK-create-user-input" id="CK-name"/>
        <br />
        <label>Email</label>
        <input class="CK-create-user-input" id="CK-email"/>
        <br />
        <label>City</label>
        <input class="CK-create-user-input" id="CK-city"/>
        <button id="CK-submit-user-btn">Submit</button>
      </form>
    `;

  const nameInput = document.getElementById("CK-name");
  const emailInput = document.getElementById("CK-email");
  const cityInput = document.getElementById("CK-city");

  const submitBtn = document.getElementById("CK-submit-user-btn");
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await post(
      { name: nameInput.value, email: emailInput.value, city: cityInput.value },
      `${commerceKarmaUrl}/api/user`
    );
  });
};

const injectMoreInfo = () => {
  const infoContainer = document.getElementById("CK-info");
  infoContainer.innerHTML = `
    <p id="CK-info-text">For more actions go to the officail <a href="${commerceKarmaUrl}/app">Commerce Karma</a> website.</p>
  `;
};

// Authentication: DO NOT MODIFY

const url = window.location.href;
const jwt = url.match(/\[(.*?)\]/);

if (jwt) {
  document.cookie = `CK-jwt=${jwt[1]}; max-age=2592000;`;
}

const checkAuth = async (users, reviews) => {
  if (users == false || reviews == false) {
    injectSignIn();
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const reviews = await injectReviews();
  const users = await injectUser();
  injectSearch();
  injectCreateUser();
  injectMoreInfo();
  await checkAuth(users, reviews);
});

// Exports
export {injectReviews, injectSignIn, injectSearch, checkAuth}