window.addEventListener('DOMContentLoaded', event => {

    console.log(`Script JS Page (Server Value): ${SERVER}`)

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

async function serverCall(request, endpoint) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(request);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    return await fetch(`${SERVER}${endpoint}`, requestOptions)
    .then(response => response.text())
    .then(result => {return result})
    .catch(error => {return `ERROR:Server error`});
}

function checkAuth(el) {
    if(el.id === "login") {
        document.querySelector("#signupForm").style.display = "none"
        document.querySelector("#loginForm").style.display = "block"
    }
    else if(el.id === "signup") {
        document.querySelector("#signupForm").style.display = "block"
        document.querySelector("#loginForm").style.display = "none"
    }

}

async function authenticate(el) {
    el.preventDefault()
    el.stopPropagation()

    if(el.target.id === "signupForm") {
        
        let categories = document.getElementsByName("brandCategory")
        let brandCategory = ""
        for(let category=0; category<categories.length; category++) {
            if(categories[category].checked) brandCategory = categories[category].id
        }

        const bName = document.querySelector("#signupForm #name").value
        const bEmail = document.querySelector("#signupForm #email").value
        const bAddress = document.querySelector("#signupForm #address").value
        const bCategory = brandCategory

        if(bCategory === "") {
            document.querySelector("#signupError").style.visibility = "visible"
            document.querySelector("#signupError").textContent = "Select alteast one category"
            return 
        } 
        
        if(document.querySelector("#signupForm #details").value === "") {
            document.querySelector("#signupError").style.visibility = "visible"
            document.querySelector("#signupError").textContent = "Provide your brand details (summary)"
            return 
        }
        
        // everything has been filled
        else {
            document.querySelector("#signupBtn").style.display = "none"
            document.querySelector("#signupError").style.visibility = "hidden"
            document.querySelector("#signupForm #loader").style.display = "block"
            
            const result = await serverCall({
                "email": bEmail
            }, "/validateEmail")

            document.querySelector("#signupBtn").style.display = "block"
            document.querySelector("#signupForm #loader").style.display = "none"

            console.log(result)
            if(result.includes("ERROR")) {
                document.querySelector("#signupError").style.visibility = "visible"
                document.querySelector("#signupError").textContent = result.split(":")[1]

                document.querySelector("#signupForm #name").disabled = false
                document.querySelector("#signupForm #email").disabled = false
                document.querySelector("#signupForm #address").disabled = false
                document.querySelector("#signupForm #details").disabled = false
                
                document.getElementsByName("brandCategory").forEach((div) => {
                    div.disabled = false
                })
            }
            // the entered details are correct and waiting for the pwd to be entered
            else {
                window.sessionStorage.setItem("pwd",result.split(":")[1])
                
                document.querySelector("#signupForm #name").disabled = true
                document.querySelector("#signupForm #email").disabled = true
                document.querySelector("#signupForm #address").disabled = true
                document.querySelector("#signupForm #details").disabled = true
                
                document.getElementsByName("brandCategory").forEach((div) => {
                    div.disabled = true
                })

                document.querySelector("#signupPwd").style.display = "block"
                document.querySelector("#signupBtn").style.display = "none"
            }
        }
    }
    else if(el.target.id === "loginForm") {
        const bEmail = document.querySelector("#loginForm #email").value
        const bPwd   = document.querySelector("#loginForm #pwd").value

        document.querySelector("#loginBtn").style.display = "none"
        document.querySelector("#loginForm #loader").style.display = "block"

        const login = await serverCall({
            "email": bEmail,
            "pwd"  : bPwd
        }, "/login")
        
        document.querySelector("#loginBtn").style.display = "inline"
        document.querySelector("#loginForm #loader").style.display = "none"

        if(login.includes("ERROR")) {
            document.querySelector("#loginError").style.visibility = "visible"
            document.querySelector("#loginError").textContent = login.split(":")[1]
        } else {
            document.querySelector("#loginError").style.visibility = "hidden"
            window.sessionStorage.setItem("pwd", bPwd)
            window.sessionStorage.setItem("email", bEmail)
            window.sessionStorage.setItem("brand", login)

            window.location.href = "./products.php"
        }
    }
}

document.querySelector("#loginForm").addEventListener("submit", (el) => authenticate(el))
document.querySelector("#signupForm").addEventListener("submit", (el) => authenticate(el))

document.querySelector("#signupPwd").addEventListener("keypress", async (el) => {
    el.preventDefault()
    if(el.target.value.length <= 6 && (Number(el.key) || el.key == 0)) {
        el.target.value += el.key
    }
    if(el.target.value === window.sessionStorage.getItem('pwd')) {
        window.sessionStorage.setItem("email", document.querySelector("#signupForm #email").value)
        
        el.target.style.display = "none"
        document.querySelector("#signupForm #loader").style.display = "block"

        let categories = document.getElementsByName("brandCategory")
        let brandCategory = ""
        for(let category=0; category<categories.length; category++) {
            if(categories[category].checked) brandCategory = categories[category].id
        }

        const bName = document.querySelector("#signupForm #name").value
        const bEmail = document.querySelector("#signupForm #email").value
        const bAddress = document.querySelector("#signupForm #address").value
        const bDetails = document.querySelector("#signupForm #details").value
        
        const bCategory = brandCategory

        const signup = await serverCall({
            "bName"       : bName,
            "bEmail"      : bEmail,
            "bAddress"    : bAddress,
            "bDetails"    : bDetails,
            "bStream"     : bCategory,
            "pwd"         : window.sessionStorage.getItem("pwd")
        }, "/createBrand")

        el.target.style.display = "block"
        document.querySelector("#signupForm #loader").style.display = "none"

        if(signup.includes("ERROR")) {
            document.querySelector("#signupError").style.visibility = "visible"
            document.querySelector("#signupError").textContent = signup.split(":")[1]
        } else {
            window.sessionStorage.setItem("brand", signup)
            
            // navigate the brand to the products page
            window.location.href = "./products.php"
        }
    }
})
