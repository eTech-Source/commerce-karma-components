// Fetch calls for data

const get = async (id, filters, url) => {

    const encodedFilters = btoa (JSON.stringify (filters))

    const rawResponse = await fetch (url, {headers: {
        "id": id,
        "filters": encodedFilters
    }})

    const response = await rawResponse.json()
    
    return response
}

const post = async (createData, url) => {
    const rawResponse = await fetch (url, {body: JSON.stringify (createData)})
    const response = await rawResponse.json()

    return response
}


// Inject data into correct divs

const injectReviews = async () => {
    const data = await get ("655643cd1c82275babfaf859", {title: "Thank you"}, "http://localhost:3000/api/reviews/add")

    const reviews = data.reviews

    const reviewsContainer = document.getElementById("CK-reviews")

    let injectHtml = ""

    for (let i = 0; i < reviews.length; i++) {
        injectHtml += `
        
        <div class="CK-review">
            <h1 class="CK-review-title">${reviews[i].title}</h1>
            <b>${reviews[i].stars}</b>
            <p class="CK-search-text">${reviews[i].text}</p>
        </div>`
    }

    reviewsContainer.innerHTML += injectHtml
}

const injectUser = async () => {
    const data  = await get ("", {}, "http://localhost:3000/api/user")
    const users = data.user

    const usersContainer = document.getElementById("CK-users")

    let injectHtml = ""

    for (let i = 0; i < users.length; i++) {
        injectHtml += `
        
        <div class="CK-user">
            <h1 class="CK-user-name">${users[i].name}</h1>
        </div>`
    }

    usersContainer.innerHTML += injectHtml
}

const injectSearch = async () => {
    const searchContainer = document.getElementById("CK-search")
    searchContainer.innerHTML = `
        <input type="text" placeholder="Search for anyone" id="CK-search-id" class="CK-search"/>
        <button id="CK-search-btn">Search</button>
    `

    const searchBox = document.getElementById("CK-search-id")
    const searchBtn = document.getElementById("CK-search-btn")

    let users = []

    searchBtn.addEventListener ("click", async () => {
       users =  await populateSearch (searchBox.value)
       console.log(users)
    })

    const usersContainer = document.getElementById("CK-users")

    let injectHtml = ""

    for (let i = 0; i < users.length; i++) {
        injectHtml += `
        
        <div class="CK-user">
            <h1 class="CK-user-name">${users[i].name}</h1>
        </div>`
    }

    usersContainer.innerHTML = injectHtml
}


// Populate some injected items with interactivity

const populateSearch = async (name) => {
    const data = await get ("", {name: name}, "http://localhost:3000/api/user")
    return data.user
}



//Authentication: DO NOT MODIFY
const url = window.location.href
const jwt = url.match (/\[([^)]+)\]/)

if (jwt) {
    document.cookie = `CK-jwt=${jwt}; max-age=2592000;`
}