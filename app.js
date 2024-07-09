const API_URL = "https://api.github.com/users/"

const form = document.getElementById("form")
const search = document.getElementById("search")
const main = document.getElementById("main")

async function getUser(username){
    try {
        const { data } = await axios(API_URL + username)
        createUserCard(data)        
        getRepos(username)
    } catch (err) {
        if (err.response.status == 404) {
        
        createErrorCard("Üzgünüz aradığın kullanıcı adı doğru değil :) ")
        }
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if (user) {
        getUser(user)

        search.value = ''
    }
})

function createUserCard(user) {
    const userName = user.name || user.login
    const userBio = user.bio ? `<p> ${user.bio} </p>`: ' '

    const cardHTML = `
        <div class="card">
            <img 
            class="user-image" 
            src=${user.avatar_url}
            alt=${user.name}
            >
            <div class="user-info">
                <div class="user-name">
                    <h2>${userName}</h2>
                    <small>@${user.login}</small>
                </div>
            </div>

            <p>
            ${userBio}
            </p>
            <ul>
                <li>
                    <i class="fa-solid fa-user-group"></i>${user.followers}Followers
                </li>
                <li> ${user.following} Following</li>
                <li><i class="fa-solid fa-bookmark"></i> ${user.public_repos} Repository
                </li>
            </ul>
            <div class="repos" id="repos">
            </div>
        </div>

    `
    main.innerHTML = cardHTML
}

function createErrorCard(msg) {
    const cardErrorHTML = `
    <div class="card">
    <h2> ${msg} </h2>
    </div>
    `

    main.innerHTML = cardErrorHTML
}

async function getRepos(username) {
    try {
        const { data } = await axios(API_URL + username + "/repos")
        addReposToCard(data)
    } catch (err) {
        createErrorCard("üzgünüm repoları çekerken hata oluştu :( ")
    }
}

function addReposToCard(repos){
    const reposEl = document.getElementById("repos")

    repos.slice(0, 3).forEach((repo) => {
        const reposLink = document.createElement('a')
        reposLink.href = repo.html_url
        reposLink.target = "_blank"
        reposLink.innerHTML = ` <i class="fa-solid fa-book-bookmark"></i> ${repo.name}`

        reposEl.appendChild(reposLink)
    })
}