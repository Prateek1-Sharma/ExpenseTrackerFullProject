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

window.addEventListener("DOMContentLoaded",getExpenses)