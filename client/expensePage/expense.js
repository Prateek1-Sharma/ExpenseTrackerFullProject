async function dailyExpenses(event){
    event.preventDefault();
  let expenses={
    amount:event.target.expenseAmount.value,
    description:event.target.expenseDescription.value,
    category:event.target.expenseType.value
  }
let token =localStorage.getItem("token");
  try{
let res=await axios.post("http://localhost:4000/add/expenses",expenses,{headers:{"Authorization":token}})

console.log(res);
if(res.status===200){

  alert(res.data.message);
  getExpenses();
}
}
catch(err){
    console.log(err);
}
}

async function getExpenses(){
  const ul=document.getElementById("ul-list");
  ul.innerHTML='';
  let token =localStorage.getItem("token");
 let result= await axios.get("http://localhost:4000/get/allExpenses",{headers:{"Authorization":token}});
 let allExpensesData=result.data

 allExpensesData.forEach(element => {
  // console.log(element);
 const li=`<li id=${element.id}>${element.amount}-${element.description}-${element.category}---<button onclick="delExpense('${element.id}')" type=button>Delete Expense</button> </li>` ;
 ul.innerHTML+=li
 });

}

async function delExpense(id){
  
  const liToDelete=document.getElementById(`${id}`);
  const ul=document.getElementById("ul-list");
 try{
 let response=await axios.delete(`http://localhost:4000/${id}/deleteExpenses`);
 console.log("delete",response);
 if(response.status==200){ 
 ul.removeChild(liToDelete);
 alert("data Deleted Sucessfully")
 }
}
 catch(err){
  console.log(err);
 }
}


function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}



window.addEventListener("DOMContentLoaded",()=>{
  const token=localStorage.getItem("token");
  console.log(token);
  const decodeToken= parseJwt(token)
  console.log(decodeToken);
  if(decodeToken.isPremiumUser){
    showPremium();
    showLeaderBoard();
    
  }
  getExpenses()})

async function buyPremium(e){
  e.preventDefault();
  console.log("hello you are going to buy Premium Package");
  const token=localStorage.getItem("token");
  console.log(token);
  const res=await axios.get("http://localhost:4000/buyPremium",{headers:{"Authorization":token}});
  console.log(res);
  console.log(res.data.key_id);
  var options={
    "key":res.data.key_id,
    "order_id":res.data.order.id,

    //handler function for sucessfull Payment
    "handler":async function(res){
      try{
      let response=await axios.post("http://localhost:4000/updateStatus",{
        order_id:options.order_id,
        payment_id:res.razorpay_payment_id,
      },{headers:{"Authorization":token}})
      alert("you are a Premium Customer")
      console.log(response);
      document.getElementById("buy-premiumbtn").style.visibility="hidden";
      localStorage.setItem("token",response.data.token)
    }
    catch(err){
      console.log(err);
    }
    }
  }
  console.log(options);
const rzp1=new Razorpay(options);
rzp1.open();
e.preventDefault();
rzp1.on('payment failed',function(response){
    console.log(response)
    alert('Something Went Wrong')
})
}

function showLeaderBoard(){
const inputElement=document.createElement("input");
inputElement.type="button"
inputElement.value="Show LeaderBoard"
inputElement.onclick=async()=>{
  const token=localStorage.getItem("token");
  const res=await axios.get(`http://localhost:4000/showLeaderBoard`,{headers:{"Authorization":token}})
  const userLeaderBoardArray = res.data;
  const LeaderBoard=document.getElementById("leaderboard");
        LeaderBoard.innerHTML="";
        LeaderBoard.innerHTML+="<h1>LeaderBoard</h1>"
        userLeaderBoardArray.forEach((user)=>{
        LeaderBoard.innerHTML+=
        `<li>name:-${user.name},total Amount:-${user.Amount}</li>`
        })
}
document.getElementById("message").appendChild(inputElement);
}

function showPremium(){
  document.getElementById('buy-premiumbtn').style.visibility="hidden";
  document.getElementById('message').innerHTML="Premium User--";
}