const token = JSON.parse(localStorage.getItem("user")).response.jwt;
const user = document.getElementById("user");
const newTask = document.getElementById("newTask");
const tasksToDo = document.getElementById("tasksToDo");
const skeleton = document.getElementById("skeleton");
const finishedTasks = document.getElementById("finishedTasks");

const settings = {
  method: "GET",
  headers: {
    "content-type": "application/json",
    authorization: token,
  },
};

function getMe() {
  fetch("https://ctd-todo-api.herokuapp.com/v1/users/getMe", settings)
    .then((response) => response.json())
    .then((info) => {
      console.log(info);
      user.innerHTML = `${info.firstName} ${info.lastName}`;
    })
    .catch((err) => {
      return console.log(err);
    });
}

function getTasks() {
  fetch("https://ctd-todo-api.herokuapp.com/v1/tasks", settings)
    .then((response) => response.json())
    .then((info) => {
      console.log(info);
      skeleton.style.display = "none";

      tasksToDo.innerHTML = "";
      finishedTasks.innerHTML = "";

      for (index of info) {
        console.log(index.description, index.completed, index.createdAt);
        const dateFormat = new Date(index.createdAt).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        );
        if (index.completed === false) {
          tasksToDo.innerHTML += `<li class="tarefa">
            <div class="not-done" title="adicionar a tarefas terminadas">
            <button class="not-complete" onclick="sweetAlert(${index.id}, true)"><i class="ri-check-double-fill"></i></button></div>
            <div class="descricao" title="tarefa pendente">
              <p class="nome">${index.description}</p>
              <p class="timestamp">${dateFormat}</p>
            </div>
          </li>
          `;
        } else {
          finishedTasks.innerHTML += `<li class="tarefa">
            <div class="not-done" onclick="putTasks(${index.id}, false)" title="adicionar a tarefas pendentes">
            <button class="complete"><i class="ri-check-double-fill"></i></button></div>
            <div class="descricao" title="tafera terminada">
              <p class="nome" id="${index.id}">${index.description} </p>
              <p class="timestamp">${dateFormat}
              <i class="ri-delete-bin-line" title="exluir tarefa" onclick="deleteConfirm()"></i>
              </p>
            </div>
          </li>
          `;
        }
      }
    })
    .catch((err) => {
      return console.log(err);
    });
}

function postTasks() {

  const data = {
    description: newTask.value,
    completed: false,
  };

  const settings = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: token,
    },
    body: JSON.stringify(data),
  };

  fetch("https://ctd-todo-api.herokuapp.com/v1/tasks", settings)
    .then((response) => response.json())
    .then((info) => {
      console.log(info);
      const dateFormat = new Date(info.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      tasksToDo.innerHTML += `<li class="tarefa">
          <div class="not-done" onclick="sweetAlert()">
          <button class="not-complete"><i class="ri-check-double-fill"></i></button>
          </div>
          <div class="descricao">
            <p class="nome">${info.description}</p>
            <p class="timestamp">${dateFormat}</p>
          </div>
        </li>
          `;
      newTask.value = "";
      newTask.focus();
    })
    .catch((err) => {
      return console.log(err);
    });
}

function putTasks(id, status) {
  const data = {
    completed: status,
  };

  const settings = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: token,
    },
    body: JSON.stringify(data),
  };

  fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, settings)
    .then((response) => response.json())
    .then((info) => {
      console.log(info);
      getTasks();
    })
    .catch((err) => {
      return console.log(err);
    });
}

function deleteConfirm() {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Você não será capaz de reverter isso!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, exclua!'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTasks(index.id)
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })
}

function deleteTasks(id) {
  const settings = {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      authorization: token,
    },
  };

  fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, settings)
    .then((response) => response.json())
    .then((info) => {
      console.log(info);
      getTasks();
    })
    .catch((err) => {
      return console.log(err);
    });
}

function closeApp() {
  off();
  setTimeout(() => {
    localStorage.removeItem(`user`);
    window.location = "././index.html";
    console.log(`clicked`);
  }, 1000);
}

function off() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  Toast.fire({
    icon: 'success',
    title: 'Deslogado com sucesso!'
  })
}

function validInput() {
  if (newTask.value == "") {
    return Swal.fire({
      icon: 'error',
      title: 'Nova da tarefa inválida!',
      text: 'Digite uma tarefa!',
      footer: '<a href="">Why do I have this issue?</a>'
    })
  } else {
    setTimeout(() => {
      postTasks();
    }, 1500);
  }
}

function sweetAlert(id, status) {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Deseja terminar está tarefa?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar'
  }).then((result) => {
    setTimeout(() => {
      if (result.isConfirmed) {
        putTasks(id, status);
        Swal.fire(
          'Tarefa terminada!',
          'Você terminou uma tarefa.',
          'success'
        )
      }
    }, 1500);

  })
}

(window.onload = getMe()), getTasks();