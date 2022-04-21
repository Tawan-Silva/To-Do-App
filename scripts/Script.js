function logIn() {

    const inputEmail = document.getElementById('emailInput');
    const validEmail = inputEmail.value.toLowerCase();
    const inputPassword = document.getElementById('passwordInput');
    const errorEmail = document.getElementById('errorEmail');
    const errorPwd = document.getElementById('errorPwd');
    const loader = document.querySelector('.loader');


    function checkEmail() {
        if (/.com$/.test(validEmail) === false || validEmail == "") {
            return errorInput(inputEmail, errorEmail);

        } else {
            return successInput(inputEmail, errorEmail);
        }
    }

    function ckeckPwd() {
        if (inputPassword.length < 8 && inputPassword.length > 12 || inputPassword.value == "") {
            return errorInput(inputPassword, errorPwd);

        } else {
            successInput(inputPassword, errorPwd);
            toggleSpinnerVisibility(true);
            successLogin()
            setTimeout(() => {
                api();
            }, 1500)
        }
    }

    function api() {

        const data = {
            email: validEmail,
            password: inputPassword.value,
        };

        const settings = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        fetch('https://ctd-todo-api.herokuapp.com/v1/users/login', settings)
            .then(response => response.json())
            .then(info => {
                console.log(info);
                storage(validEmail, info);
            })
            .catch(err => console.log(err));
    
    }

    function storage(email, data) {
        localStorage.setItem('user', JSON.stringify({ login: email, response: data }));
        window.location.href = './tarefas.html';
    };

    function errorInput(input, inputSmall) {
        input.classList.remove('success');
        input.classList.add("error");
        inputSmall.classList.add("errorSmall");
        inputSmall.style.visibility = "visible";
        return inputSmall.innerText = "Preencha o campo corretamente";
    };

    function successInput(input, inputSmall) {
        input.classList.remove('error');
        inputSmall.classList.remove('errorSmall');
        input.classList.add('success');
        return inputSmall.style.visibility = "hidden";
    }
    const toggleSpinnerVisibility = (condition) => {
        loader.style.visibility = condition ? 'visible' : 'hidden'; {
        }
    }

    checkEmail();
    ckeckPwd();
};

function successLogin() {
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
        title: 'Logado com sucesso!'
    })
}