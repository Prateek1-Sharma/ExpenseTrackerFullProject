async function login(event){
    event.preventDefault();
    console.log(event.target.loginEmail.value);
    console.log(event.target.loginPassword.value);
    let loginDetails={
        userName:event.target.loginEmail.value,
        userPassword:event.target.loginPassword.value
    }
    try{
        const res=await axios.post("http://localhost:4000/user/login",loginDetails)
        console.log(res);
        localStorage.setItem("token",res.data.token)
        if(res.status===200){
            alert(res.data.message)
            window.location.href="./expense.html"
        }

    }
 catch(err){
    if(err.response.status === 401){
        alert(err.response.data.error)
    }
    console.log("error occured",err);
 }

}

