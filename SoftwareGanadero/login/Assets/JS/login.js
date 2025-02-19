
const user = {
    "email": "marcoansrv19@gmail.com",
    "password": 102938
}

const formLogin = document.getElementById("form-login")

formLogin.addEventListener("submit", (event) =>{
    event.preventDefault()

    const formEmail = document.getElementById("email")
    const formPass = document.getElementById("password")
    const email = formEmail.value
    const password = formPass.value

    if (email == user.email && password == user.password){
        window.location.href = "../index.html";
    } else {
        console.log("Error");
        const labels = document.querySelectorAll(".label")
        const inputs = document.querySelectorAll(".input")
        const message = document.querySelector(".error")

        for (const label of labels) {
            label.classList.add("error");
        }
        for (const input of inputs) {
            input.classList.add("error-input");
        }
        
        message.classList.toggle("inactive")

    }
    
})

