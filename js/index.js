
const newtaskManager = new TaskManager(0);
newtaskManager.load();
newtaskManager.render();
console.log(newtaskManager.tasks)
//todays date----------------------------------------------------
// console.log("" + todayDate.toDateString)
let today = new Date();
let month = today.getMonth();
month = month + 1;
if(month < 10)
{
    month = "0"+ month
}
let date = today.getDate() + '/' + month + '/' + today.getFullYear();
console.log(date)
const dateToday = document.getElementById('dateToday')
dateToday.innerHTML =  date
// --------------------------------------------------------------
//current time
function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
   let hr= h;
   let time;
   if(hr>12){
        hr = hr - 12
        time = hr +" : "+ m+ " PM" 
   }
   else{
    if(hr == 0){
        hr = 12;
        time = hr +" : "+ m+ " AM" 
    }
    else{
        time = hr +" : "+ m+ " AM" 
    }
    
   }
    const timeNow = document.getElementById('timeToday');
    timeNow.innerHTML = time
    setTimeout(startTime, 60000);
  }
  
  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }
//--------------------------------------------------------

//getting inside Add task button
const element = document.getElementById('AddTaskBtn')
element.addEventListener("click", myFunction);

function myFunction() {

    
    // const submitBtn = document.getElementById('btnAddSubmit')
    // submitBtn.addEventListener('click', (event) =>
    const addTaskForm = document.querySelector('#addTaskForm');
    addTaskForm.addEventListener('submit', (event) => {

        event.preventDefault();
        event.stopPropagation();
        let fullname = document.getElementById("name");
        let description = document.getElementById("description");
        let assignedTo = document.getElementById("assignedto");
        let dueDate = document.getElementById("duedate");
        let status = document.getElementById("status")

        // form validation
        validFormFieldInput(fullname, description, assignedTo, dueDate, status);

    });
}

let validationFail = 0;
function validFormFieldInput(fullname, description, assignedTo, dueDate, status) {
      
   
    //validate task name field
    validateText(fullname,validationFail)
    //validates task description field
    validateText(description,validationFail)
    //validates assigned to field
    validateText(assignedTo,validationFail)
    //validates duedate field only able to select today or future date
    if (dueDate.value == '') {
        dueDate.classList.add("is-invalid");
        dueDate.classList.remove("is-valid");
        validationFail++;
    } else {
         let dateD = new Date(dueDate.value)
        console.log("today"+today.toDateString()+"\n\n"+"dateD"+ dateD.toDateString())
        if (today.toDateString() == dateD.toDateString()) {
            // alert("select a better date")
            dueDate.classList.add("is-valid");
            dueDate.classList.remove("is-invalid");
        }
        else if(today < dateD){
             dueDate.classList.add("is-valid");
        dueDate.classList.remove("is-invalid");

        }
        else {
            dueDate.classList.add("is-invalid");
            dueDate.classList.remove("is-valid");
            validationFail++;
            // alert("Good")
        }

    }
    //validates status field only able to select to do or in progress
    if (status.value == "TO DO" || status.value == "IN PROGRESS") {
        status.classList.add("is-valid");
        status.classList.remove("is-invalid");

    } else  {
        status.classList.add("is-invalid");
        status.classList.remove("is-valid");
        validationFail++;

    }

    //if any of the condition fails return
    if (validationFail > 0) {
        validationFail = 0;
        return;
    }
    else { //if all validates creates a task
        newtaskManager.addTask(fullname.value, description.value, assignedTo.value, dueDate.value, status.value);
        swal({
            title: "Success!",
            text: "New Task has been added!",
            icon: "success",
          });   
        clearFormFields(fullname, description, assignedTo, dueDate, status);
        //creates a card
        newtaskManager.render();
        newtaskManager.save();
       
        //newtaskManager.getTaskById(0);
        
    }

}
function validateText(textField,validationFail){
    if (textField.value.length > 5) {
        let temp = textField.value;
        if (temp.trim().length > 5) {
            textField.classList.add("is-valid");
            textField.classList.remove("is-invalid");

        }
        else {
            textField.classList.add("is-invalid");
            textField.classList.remove("is-valid");
            validationFail++;

        }
        temp.textField =""
    } else {
        textField.classList.add("is-invalid");
        textField.classList.remove("is-valid");
        validationFail++;
    }

}
function clearFormFields(fullname, description, assignedTo, dueDate, status) {
    fullname.value = "";
    description.value = "";
    assignedTo.value = "";
    dueDate.value = "";
    status.value = "";
    fullname.classList.remove("is-valid");
    description.classList.remove("is-valid");
    assignedTo.classList.remove("is-valid");
    dueDate.classList.remove("is-valid");
    status.classList.remove("is-valid");

};

//edit fields


const tasksList = document.querySelectorAll("#ulTodo, #ulInprogress, #ulDone");
for(let i =0; i<tasksList.length;++i){
const element=tasksList[i];
    element.addEventListener("click", (event) => {
    
            if(event.target.classList.contains("done-button")){
                let parentTask = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                console.log("parent task"+JSON.stringify(parentTask));
                const taskId = Number(parentTask.dataset.taskId);
                const task = newtaskManager.getTaskById(taskId);
                //alert(task)
                task.status = "DONE";
                console.log(task.status)
                newtaskManager.render();
                newtaskManager.save();
            }
    
        
            if(event.target.classList.contains("delete-button")){
                let parentTask = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                const taskId = Number(parentTask.dataset.taskId);
                swal({
                    title: "Delete",
                    text: "Are you sure?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                            newtaskManager.deleteTask(taskId);
                            newtaskManager.save();
                            newtaskManager.render();

                    swal(" Your card has been deleted!", {
                        icon: "success",
                    });
                    }
                });
            // const task = newtaskManager.getTaskById(taskId);
            
            }

            //Edit button 
            if(event.target.classList.contains("edit-button")){
                let parentTask = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                console.log("parent task"+JSON.stringify(parentTask));
                const taskId = Number(parentTask.dataset.taskId);
                const task = newtaskManager.getTaskById(taskId);
                alert(JSON.stringify(task))
                let editName = document.getElementById("editName");
            let editDescription = document.getElementById("editDescription");
            let editAssignedto = document.getElementById("editAssignedto");
            let editDuedate = document.getElementById("editDuedate");
            let editStatus = document.getElementById("editStatus"); 
                   
                editName.value = task.name;
                editDescription.value = task.description;
                editAssignedto.value = task.assignedTo;
                editDuedate.value = task.dueDate;
                editStatus.value = task.status;
                const element1 = document.getElementById('editSubmit')
                element1.addEventListener("click", editChanges);
                function editChanges(){
                    task.name = editName.value 
                    task.description = editDescription.value
                    task.assignedTo =editAssignedto.value;
                    task.dueDate = editDuedate.value ;
                    task.status = editStatus.value;
                    
                    newtaskManager.render();
                    newtaskManager.save();
                }
               // newtaskManager.render();
                

                // edit values
                
            }


    });

}   








