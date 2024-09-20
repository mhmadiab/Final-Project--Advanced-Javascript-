let currentPage = 1
let lastPage = 1

  window.addEventListener("scroll", function(){
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight

    if(endOfPage && currentPage <  lastPage){
      currentPage = currentPage + 1
      getPosts(currentPage + 1,false)
    }
  })

  getPosts()

  setUpNavBar()

  function userClicked(id){
    window.location.href = `http://127.0.0.1:5500/Final-Project/Profile.html?userId=${id}`
  }

  function getPosts(page = 1, reload = true){
        setUpNavBar();
        axios.get(`${baseURL}/posts?limit=20&page=${page}`)
        .then((response)=>{
          const posts = response.data.data
          lastPage = response.data.meta.last_page
          if(reload == true){
             document.getElementById("posts").innerHTML = ""
          }
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
                            <span onclick="userClicked(${post.author.id})" style="cursor: pointer">
                               <img src="${post.author.profile_image}" alt="" class="post-avatar rounded-circle border border-3" >
                               <b class="d-inline mx-1 ">${post.author.username}</b>
                            </span>
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
              document.getElementById("posts").innerHTML += content
          })
            
        })
    }

  function getPostWithId(postId){
      window.location.href = `http://127.0.0.1:5500/Final-Project/postDetails.html?postId=${postId}`
    }
  

  