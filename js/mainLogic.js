
const baseURL = 'https://tarmeezacademy.com/api/v1'


function login(){
    setUpNavBar()
    const username = document.getElementById("user-name").value
    const password = document.getElementById("password").value

    const params ={
        "username": username,
        "password" : password
    }

    axios.post(`${baseURL}/login`, params)
    .then(response=>{
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const modal = document.getElementById("loginModal")

        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        setUpNavBar()

        showSuccessAlert('You have successfully logged in!', 'success');
    })
    .catch((error)=>{
      showSuccessAlert(error, 'danger');
    })

}


function register(){
    const name = document.getElementById("register-name").value
    const username = document.getElementById("register-user-name").value
    const password = document.getElementById("register-password").value
    const image = document.getElementById("register-image-input").files[0]
    
    const formdata = new FormData()
    formdata.append('name', name)
    formdata.append('username', username)
    formdata.append('password', password)
    formdata.append('image', image)


    axios.post(`${baseURL}/register`, formdata, {
      headers : {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response)=>{
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      const modal = document.getElementById("registerModal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()

      setUpNavBar()
      showSuccessAlert('You have successfully Registered !', 'success');
    })
    .catch((error)=>{
      const message = error.response.data.message
      showSuccessAlert(message, 'danger');
    })

  }


function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUpNavBar()
    showSuccessAlert('You have successfully logged out!', 'danger');
}


function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")
    if(storageUser != null){
      user = JSON.parse(storageUser)
    }

    return  user
  }

function showSuccessAlert(message, type) {
    const alertPlaceholder = document.getElementById('successAlert');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    alertPlaceholder.append(wrapper);
}

function setUpNavBar(){
    const token = localStorage.getItem("token")
    const loginBtn = document.getElementById("login-div")
    const logoutBtn = document.getElementById("logout-div")
    const createPostBtn = document.getElementById("add-post-button")

    const addComment = document.getElementById("add-comment")


    if(token == null){
        if(createPostBtn !=null){
            createPostBtn.style.setProperty('display', 'none', 'important')
        }
        if(addComment !=null){
            addComment.style.setProperty('display', 'none', 'important')
        }

        loginBtn.style.setProperty('display', 'flex', 'important')
        logoutBtn.style.setProperty('display', 'none', 'important')
        
        
    }else{

      const user = getCurrentUser()
      document.getElementById("nav-username").innerHTML = ` @${user.username}`
      document.getElementById("nav-user-image").src = user.profile_image

      if(createPostBtn !=null){
        createPostBtn.style.setProperty('display', 'flex', 'important')
      }

      if(addComment !=null){
        addComment.style.setProperty('display', 'flex', 'important')
      }

      loginBtn.style.setProperty('display', 'none', 'important')
      logoutBtn.style.setProperty('display', 'flex', 'important')
      
    }
}

function getPostDetails(postObj){
  let post = JSON.parse(decodeURIComponent(postObj))

  document.getElementById("post-id-input").value = post.id

  document.getElementById("postModalSubmitBtn").innerHTML = "update"
  document.getElementById("create-post-modal-title").innerHTML = "Edit Post"

  const postId = post.id
  let postTitle = ""
  if(post.title !=null){
            postTitle = post.title
  }
  
  document.getElementById("create-post-title-input").value = postTitle
  document.getElementById("create-post-body-input").value = post.body
    

 
  

  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
  postModal.toggle()
}

function addButtonClick(){


document.getElementById("post-id-input").value = ""

document.getElementById("postModalSubmitBtn").innerHTML = "Create"
document.getElementById("create-post-modal-title").innerHTML = "create new post"


document.getElementById("create-post-title-input").value = ""
document.getElementById("create-post-body-input").value = ""
    
let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
postModal.toggle()
}


function deletePost(postObj){
let post = JSON.parse(decodeURIComponent(postObj))
console.log(post)
document.getElementById("delete-post-id-input").value = post.id
let postModal = new bootstrap.Modal(document.getElementById("deletePostModal"), {})
postModal.toggle()
}

function confirmPostDelete(){
const postId = document.getElementById("delete-post-id-input").value
const token = localStorage.getItem("token")
const headers = {
    "authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }

axios.delete(`${baseURL}/posts/${postId}`, {
    headers : headers
})
.then((response) => {
    console.log(response)
    showSuccessAlert("post deleted successfully", "danger")
    const modal = document.getElementById("deletePostModal")
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
    getPosts()
    
})
.catch((error)=>{
    const message = error.response.data.message
    showSuccessAlert(message, "danger")
})
}

function createPost(){

  let postId = document.getElementById("post-id-input").value
  let isCreate = postId == null || postId == ""
  
  const title = document.getElementById("create-post-title-input").value
  const body = document.getElementById("create-post-body-input").value
  const image = document.getElementById("create-post-image-input").files[0]

  const token = localStorage.getItem("token")

  let formdata = new FormData()
  formdata.append('title', title)
  formdata.append('body', body)
  formdata.append('image', image)


  let url = ''
  const headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
  if (isCreate){
     url = `${baseURL}/posts`

     axios.post(url,formdata, {
      headers : headers
    })
  .then((response)=>{
      const modal = document.getElementById("create-post-modal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
      showSuccessAlert('new post has been created !', 'success');
      getPosts()
    })
    .catch((error)=>{
      const message = error.response.data.message
      showSuccessAlert(message, 'danger');
    })
  }else{
      formdata.append("_method", "put")
      url = `${baseURL}/posts/${postId}`

      axios.post(url,formdata, {
          headers : headers
        })
      .then((response)=>{
          const modal = document.getElementById("create-post-modal")
          const modalInstance = bootstrap.Modal.getInstance(modal)
          modalInstance.hide()
          showSuccessAlert(' post has been edited !', 'success');
          getPosts()
        })
        .catch((error)=>{
          const message = error.response.data.message
          showSuccessAlert(message, 'danger');
        })
  }



  
  }

function profileLink(){
    const user =  getCurrentUser()
    const userId = user.id
    document.getElementById("profile-link").href = `http://127.0.0.1:5500/Final-Project/Profile.html?userId=${userId}`
  }


