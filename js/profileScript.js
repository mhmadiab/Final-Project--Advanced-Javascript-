setUpNavBar()
getUser()
getPosts()

function getCurrentUserId(){
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get("userId")
    return userId

}

function getUser(){

    setUpNavBar()
    const userId = getCurrentUserId()
    axios.get(`${baseURL}/users/${userId}`)
    .then((response)=>{
        const user = response.data.data
        document.getElementById("header-image").src = user.profile_image
        document.getElementById("main-info-email").innerHTML = user.email
        document.getElementById("main-info-name").innerHTML = user.name
        document.getElementById("name-posts").innerHTML = `${user.name}'s `
        document.getElementById("main-info-username").innerHTML = user.username
        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comments-count").innerHTML = user.comments_count
    })
}


function getPosts(){
    setUpNavBar()
    const userId = getCurrentUserId()
    axios.get(`${baseURL}/users/${userId}/posts`)
    .then((response)=>{
      const posts = response.data.data
      document.getElementById("user-posts").innerHTML = ""

      posts.forEach(post => {
          let postTitle = ""
          if(post.title !=null){
              postTitle = post.title
          }
          let user = getCurrentUser()
            let isMyPost = user != null && post.author.id == user.id
            let editbuttonContent = ''
            let deletebuttonContent = ''
            if(isMyPost){
                editbuttonContent = `<button id="edit-post" class="btn btn-primary" 
                                        style="float: right" onclick="getPostDetails('${encodeURIComponent(JSON.stringify(post))}')" >
                                        edit📝
                                    </button>`
                deletebuttonContent = `<Button id="delete-post" class="btn btn-danger" 
                                        style="float: right; margin-right:10px;" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">
                                        delete🗑️
                                      </Button>`
            }
          let content =
          ` <div class="card shadow my-4" >
                      <div class="card-header">
                        <img src="${post.author.profile_image}" alt="" class="post-avatar rounded-circle border border-3" >
                        <b class="d-inline mx-1 ">${post.author.username}</b>
                        ${editbuttonContent}
                        ${deletebuttonContent}
                      </div>
                      <div class="card-body" onclick="getPostWithId(${post.id})">
                        <img src="${post.image}" alt="" class="w-100">
                        <h6 style="color: gray;" class="mt-1">${post.created_at}</h6>
                        <h4>${postTitle}</h4>
                        <p>${post.body}</p>
                        <hr>
                        <div>
                          <span>
                              <span class="emoji">🖊️</span>
                              (${post.comments_count}) comments
                          </span>
                        </div>
                      </div>
                  </div>
              </div>

          `
          document.getElementById("user-posts").innerHTML += content
      })
        
    })
}