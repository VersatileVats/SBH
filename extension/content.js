chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        const tag = document.querySelector("#tag")
        const card = document.querySelector("#card")
        const email = document.querySelector("#email")
        const items = document.querySelector("#items")
        const payout = document.querySelector("#payout")
        const process = document.querySelector("#process")
        const totalPrice = document.querySelector("#totalPrice")
        const pickupTotal = document.querySelector("#pickupTotal")
        const pickupDetails = document.querySelector("#pickupDetails")
        
        const tagPayment = document.querySelector("#tagPayment")
        const paymentInfo = document.querySelector("#paymentInfo")
        const currentPayment = document.querySelector("#currentPayment")

        const {cart, userEmail, cartTotal, pickupPrice, squareTag} = request
        console.log(cart)

        payout.style.display = "block"
        paymentInfo.style.display = "block"

        if(squareTag !== "" && pickupPrice > 0) {
            pickupDetails.style.display = "block"
            tag.textContent = squareTag
            pickupTotal.textContent = pickupPrice
        } else {
            card.style.display = "block"
            process.style.display = "block"
        }

        tagPayment.textContent = pickupPrice
        currentPayment.textContent = cartTotal - pickupPrice

        email.textContent = userEmail
        items.textContent = cart.count
        totalPrice.textContent = cartTotal

        sendResponse("Success!!")
    }
)