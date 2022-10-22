const usernameFormInput = document.getElementById("usernameFormInput")
const emailFormInput = document.getElementById("emailFormInput")
const passwordFormInput = document.getElementById("passwordFormInput")
const form = document.getElementById("form")
const error = document.getElementsByClassName("error")

const validateEmail = function (email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

form.addEventListener('submit', (event) => {
    let containError = false;
    const errorMessages = {
        username: "&nbsp;",
        email: "&nbsp;",
        password: "&nbsp;"
    };
    const errorElements = {
        username: null,
        email: null,
        password: null
    };

    // Since not all forms would have everything given in this page, although we want this script to be able
    // to be used for all forms, I add catch, so that it would continue despite a TypeError
    for (let i of error) {
        if (i.classList.contains('error-username')) {
            errorElements.username = i
        } else if (i.classList.contains('error-email')) {
            errorElements.email = i
        } else if (i.classList.contains('error-password')) {
            errorElements.password = i
        }
    };

    try {
        if (usernameFormInput.value === '' || usernameFormInput.value === null) {
            let pushedMessage = "Username is required";
            errorMessages.username = pushedMessage
            containError = true
        }
    } catch { }

    try {
        if (!validateEmail(emailFormInput.value)) {
            let pushedMessage = "Please eneter a valid email";
            errorMessages.email = pushedMessage
            containError = true
        }
    } catch { }
    try {
        if (emailFormInput.value === '' || emailFormInput.value === null) {
            let pushedMessage = "Email is required";
            errorMessages.email = pushedMessage
            containError = true
        }
    } catch { }
    try {
        if (passwordFormInput.value.length <= 5) {
            let pushedMessage = "Password must be longer than 5 characters";
            errorMessages.password = pushedMessage
            containError = true
        }
    } catch { }
    try {
        if (passwordFormInput.value.length >= 20) {
            let pushedMessage = "Password must be less than 20 characters";
            errorMessages.password = pushedMessage
            containError = true
        }
    } catch { }


    if (containError === true) {
        event.preventDefault()
        for (let i of Object.keys(errorElements)) {
            // As mentioned above, we don't always have all the form elements, as such 
            // We should just ignore it if we do not have the element (ie. some page don't have email)
            try {
                errorElements[i].innerHTML = errorMessages[i]
            } catch {
                continue
            }

        }
    }
})
