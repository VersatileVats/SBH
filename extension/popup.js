const cartCount = document.querySelector("#cartCount")

// Calling the Google's Palm Text API for text2text generation
const generateTextPrompt = async (textPrompt) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "prompt": {
        "text": textPrompt
    },
    "temperature": 0.7,
    "top_k": 40,
    "top_p": 0.95,
    "candidate_count": 1,
    "max_output_tokens": 350,
    "stop_sequences": [],
    "safety_settings": [
        {
        "category": "HARM_CATEGORY_DEROGATORY",
        "threshold": 1
        },
        {
        "category": "HARM_CATEGORY_TOXICITY",
        "threshold": 1
        },
        {
        "category": "HARM_CATEGORY_VIOLENCE",
        "threshold": 2
        },
        {
        "category": "HARM_CATEGORY_SEXUAL",
        "threshold": 2
        },
        {
        "category": "HARM_CATEGORY_MEDICAL",
        "threshold": 2
        },
        {
        "category": "HARM_CATEGORY_DANGEROUS",
        "threshold": 2
        }
    ]
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    return await fetch("https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=AIzaSyCCbVic_piEjCeC7AcO9QF4kAV9FiPAmOI", requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log(result.candidates[0].output)
            return result.candidates[0].output
        })
        .catch(error => console.log('error', error));
}

/* Example prompt: 
*I recently purchased shoes from Adidas through the Chrome extension. Today I found that they are torn, so draft a feedback for the company informing about the same*
*/

document.querySelector("#feedbackMsg").addEventListener("keydown", async(event) => {
    if(event.key == "Enter") {
        let content = event.target.value

        if(content.length == 0 || content.indexOf("*") == -1 || content.indexOf("*") == content.lastIndexOf("*") || content.slice(content.indexOf("*")+1, content.lastIndexOf("*")).length < 20) {
            console.log("INVALID AI PROMPT")
            document.querySelector("#feedbackError").style.visibility = "visible"
            document.querySelector("#feedbackError").textContent = "Please provide a valid AI prompt"   
        } else {
            document.querySelector("body").style.pointerEvents = "none"

            // calling the text2text generation function
            event.target.value = await generateTextPrompt(content.slice(content.indexOf("*")+1, content.lastIndexOf("*")))
            event.target.value = event.target.value.slice(0,499)
            document.querySelector("body").style.pointerEvents = "auto"
        }
    }
})

document.querySelector("#cartHeader").addEventListener("click", () => {
    chrome.tabs.create({
        url: "https://versatilevats.com/squarehub/checkout.html"
    })
})

document.querySelector("#shoppingCart").addEventListener("click", async () => {
    document.querySelector("#cartDetails").style.display = "flex"

    //populate the cart thing:
    const mainDiv = document.querySelector("#cartProducts")
    mainDiv.innerHTML = ""

    let totalPrice = 0
    let pickupTotal = 0

    await chrome.storage.local.get(["cart", "tag"]).then(data => {
        let itr = 0;
        console.log(data["cart"])

        if(data["cart"].count == 0) {
            document.querySelector("#cartTotal").textContent = "0"
            document.querySelector("#pickupTotal").textContent = "0"
            mainDiv.innerHTML = `<span style="color: red; font-weight: bold; font-size: 1rem; text-align: center">There are 0 items in your cart!</span>`
        } else {
            for(let object in data["cart"]) {
                const mainContainer = document.createElement("div")
                
                // capuring the cart items
                if(data["cart"][object].name) {
                    totalPrice += data["cart"][object].price
                    mainContainer.style.width = "90%"
                    mainContainer.style.margin = "auto"

                    const firstChild = document.createElement("div")
                    firstChild.style.display = "flex"
                    firstChild.style.borderRadius = "10px"
                    firstChild.style.alignItems = "center"
                    firstChild.style.justifyContent = "space-between"
                    firstChild.style.background = "rgb(240, 240, 240)"
                    
                    let addIcon = document.createElement("img")
                    addIcon.width = 20
                    addIcon.height = 20
                    addIcon.style.cursor = "pointer"

                    let showAddIcon = true
                    // count for cart is 0 for empty carts
                    if(object === object) {
                        showAddIcon = false
                    }

                    addIcon.addEventListener("click", 
                        async (   event, 
                            name = data["cart"][object].name, 
                            company = data["cart"][object].company, 
                            desc = data["cart"][object].desc, 
                            img = object
                        ) => {
                            await chrome.storage.local.get(["cart","tag"]).then(row => {
                                let newCart = row["cart"]
                                newCart.count = row["cart"].count - 1

                                totalPrice -= newCart[img].price
                                if(newCart[img].pickup && row["tag"]) {
                                    pickupTotal -= newCart[img].price
                                }
                                document.querySelector("#cartTotal").textContent = totalPrice 
                                document.querySelector("#pickupTotal").textContent = pickupTotal


                                delete newCart[img]

                                chrome.storage.local.set({
                                    'cart': newCart
                                })

                                cartCount.textContent = parseInt(cartCount.textContent) - 1

                                event.target.parentElement.parentElement.remove()
                                if(cartCount.textContent == 0) 
                                mainDiv.innerHTML = `<span style="color: red; font-weight: bold; font-size: 1rem; text-align: center">There are 0 items in your cart!</span>`

                                // replace the button with the ADD BUTTON
                                event.target.src = "https://img.icons8.com/fluency/30/add--v1.png"
                                event.target.setAttribute("id", "add")
                            })
                    })

                    if(showAddIcon) {
                        addIcon.src = "https://img.icons8.com/fluency/30/add--v1.png"
                        addIcon.setAttribute("id","add")
                    } else {
                        addIcon.src = "https://img.icons8.com/fluency/30/minus.png"
                        addIcon.setAttribute("id","minus")
                    }

                    firstChild.appendChild(addIcon)

                    const firstPara = document.createElement("p")
                    firstPara.style.fontSize = "1rem"
                    firstPara.textContent = data["cart"][object].name

                    const secondPara = document.createElement("p")
                    secondPara.style.fontSize = "1rem"
                    secondPara.innerHTML = `By <b>${data["cart"][object].company}</b>`

                    firstChild.appendChild(firstPara)
                    firstChild.appendChild(secondPara)

                    const secondChild = document.createElement("div")
                    secondChild.style.width = "100%"
                    secondChild.style.padding = "10px"
                    secondChild.style.display = "flex"
                    secondChild.style.alignItems = "center"
                    secondChild.style.justifyContent = "space-evenly"

                    const secondChildDiv = document.createElement("div")
                    
                    const pDesc = document.createElement("p")
                    pDesc.textContent = data["cart"][object].desc

                    const price = document.createElement("p")
                    price.textContent = `$ ${data["cart"][object].price}`

                    secondChildDiv.appendChild(pDesc)
                    secondChildDiv.appendChild(price)

                    // check for the PICKUP option
                    if(data["cart"][object].pickup && data["tag"]) {
                        pickupTotal += data["cart"][object].price
                        const pickup = document.createElement("p")
                        pickup.innerHTML = '<u>Pickup available</u>'
                        secondChildDiv.appendChild(pickup)
                    }

                    const img =  document.createElement("img")
                    img.src = object
                    img.style.borderRadius = "20px"
                    img.setAttribute("width", "50px")
                    img.setAttribute("height", "50px")

                    if(itr%2 == 0) {
                        secondChild.appendChild(secondChildDiv)
                        secondChild.appendChild(img)
                    } else {
                        secondChild.appendChild(img)
                        secondChild.appendChild(secondChildDiv)
                    }

                    itr++

                    mainContainer.appendChild(firstChild)
                    mainContainer.appendChild(secondChild)
                    console.log(mainContainer)
                    mainDiv.appendChild(mainContainer)
                }
            }
            document.querySelector("#cartTotal").textContent = totalPrice
            document.querySelector("#pickupTotal").textContent = pickupTotal
        }
        if(data["tag"]) {
            document.querySelector("#tag").innerHTML = `Your Sqaure Tag ID: <b>${data["tag"]}</b>`
        } else {
            document.querySelector("#tag").innerHTML = `<b>Oops, you do not have a SQUARE TAG</b>`
        }
    })
})

document.querySelector("#closeCart").addEventListener("click", async () => {
    document.querySelector("#cartDetails").style.display = "none"
    await chrome.storage.local.get(["currentSection"]).then(data => {
        if(data["currentSection"] === "recommendations") populateRecommendations()
        else if(data["currentSection"] === "brands") {
            document.querySelector("#brandsProducts").innerHTML = ""
        }
    })
})

document.querySelector("#checkoutCart").addEventListener("click", async () => {
    const {cart, userEmail, cartTotal, pickupPrice, squareTag} = await chrome.storage.local.get(["cart", "email", "tag"]).then(data => {
        return {
            "cart"       : data["cart"],
            "userEmail"  : data["email"],
            "squareTag"  : data["tag"],
            "cartTotal"  : document.querySelector("#cartTotal").textContent,
            "pickupPrice": document.querySelector("#pickupTotal").textContent
        }
    })

    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

    if(cart.count > 0) {
        await chrome.tabs.sendMessage(tab.id, {cart, userEmail, cartTotal, pickupPrice, squareTag})
        .catch(err => {
            document.querySelector("#cartDetails").style.display = "none"
            document.querySelector("#error").style.visibility = "visible"
            document.querySelector("#error").textContent = "Be on the CHECKOUT page by clicking on the 'Your Cart' text"
        })
    } else {
        document.querySelector("#cartDetails").style.display = "none"
        document.querySelector("#error").style.visibility = "visible"
        document.querySelector("#error").textContent = "Atleast add a single item before checking out"
    }
})

// resetting the credentials for already logged in details
document.querySelector("#resetCredentials").addEventListener("click", (event) => {
    chrome.storage.local.set({
        "currentSection": "",
        "username": "",
        "email" : "",
        "score": 0,
        "tag": "",
        "cart": {count: 0}
    })
    document.querySelector("#loginEmail").value = ""
    document.querySelector("#loginPwd").value = ""

    document.querySelector("#loginEmail").removeAttribute("disabled")
    document.querySelector("#loginPwd").removeAttribute("disabled")

    event.target.style.display = "none"
})

// running pre-checks on the data
chrome.storage.local.get(["currentSection", "username", "email", "score", "pwd", "cart"]).then(data => {
    // for the first time use
    if(data["username"] == undefined || data["username"] == "") {
        console.log("FIRST TIME USER")
        chrome.storage.local.set({
            "currentSection": "",
            "username": "",
            "email" : "",
            "score": 0,
            "tag": "",
            "cart": {count: 0}
        })
    } else {
        cartCount.textContent = data["cart"].count
        document.querySelector("#resetCredentials").style.display = "block"

        document.querySelector("#loginEmail").setAttribute("disabled", "")
        document.querySelector("#loginPwd").setAttribute("disabled", "")

        console.log("OLD USER")
        console.log(data["email"])
        document.querySelector("#loginEmail").value = data["email"]
        document.querySelector("#loginPwd").value = data["pwd"]
        chrome.storage.local.set({
            "currentSection" : ""
        })
    }
})

async function glitchCall(request, endpoint) {
    document.querySelector("body").style.pointerEvents = "none"
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(request);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    return await fetch(`${NODE_SERVER_URL}/${endpoint}`, requestOptions)
    .then(response => response.text())
    .then(result => {
        document.querySelector("body").style.pointerEvents = "auto"
        return result
    })
    .catch(error => {return `ERROR:Server error`});
}

const toggleSections = ["#loginForm"]

async function populateRecommendations() {
    document.querySelector("#recProducts").textContent = ""
    await chrome.storage.local.get(["email","cart"]).then(async data => {
        console.log("CART IS : " + data["cart"])
        console.log("INSIDE")
        let personalizedContent = await glitchCall({
            "email": data["email"] 
        }, "recommendations")

        personalizedContent = JSON.parse(personalizedContent)
        console.log(personalizedContent)

        const mainDiv = document.querySelector("#recProducts")

        for(let a=0; a<personalizedContent.length; a++) {
            const mainContainer = document.createElement("div")
            mainContainer.style.width = "90%"
            mainContainer.style.margin = "auto"

            const firstChild = document.createElement("div")
            firstChild.style.display = "flex"
            firstChild.style.borderRadius = "10px"
            firstChild.style.alignItems = "center"
            firstChild.style.justifyContent = "space-between"
            firstChild.style.background = "rgb(240, 240, 240)"
            
            let addIcon = document.createElement("img")
            addIcon.width = 20
            addIcon.height = 20
            addIcon.style.cursor = "pointer"

            let showAddIcon = true
            // count for cart is 0 for empty carts
            if(data["cart"].count > 0) {
                for(let object in data["cart"]) {
                    if(object === personalizedContent[a]["pLoc"]) {
                        showAddIcon = false
                        break
                    }
                }                
            }

            addIcon.addEventListener("click", 
                async (   event, 
                    name    = personalizedContent[a]["pName"], 
                    company = personalizedContent[a]["companyName"].toUpperCase(), 
                    desc    = personalizedContent[a]["pDesc"], 
                    img     = personalizedContent[a]["pLoc"],
                    price   = personalizedContent[a]['pPrice'],
                    pickup  = personalizedContent[a]['pickup']
                ) => {
                    // Adding the object to the CART
                    if(event.target.getAttribute("id") === "add" && data["cart"].tagAmount == 0) {
                        await chrome.storage.local.get(["cart"]).then(row => {
                            let newCart   = row["cart"]
                            newCart.count = row["cart"].count + 1
                            newCart[img] = {
                                "company" : company,
                                "desc"    : desc,
                                "name"    : name,
                                "price"   : price,
                                "pickup"  : pickup   
                            }
                            
                            chrome.storage.local.set({
                                "cart" : newCart
                            })

                            cartCount.textContent = parseInt(cartCount.textContent) + 1

                            // replace the button with the MINUS BUTTON
                            event.target.src = "https://img.icons8.com/fluency/30/minus.png"
                            event.target.setAttribute("id", "minus")
                        })
                    } else if(event.target.getAttribute("id") === "add" && data["cart"].tagAmount > 0) {
                        document.querySelector("#error").style.visibility = "visible"
                        document.querySelector("#error").textContent = "Complete the last pickup order first"
                    }
                    // deleting the object from the CART
                    else if(event.target.getAttribute("id") === "minus") {
                        await chrome.storage.local.get(["cart"]).then(row => {
                            let newCart = row["cart"]
                            newCart.count = row["cart"].count - 1
                            delete newCart[img]

                            chrome.storage.local.set({
                                'cart': newCart
                            })

                            cartCount.textContent = parseInt(cartCount.textContent) - 1

                            // replace the button with the ADD BUTTON
                            event.target.src = "https://img.icons8.com/fluency/30/add--v1.png"
                            event.target.setAttribute("id", "add")
                        })
                    }
            })

            if(showAddIcon) {
                addIcon.src = "https://img.icons8.com/fluency/30/add--v1.png"
                addIcon.setAttribute("id","add")
            } else {
                addIcon.src = "https://img.icons8.com/fluency/30/minus.png"
                addIcon.setAttribute("id","minus")
            }

            const firstPara = document.createElement("p")
            firstPara.style.fontSize = "1rem"
            firstPara.textContent = personalizedContent[a]["pName"]

            const secondPara = document.createElement("p")
            secondPara.style.fontSize = "1rem"
            secondPara.innerHTML = `By <b>${personalizedContent[a]["companyName"].toUpperCase()}</b>`

            firstChild.appendChild(firstPara)
            firstChild.appendChild(secondPara)
            firstChild.appendChild(addIcon)

            const secondChild = document.createElement("div")
            secondChild.style.width = "100%"
            secondChild.style.padding = "10px"
            secondChild.style.display = "flex"
            secondChild.style.alignItems = "center"
            secondChild.style.justifyContent = "space-evenly"

            const secondChildDiv = document.createElement("div")
            
            const pDesc = document.createElement("p")
            pDesc.textContent = personalizedContent[a]["pDesc"]

            const price = document.createElement("p")
            price.textContent = `$ ${personalizedContent[a]['pPrice']}`
            
            const emptyPara = document.createElement("p")

            const pDetails = document.createElement("p")
            let gender = personalizedContent[a]["pGender"]
            let ageGroup = personalizedContent[a]["pAgeGroup"]
            
            if(gender == "m") gender = "males" 
            else if(gender == "f")  gender = "females"
            else gender = "every gender"
            
            if(ageGroup == "everyone") ageGroup = "every"

            pDetails.innerHTML = `This product is listed for<b>${gender}</b> & for <b>${ageGroup} age group</b>`

            secondChildDiv.appendChild(pDesc)
            secondChildDiv.appendChild(price)
            secondChildDiv.appendChild(emptyPara)
            secondChildDiv.appendChild(pDetails)

            const img =  document.createElement("img")
            img.src = personalizedContent[a]["pLoc"]
            img.style.borderRadius = "20px"
            img.setAttribute("width", "80px")
            img.setAttribute("height", "80px")

            if(a%2 == 0) {
                secondChild.appendChild(secondChildDiv)
                secondChild.appendChild(img)
            } else {
                secondChild.appendChild(img)
                secondChild.appendChild(secondChildDiv)
            }

            mainContainer.appendChild(firstChild)
            mainContainer.appendChild(secondChild)

            mainDiv.appendChild(mainContainer)
        }
    })
}

function filterRecommendations(textToSearch) {
    chrome.storage.local.get(["currentSection"]).then(async (data) => {
        if(data["currentSection"] === "recommendations") {
            document.querySelector("#recProducts").childNodes.forEach((node) => {
                if(node.firstChild.firstChild.textContent.toLowerCase().includes(textToSearch.toLowerCase()))
                    node.style.display = "block"
                else node.style.display = "none"
            })
        } else if(data["currentSection"] === "brands") {
            document.querySelector("#brandsProducts").childNodes.forEach((node) => {
                if(node.firstChild.firstChild.firstChild.textContent.toLowerCase().includes(textToSearch.toLowerCase()))
                    node.style.display = "block"
                else node.style.display = "none"
            })
        }
    })
}

document.querySelector("#filterRecommendations").addEventListener("keyup", (e) => {
    filterRecommendations(e.target.value)
})

async function navigateTo(from, to) {
    if(to == "recommendations") {
        
        document.querySelector("#filterRecommendations").value = ""
        document.querySelector("#filterRecommendations").style.display = "block"

        console.log("CALLING THE FUNCTION")
        document.querySelector(`#${from}`).style.display = "none"
        document.querySelector("#loader").style.display = "flex"
        await populateRecommendations()
        document.querySelector('#loader').style.display = "none"
        document.querySelector(`#${to}`).style.display = "flex"
        console.log("OUTSIDE")
    
    } else if(to == "brands") {
        document.querySelector("#mlImageInput").value = ''
        document.querySelector("#mlLabels").style.display = 'none'

        document.querySelector("#brandCategory").value = "default"
        document.querySelector("#brandGender").value = "default"
        document.querySelector("#brandAge").value = "default"

        document.querySelector("#brandsProducts").textContent = ""
        document.querySelector("#brandName").innerHTML = ""
        await populateBrands()
        document.querySelector("#filterRecommendations").style.display = "none"
        document.querySelector(`#${from}`).style.display = "none"
        document.querySelector(`#${to}`).style.display = "flex"
    
    } else if(to == "rewards") {
        chrome.storage.local.get(["email"]).then(async (data) => {
            const res = await glitchCall({email: data["email"]}, "getAchievements")
            if(res.includes("f")) {
                document.querySelector("#feedbackReward").style.filter = "grayscale(0)"
            }
        })
        document.querySelector("#filterRecommendations").style.display = "none"
        document.querySelector(`#${from}`).style.display = "none"
        document.querySelector(`#${to}`).style.display = "flex"

    } else {
        document.querySelector("#brandsFeedbackDiv").style.visibility = "hidden"
        document.querySelector ("#brandsFeedback").value = "default"
        document.querySelector ("#feedbackType").value = "default"

        // populating the brands field
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        let brands = await fetch(`${NODE_SERVER_URL}/listBrands`, requestOptions)
        .then(response => response.text())
        .then(result => result)
        .catch(error => console.log('error', error));

        if(brands.includes("ERROR")) {
            chrome.tts.speak(
                `No brands are available as of now`, 
                {'enqueue': true, 'volume': 0.7}
            )
        } else {
            brands = JSON.parse(brands)
    
            const brandDiv = document.querySelector("#brandsFeedback")

            brands.forEach((item) => {
                const option = document.createElement("option")
                option.setAttribute("value", item["bName"].toLowerCase())
                option.textContent = item["bName"].toUpperCase()
                brandDiv.appendChild(option)
            })
        }

        document.querySelector("#filterRecommendations").style.display = "none"
        document.querySelector(`#${from}`).style.display = "none"
        document.querySelector(`#${to}`).style.display = "flex"
    }

    chrome.storage.local.set({"currentSection": to})
}

// making the heading work as the link to the RECEOMMENDATIONS section
document.querySelector("#extensionHeading h1").addEventListener("click", async () => {
    const fromSection = await chrome.storage.local.get(["currentSection"]).then(result => {
        return result["currentSection"]
    }).catch(err => {
        return err
    })
    
    console.log("FROM: " + fromSection)

    if(fromSection !== "") {
        navigateTo(fromSection, "recommendations")
    } else {
        if(document.querySelector("#loginForm").style.display === "none" && document.querySelector("#signupForm").style.display === "flex") {
            location.reload()
        }
    }
})

document.querySelector("#submitLoginForm").addEventListener("click", async(el) => {
    el.preventDefault()
    const pwd = document.querySelector("#loginPwd")
    const email = document.querySelector("#loginEmail")

    if(pwd.value === "" || email.value === "") {
        document.querySelector("#loginError").style.visibility = "visible"
        document.querySelector("#loginError").textContent = "Provide all values"
    }
    else {
        document.querySelector("#loginError").style.visibility = "hidden"
        document.querySelector("#loader").style.display = "flex"
        document.querySelector("#loginForm").style.display = "none"

        const loginRes = await glitchCall({
            "email": email.value,
            "pwd": pwd.value
        }, "loginUser")

        console.log(loginRes)
        
        if(loginRes.includes("ERROR")) {
            document.querySelector("#loader").style.display = "none"
            document.querySelector("#loginForm").style.display = "flex"

            document.querySelector("#loginError").style.visibility = "visible"
            document.querySelector("#loginError").textContent = loginRes.split(":")[1]
        } else {
            chrome.storage.local.set({
                "pwd"    : pwd.value,
                "email"  : email.value,
                "score"  : loginRes.split(":")[1],
                "username": loginRes.split(":")[0],
                "tag"     : loginRes.split(":")[4],
                "currentSection": "recommendations"
            })

            // No tag is there
            if(loginRes.split(":")[4] == undefined) {
                document.querySelector("#pickupTotal").parentElement.parentElement.style.display = "none"
                console.log("HIDING THE STUFF")
            }

            // checking the tagAmount
            if(loginRes.split(":")[5] > 0 || loginRes.split(":")[6] != '') {
                cartCount.textContent = 0
                await chrome.storage.local.set({
                    "cart": {count:0, tagAmount: loginRes.split(":")[5]}
                })
            } else {
                await chrome.storage.local.get(["cart"]).then(async data => {
                    let newCart = data["cart"]
                    newCart.tagAmount = 0
                    await chrome.storage.local.set({
                        "cart": newCart
                    })
                })
            }
            
            if(loginRes.split(":")[2] >= 5) {
                document.querySelector("#loginReward").style.filter = "grayscale(0)"
            }

            if(loginRes.split(":")[2] == 5 && loginRes.split(":")[3] != "old") {
                chrome.tts.speak(
                    `Hi ${loginRes.split(":")[0]}, congrats on maintaing a login streak of 5 days. You just earned the highest badge of this application`, 
                    {'enqueue': true, 'volume': 0.7}    
                )
            }

            document.querySelector("#currentLoginStreak").textContent = loginRes.split(":")[2]

            console.log("Calling login")
            await populateRecommendations()
            console.log("Outside login")

            document.querySelector("#loader").style.display = "none"

            document.querySelector("#header").style.display = "flex"
            document.querySelector("#score").textContent = loginRes.split(":")[1]
            document.querySelector("#username").textContent = loginRes.split(":")[0]

            document.querySelector("#loginForm").style.display = "none"
            document.querySelector("#recommendations").style.display = "flex"
        }
    }

})

document.querySelectorAll("footer p").forEach((node) => {
    node.addEventListener('click', async (el) => {
        const fromSection = await chrome.storage.local.get(["currentSection"]).then(data => {
            console.log(data)
            return data["currentSection"]
        })
        console.log("From: "+fromSection)
        console.log("To: "+el.target.id.split("To")[1])

        if(fromSection !== "") {
            navigateTo(fromSection, el.target.id.split("To")[1])
        } else {
            console.log("LOG IN FIRST")
            if(document.querySelector("#signupForm").style.display === "flex") {
                document.querySelector("#signupError").style.visibility = "visible"
                document.querySelector("#signupError").textContent = "Login/signup first"
            } else {
                document.querySelector("#loginError").style.visibility = "visible"
                document.querySelector("#loginError").textContent = "Login/signup first"
            }
        }
    })
})

document.querySelector("#takeToSignup").addEventListener("click", () => {
    document.querySelector("#loginForm").style.display = "none"
    document.querySelector("#signupForm").style.display = "flex"
    document.querySelector("#loginError").style.visibility = "hidden"
})

document.querySelector("#submitSignupForm").addEventListener("click", async (el) => {
    el.preventDefault()
    const email = document.querySelector("#signupEmail").value
    const name = document.querySelector("#signupName").value
    let phone = document.querySelector("#signupPhone").value

    if(name == "") {
        document.querySelector("#signupError").style.visibility = "visible"
        document.querySelector("#signupError").textContent = "Name should not be empty"  
        return
    }

    // will remove spaces, "(", ")", "+", "-" from phone numbers
    phone = phone.replaceAll("+","")
    phone = phone.replaceAll("(","")
    phone = phone.replaceAll(")","")
    phone = phone.replaceAll("-","")
    phone = phone.replaceAll(" ","")

    console.log(phone)

    if(phone.includes("e") || !Number(phone)) {
        document.querySelector("#signupError").style.visibility = "visible"
        document.querySelector("#signupError").textContent = (phone == "") ? "Phone number should not be empty" :"Phone number should not have alphabets"  
        return
    }

    document.querySelector("#loader").style.display = "flex"
    document.querySelector("#signupForm").style.display = "none"

    //  && document.querySelector("#signupName").value !=
    if(el.target.value === "GET OTP") {
        const verifyRes = await glitchCall({
            "email" : email,
            "phone" : phone,
            "signup": "true"
        }, "validateUser")

        if(verifyRes.includes("ERROR")) {
            document.querySelector("#signupError").style.visibility = "visible"
            document.querySelector("#signupError").textContent = verifyRes.split(":")[1]

            document.querySelector("#signupPwd").removeAttribute("pwd")
        } else {
            document.querySelector("#signupPwd").setAttribute("pwd",verifyRes)

            document.querySelector("#signupError").style.visibility = "hidden"

            el.target.value = "CREATE ACCOUNT"

            const a = ["signupName", "signupEmail", "signupPhone"]
            a.forEach((item, index) => {
                document.querySelector(`#${item}`).style.cursor = "no-drop"
                document.querySelector(`#${item}`).setAttribute("disabled","")
            })
            
            const b = ["signupDOB", "signupPwd", "signupGender"]
            b.forEach((item, index) => {
                document.querySelector(`#${item}`).style.cursor = "auto"
                document.querySelector(`#${item}`).removeAttribute("disabled")
            })

            const c = ["Clothing", "Furniture", "Electronics", "Food"]
            c.forEach((item, index) => {
                document.getElementsByName(`${item}`)[0].style.cursor = "auto"
                document.getElementsByName(`${item}`)[0].removeAttribute("disabled")
            })

        }

        document.querySelector("#loader").style.display = "none"
        document.querySelector("#signupForm").style.display = "flex"
    } else if(el.target.value === "CREATE ACCOUNT") {
        const gender = document.querySelector("#signupGender").value
        const DOB = document.querySelector("#signupDOB").value
        const pwd = document.querySelector("#signupPwd").value
    
        if (DOB === "") {
            document.querySelector("#signupError").style.visibility = "visible"
            document.querySelector("#signupError").textContent = "Please select your DOB"

            document.querySelector("#loader").style.display = "none"
            document.querySelector("#signupForm").style.display = "flex"
        } else if (gender === "default") {
            document.querySelector("#signupError").style.visibility = "visible"
            document.querySelector("#signupError").textContent = "Please select a gender"

            document.querySelector("#loader").style.display = "none"
            document.querySelector("#signupForm").style.display = "flex"
        } else if (pwd !== document.querySelector("#signupPwd").getAttribute("pwd")) {
            document.querySelector("#signupError").style.visibility = "visible"
            document.querySelector("#signupError").textContent = "Wrong PWD!! Try again"

            document.querySelector("#loader").style.display = "none"
            document.querySelector("#signupForm").style.display = "flex"
        } else if(!grabInterestValues()) {
            document.querySelector("#signupError").style.visibility = "visible"
            document.querySelector("#signupError").textContent = "Select atleast 1 interest"

            document.querySelector("#loader").style.display = "none"
            document.querySelector("#signupForm").style.display = "flex"
        } else {
            const age = new Date().getFullYear() - document.querySelector("#signupDOB").value.split("-")[0]
            let ageGroup

            if((age>=10 && age<=14)) ageGroup = "kids"
            else if((age>=15 && age<=25)) ageGroup = "youth"
            else if((age>=26 && age<=50)) ageGroup = "adult"
            else if(age > 50) ageGroup = "old" 

            console.log(grabInterestValues("true").trim())
            const d = new Date()

            await glitchCall({
                "uDOB": DOB,
                "uName" : name,
                "uEmail": email,
                "uPhone": phone,
                "uGender": gender,
                "uAgeGroup": ageGroup,
                "interests": grabInterestValues("true").trim(),
                "uPwd": document.querySelector("#signupPwd").getAttribute("pwd"),
                "lastLogin": `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
            }, "createUser")

            chrome.storage.local.set({
                "score"   : 0,
                "username": name,
                "email"   : email,
                "tag"     : "",
                "cart"    : {count: 0},
                "currentSection": "recommendations",
                "pwd"     : document.querySelector("#signupPwd").getAttribute("pwd")
            })

            document.querySelector("#score").textContent = 0
            document.querySelector("#header").style.display = "flex"
            document.querySelector("#username").textContent = name

            document.querySelector("#loader").style.display = "none"
            navigateTo("signupForm", "recommendations")
        }
    }
})

function grabInterestValues(createUser = "") {
    const nameElements = ["Clothing", "Food", "Electronics", "Furniture"]
    let selected = 0
    let interests = ""
    
    nameElements.forEach((item) => {
        if(document.getElementsByName(item)[0].checked) {
            if(createUser == "") selected++
            else {
                interests += document.getElementsByName(item)[0].value + " "
            }
        }
    })
    
    if(createUser == "")    return selected
    else return interests
}

document.querySelector("#interestOptions").addEventListener("click", (el) => {
    const totalSelected = grabInterestValues()

    if(totalSelected >= 3) {
        document.querySelector("#signupError").style.visibility = "visible"
        document.querySelector("#signupError").textContent = "A max  of 2 interests can be selected"

        document.querySelector("#submitSignupForm").style.visibility = "hidden"
        
    } else {
        document.querySelector("#submitSignupForm").style.visibility = "visible"

        document.querySelector("#signupError").style.visibility = "hidden"
    }
})

document.querySelector("#feedbackType").addEventListener("click", (e) => {
    if(e.target.value === "Brand Feeback") 
        document.querySelector("#brandsFeedbackDiv").style.visibility = "visible"
    else document.querySelector("#brandsFeedbackDiv").style.visibility = "hidden"
})

document.querySelector("#submitFeedback").addEventListener("click", async (el) => {
    el.preventDefault()

    let msg = document.querySelector("#feedbackMsg").value
    const type = document.querySelector("#feedbackType").value

    if(msg == "") {
        document.querySelector("#feedbackError").style.visibility = "visible"
        document.querySelector("#feedbackError").textContent = "Please provide a message"
    } else if(type == "default") {
        document.querySelector("#feedbackError").style.visibility = "visible"
        document.querySelector("#feedbackError").textContent = "Please select a feedback type"
    } else {
        document.querySelector("#feedbackError").style.visibility = "hidden"

        let sendTo = ""
        // if the feeback is BRANDS FEEDBACK, then the email shoudl be sent to the particular brand email
        if(type === "Brand Feeback") {
            sendTo = document.querySelector("#brandsFeedback").value.toLowerCase()
            if(document.querySelector("#brandsFeedbackDiv").style.visibility === "hidden") {
                document.querySelector("#brandsFeedbackDiv").style.visibility = "visible"
                document.querySelector("#feedbackError").style.visibility = "visible"
                document.querySelector("#feedbackError").textContent = "Make sure that you want to submit the feedback to the selected brand only "
                return
            }
        }

        chrome.storage.local.get(["email", "username"]).then(async (data) => {
            const res = await glitchCall({
                "email" : data["email"],
                "name"  : data["username"],
                "type"  : type,
                "msg"   : msg,
                "sendTo": sendTo
            }, "createFeedback")

            document.querySelector("#feedbackMsg").value = ""

            document.querySelector("#feedbackType").value = "default"
            document.querySelector("#brandsFeedbackDiv").style.visibility = "hidden"

            if(res.includes("Achievement")) {
                chrome.tts.speak(
                    `Hi ${data["username"]}, your first feedback was successfully submitted. Congrats on unlocking the feedback badge. Go to the rewards section to view more`, 
                    {'enqueue': true, 'volume': 0.7}    
                )
            } else {
                chrome.tts.speak(
                    `Hi ${data["username"]}, your feedback was successfully submitted`, 
                    {'enqueue': true, 'volume': 0.7}    
                )
            }
        })
    }
})

async function populateBrands() {
    var requestOptions = {
    method: 'GET',
    redirect: 'follow'
    };

    let brands = await fetch(`${NODE_SERVER_URL}/listBrands`, requestOptions)
    .then(response => response.text())
    .then(result => result)
    .catch(error => console.log('error', error));

    if(brands.includes("ERROR")) {
        chrome.tts.speak(
            `No brands are available as of now`, 
            {'enqueue': true, 'volume': 0.7}
        )
    } else {
        brands = JSON.parse(brands)
    
        const brandDiv = document.querySelector("#brandName")
        const option = document.createElement("option")
        option.setAttribute("value", "default")
        option.textContent = "Select all brands"
        brandDiv.appendChild(option)

        brands.forEach((item) => {
            const option = document.createElement("option")
            option.setAttribute("value", item["bName"].toLowerCase())
            option.textContent = item["bName"].toUpperCase()
            brandDiv.appendChild(option)
        })
    }
}

async function populateProducts(products) {
    document.querySelector("#filterRecommendations").value = ""
    document.querySelector("#filterRecommendations").style.display = "block"
    
    const mainDiv = document.querySelector("#brandsProducts")
    mainDiv.textContent = ""

    products = JSON.parse(products)

    await chrome.storage.local.get(["cart"]).then(async data => {
  
        for(let a=0; a<products.length; a++) {

            const mainContainer = document.createElement("div")
            mainContainer.style.width = "90%"
            mainContainer.style.margin = "auto"

            const firstChild = document.createElement("div")
            firstChild.style.display = "flex"
            firstChild.style.borderRadius = "10px"
            firstChild.style.alignItems = "center"
            firstChild.style.justifyContent = "space-between"
            firstChild.style.background = "rgb(240, 240, 240)"

            const firstPara = document.createElement("p")
            firstPara.style.fontSize = "1rem"
            firstPara.style.cursor = "pointer"
            firstPara.textContent = products[a]["pName"]

            let addIcon = document.createElement("img")
            addIcon.width = 20
            addIcon.height = 20
            addIcon.style.cursor = "pointer"
            
            let showAddIcon = true
            // count for cart is 0 for empty carts
            if(data["cart"].count > 0) {
                for(let object in data["cart"]) {
                    if(object === products[a]["pLoc"]) {
                        showAddIcon = false
                        break
                    }
                }                
            }

            addIcon.addEventListener("click", 
                async (   event, 
                    name    = products[a]["pName"], 
                    company = products[a]["companyName"].toUpperCase(), 
                    desc    = products[a]["pDesc"], 
                    img     = products[a]["pLoc"],
                    price   = products[a]["pPrice"],
                    pickup  = products[a]["pickup"]
                ) => {
                    // Adding the object to the CART
                    if(event.target.getAttribute("id") === "add" && data["cart"].tagAmount == 0) {
                        await chrome.storage.local.get(["cart"]).then(row => {
                            let newCart   = row["cart"]
                            newCart.count = row["cart"].count + 1
                            newCart[img] = {
                                "company" : company,
                                "desc"    : desc,
                                "name"    : name,
                                "price"   : price,
                                "pickup"  : pickup
                            }
                            
                            chrome.storage.local.set({
                                "cart" : newCart
                            })

                            cartCount.textContent = parseInt(cartCount.textContent) + 1

                            // replace the button with the MINUS BUTTON
                            event.target.src = "https://img.icons8.com/fluency/30/minus.png"
                            event.target.setAttribute("id", "minus")
                        })
                    } else if(event.target.getAttribute("id") === "add" && data["cart"].tagAmount > 0) {
                        document.querySelector("#error").style.visibility = "visible"
                        document.querySelector("#error").textContent = "Complete the last pickup order first"
                    }
                    // deleting the object from the CART
                    else if(event.target.getAttribute("id") === "minus") {
                        await chrome.storage.local.get(["cart"]).then(row => {
                            let newCart = row["cart"]
                            newCart.count = row["cart"].count - 1
                            delete newCart[img]

                            chrome.storage.local.set({
                                'cart': newCart
                            })

                            cartCount.textContent = parseInt(cartCount.textContent) - 1

                            // replace the button with the ADD BUTTON
                            event.target.src = "https://img.icons8.com/fluency/30/add--v1.png"
                            event.target.setAttribute("id", "add")
                        })
                    }
            })

            if(showAddIcon) {
                addIcon.src = "https://img.icons8.com/fluency/30/add--v1.png"
                addIcon.setAttribute("id","add")
            } else {
                addIcon.src = "https://img.icons8.com/fluency/30/minus.png"
                addIcon.setAttribute("id","minus")
            }

            const secondPara = document.createElement("p")
            secondPara.style.fontSize = "1rem"
            secondPara.innerHTML = `By <b>${products[a]["companyName"].toUpperCase()}</b>`

            firstChild.appendChild(firstPara)
            firstChild.appendChild(secondPara)
            firstChild.appendChild(addIcon)

            const secondChild = document.createElement("div")
            secondChild.style.width = "100%"
            secondChild.style.padding = "10px"
            secondChild.style.display = "flex"
            secondChild.style.alignItems = "center"
            secondChild.style.justifyContent = "space-evenly"

            const secondChildDiv = document.createElement("div")
            
            const pDesc = document.createElement("p")
            pDesc.textContent = products[a]["pDesc"]

            const price = document.createElement("p")
            price.textContent = `$ ${products[a]['pPrice']}`
            
            const emptyPara = document.createElement("p")

            const pDetails = document.createElement("p")
            let gender = products[a]["pGender"]
            let ageGroup = products[a]["pAgeGroup"]
            
            if(gender == "m") gender = "males" 
            else if(gender == "f")  gender = "females"
            else gender = "every gender"
            
            if(ageGroup == "everyone") ageGroup = "every"

            pDetails.innerHTML = `This product is listed for<b>${gender}</b> & for <b>${ageGroup} age group</b>`

            secondChildDiv.appendChild(pDesc)
            secondChildDiv.appendChild(price)
            secondChildDiv.appendChild(emptyPara)
            secondChildDiv.appendChild(pDetails)

            const img =  document.createElement("img")
            img.src = products[a]["pLoc"]
            img.style.borderRadius = "20px"
            img.setAttribute("width", "80px")
            img.setAttribute("height", "80px")

            if(a%2 == 0) {
                secondChild.appendChild(secondChildDiv)
                secondChild.appendChild(img)
            } else {
                secondChild.appendChild(img)
                secondChild.appendChild(secondChildDiv)
            }

            mainContainer.appendChild(firstChild)
            mainContainer.appendChild(secondChild)

            mainDiv.appendChild(mainContainer)
        }

    })
} 

document.querySelector("#getBrands").addEventListener("click", async (el) => {
    el.preventDefault()

    let category = document.querySelector("#brandCategory").value
    let gender = document.querySelector("#brandGender").value
    let age = document.querySelector("#brandAge").value

    console.log("Category: " + category + " gender: " + gender + " age: " + age)

    let products = await glitchCall({
        "company" : document.querySelector("#brandName").value,
        "category": category,
        "gender"  : gender,
        "age"     : age
    }
    ,"getBrandProducts")

    if(products.includes("ERROR")) {
        document.querySelector("#brandsProducts").innerHTML = ""
        chrome.tts.speak(
            `${products.split(":")[1]}`, 
            {'enqueue': true, 'volume': 0.7}
        )
    }
    else {
        populateProducts(products)
    }
})

// event listener for the ai button
document.querySelector(".ai").addEventListener("click", (e) => {
    if(e.target.checked) {
        document.querySelector("#aiText").style.color = "#2196F3"
        document.querySelector("#notAI").style.display = "none"
        document.querySelector("#aiSection").style.display = "block"
        document.querySelector("#aiError").style.visibility = "none"
        document.querySelector("#filterRecommendations").style.display = "none"
    }
    else {
        document.querySelector("#filterRecommendations").style.display = "none"

        document.querySelector("#aiText").style.color = "black"
        document.querySelector("#notAI").style.display = "block"
        document.querySelector("#aiSection").style.display = "none"
        document.querySelector("#aiPrompt").value = ""
    }
    document.querySelector("#brandsProducts").innerHTML = ""
})

function randomPrompt() {
    const prompts = [
        "Products for male",
        "What are the products provided by adidas",
        "Provide the details for food products for kids",
        "What are the products that can be used by females",
        "Can you list all of the details of clothing products"
    ]

    return prompts[Math.floor(Math.random() * prompts.length)] 
}

document.querySelector("#aiPrompt").addEventListener("click", (e) => {
    e.target.value = randomPrompt()
})

document.querySelector("#aiPrompt").addEventListener("keydown", async (e) => {
    if(e.key === "Enter") {
        if(e.target.value.length < 10) {
            document.querySelector("#aiError").textContent = "Alteast provide a prompt of 10 charcaters"
            document.querySelector("#aiError").style.visibility = "visible"

            document.querySelector("#filterRecommendations").style.display = "none"
        } 
        // fetch the result from the Chat2Query API
        else {
            document.querySelector("#brandsProducts").innerHTML = ""

            document.querySelector("#aiError").textContent = ""
            document.querySelector("#aiError").style.visibility = "hidden"

            document.querySelector("#aiLoader").style.display = "block"

            // calling the reqired backend endpoint:
            let products = await glitchCall({
                "prompt" : e.target.value
            }
            ,"chat2Query")
        
            if(products.includes("ERROR")) {
                chrome.tts.speak(
                    `${products.split(":")[1]}`, 
                    {'enqueue': true, 'volume': 0.7}
                )

                document.querySelector("#filterRecommendations").style.display = "none"

                document.querySelector("#aiError").textContent = products.split(":")[1]
                document.querySelector("#aiError").style.visibility = "visible"
            } 
            else {
                document.querySelector("#aiError").textContent = ""
                document.querySelector("#aiError").style.visibility = "hidden"
                
                populateProducts(products)

                document.querySelector("#filterRecommendations").style.display = "block"
            }
        }
        document.querySelector("#aiLoader").style.display = "none"
    }
})

document.querySelector("#mlImageInput").addEventListener('change', async(event) => {
    if(event.target.files.length) {
        try {
            document.querySelector("body").style.pointerEvents = "none"
            document.querySelector("#mlLoader").style.visibility = "visible"

            console.log(event.target.files)

            let formdata = new FormData();
            formdata.append("productImg", event.target.files[0]);
            
            await chrome.storage.local.get(["email"]).then(data => {
                formdata.append("email",  data['email'])
            })

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            const productName = ""
            
            // Step1: Save the uploaded image to the openshift/temp folder
            const tmpFileName = await fetch(`https://versatilevats.com/ennovation/server.php?action=runMLInference&productName=${productName}`, requestOptions)
                .then(response => response.text())
                .then(result => result)
                .catch(error => console.log('error', error));
            
            const labels = await fetch(`${ML_MODEL_URL}?image=${tmpFileName}&by=customer`)
                .then(data => data.json())
                .then(data => {
                    console.log(data)
                    return Object.keys(data)
                })
            
            console.log(labels)
            // deleting the image
            fetch(`https://versatilevats.com/ennovation/server.php?action=unlinkMLImages&image=${tmpFileName}`)

            // doing the manipulations:
            let products = await glitchCall({
                "labels" : labels
            }
            ,"getLabelProducts")

            populateProducts(products)

            document.querySelector("#mlImageInput").value = ''
            document.querySelector("#mlLabels").style.display = "block"
            document.querySelector("#mlLabels").innerHTML = `Fetched: <b>${(labels.join(" ")).toUpperCase()}</b> images`

            document.querySelector("body").style.pointerEvents = "auto"
            document.querySelector("#mlLoader").style.visibility = "hidden"
        } catch(err) {
            document.querySelector("#error").style.visibility = "visible"
            document.querySelector("#error").textContent = "Network error! Try again"
        }
    }
})