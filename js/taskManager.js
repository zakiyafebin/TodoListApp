function createTaskHtml(id, name, description, assignedTo, dueDate, status) {
    var listModal = `<li class="list-unstyled p-2" data-task-id="${id}">
    <div class="card border-info">
      <div class="card-body ${
        status === "TO DO"
          ? "todo"
          : status === "IN PROGRESS"
          ? "inprogress"
          : "done"
      }">
        <div class="d-flex w-100 mt-2 justify-content-between align-items-center">
          <h5>${name}</h5>
          <span class="badge ${
            status === "TO DO"
              ? "badge-danger"
              : status === "IN PROGRESS"
              ? "badge-warning"
              : "badge-success"
          }" >${status}</span>

        </div>
        <div class="d-flex w-100 mb-3 justify-content-between">
          <small>Assigned To: ${assignedTo}</small>
          <small>Due: ${dueDate}</small>
        </div>
        <p> ${description}</p>
        <div class="card-footer text-center" >
            <p>
            <button  class="btn btn-sm btn-success"data-toggle="modal" data-target="#editTaskModal">
        EDIT </button>
            <button class="btn btn-success btn-sm done-button
            ${ status != "DONE" ? "visible" : "invisible"}"
            " >DONE</button>
              <button class="delete btn btn-danger btn-sm delete-button" name="delete">DELETE</button>
            </p>
        </div>
        
      </div>
    </div>
  </li>`


  //console.log(listModal)
  return listModal;
}


class TaskManager {
  constructor(currentId = 0) {
    this.currentId = currentId;
    this.tasks = [];
  }


  addTask(name, description, assignedTo, dueDate, status) {

    const task = {
      id: this.currentId++,
      name: name,
      description: description,
      assignedTo: assignedTo,
      dueDate: dueDate,
      status: status
    };
    this.tasks.push(task)

  }
  //-------------------------------------------------------------
  render() {
    //alert("inside render")
    let tasksHtmlList1 = [];
   let tasksHtmlList2 = [];
   let tasksHtmlList3 = [];

    console.log("this.tasks " + this.tasks)
    for (let i = 0; i < this.tasks.length; ++i) {
      const task = this.tasks[i]
      //console.log("task from tasks"+task)
      let dateArray = task.dueDate.split("-")
      let newDate = dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0]


      let taskHtml = createTaskHtml(task.id,task.name, task.description, task.assignedTo, newDate, task.status);
      console.log("to check id "+(task.id))
     
      if(task.status ==="TO DO"){
        tasksHtmlList1.push(taskHtml);
      }
      if(task.status ==="IN PROGRESS"){
        tasksHtmlList2.push(taskHtml);
      }
      if(task.status ==="DONE"){
        tasksHtmlList3.push(taskHtml);
      }
      
    }
    const sortedActivities = tasksHtmlList1.slice().sort((a, b) => b.date - a.date)

    const tasks1Html = sortedActivities.join("\n");
    const node1 = document.getElementById('ulTodo')
    node1.innerHTML = tasks1Html;
    const tasks2Html = tasksHtmlList2.join("\n");
    const node2 = document.getElementById('ulInprogress')
    node2.innerHTML = tasks2Html;
    const tasks3Html = tasksHtmlList3.join("\n");
    const node3 = document.getElementById('ulDone')
    node3.innerHTML = tasks3Html;
  }
  
  //-----------------------------------------------------------------------------
  getTaskById(taskId) {
    let foundTask;
    for(let i = 0; i< this.tasks.length; ++i){
      const task = this.tasks[i];
      if(task.id == taskId)
      {
        foundTask = this.tasks[i];        
      }

    } 
    return foundTask; 
  }
  //------------------------------------------------------------
  save() {
    const tasksJson = JSON.stringify(this.tasks);
    localStorage.setItem("tasks", tasksJson);
    const currentId = String(this.currentId);    
    localStorage.setItem("currentId", currentId);
    this.currentId = Number(currentId);
    //alert(currentId)
  }

  load() {
    if (localStorage.getItem("tasks")) {
      const tasksJson = localStorage.getItem("tasks");  
      this.tasks = JSON.parse(tasksJson);
    }

    if (localStorage.getItem("currentId")) {
         const currentId = localStorage.getItem("currentId");   
      this.currentId = Number(currentId);
    }
  }
//----------------------------------------------------------------
deleteTask(taskId){
  let newTasks = [];
  for (let i= 0; i< this.tasks.length; i++){
    let task = this.tasks[i];
    if(task.id !== taskId){
      newTasks.push(task)
    }
  }
  this.tasks = newTasks;

}
  

}
