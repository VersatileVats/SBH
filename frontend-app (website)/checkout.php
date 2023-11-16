<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Openshift | Checkout Page</title>
    <script type="text/javascript" src="https://sandbox.web.squarecdn.com/v1/square.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
    
    <style>
        * {
            font-family: 'Montserrat', sans-serif;
            user-select: none;
        }
    </style>
</head>
<body style="display: flex; flex-direction: column; align-items: center; justify-content: space-evenly;">
    <p style="text-align: center; font-size: 2rem; margin-top:1rem;"><span style="border: 6px solid black; padding:4px; border-radius: 6px; box-shadow: 4px 4px" id="heading">Checkout Page</span></p>
    
    <div id="payout" style="display:none; margin:auto; max-height: 350px; width:450px; text-align: center; font-size: 1rem">
       <div id="emailBlock" style="display: flex; justify-content: space-between">
           <p><b>Email</b></p>
           <p id="email"></p>
       </div>
       <div id="totalBlock" style="display: flex; justify-content: space-between">
           <p><b>Total Item(s)</b></p>
           <p id="items"></p>
       </div>
       <div id="totalPriceBlock" style="display: flex; justify-content: space-between">
           <p><b>Total Price</b></p>
           <p id="totalPrice"></p>
       </div>
       
       <div id="pickupDetails" style="display: none">
           <div id="tagBlock" style="display: flex; justify-content: space-between">
               <p><b>Square Tag ID</b></p>
               <p id="tag"></p>
           </div>
           <div id="pickupTotalBlock" style="display: flex; justify-content: space-between">
               <p><b>Pickup Total</b></p>
               <p id="pickupTotal">0</p>
           </div>
           <div id="decidePickup" style="display: flex; justify-content: space-between">
               <p id="agreePickup" style="padding: 8px; font-size: 1rem; background: rgba(0,255,0,0.5); border-radius: 8px; font-weight: bold; cursor: pointer" onclick="pickupStuff(this)">Yes, I will pickup</p>
               <p id="rejectPickup" style="padding: 8px; font-size: 1rem; background: rgba(255,0,0,0.5); border-radius: 8px; font-weight: bold; cursor: pointer" onclick="pickupStuff(this)">No, I will not pickup</p>
           </div>
       </div>
    </div>
    
    <div id="paymentInfo" style="width: 450px; display:none; text-align: justify; margin: 15px">You have to make an instant payment of $<span id="currentPayment"></span> and $<span id="tagPayment"></span> will be provided to your Square Tag</div>
    <div id="card" style="display: none;"></div>
    <div id="process" style="display: none; padding: 8px; font-size: 1rem; background: rgba(0,255,0,0.5); border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 10px">Complete Payment</div>
    
    <script>
        // async funtion to grab the function id for the SQUARE PAYMENTS
        async function backendFunction (request, endpoint) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
        
            var raw = JSON.stringify(request);
        
            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
        
            return await fetch(`https://squarehub.glitch.me/${endpoint}`, requestOptions)
            .then(response => response.text())
            .then(result => result)
            .catch(error => error);
        }
        
        
        const pickupStuff = async (event) => {
            if(event.textContent.includes("Yes")) {
                document.querySelector("body").style.pointerEvents = "none"
                
                await backendFunction({
                    "email" : document.querySelector("#email").textContent,
                    "amount": document.querySelector("#pickupTotal").textContent
                },"addAmountTotag")
                alert("Funds added to the Square Tag")
                document.querySelector("body").style.pointerEvents = "auto"
            } else {
                const tagPayment = document.querySelector("#tagPayment")
                const currentPayment = document.querySelector("#currentPayment")
                
                tagPayment.textContent = "0"
                currentPayment.textContent = document.querySelector("#totalPrice").textContent
            }
            
            document.querySelector("#decidePickup").style.display = "none"
            document.querySelector("#card").style.display = "block"
            document.querySelector("#process").style.display = "block"
        }

    
        // doing the SQUARE WEB SDK intialization stuff
        (async() => {
            const payments = Square.payments(
                'sandbox-sq0idb-nYeOJ9nDxAVs1bW4VN_s-A',
                'L8MDTR4RPS026'
            )

            const cardOptions = {
                style: {
                    input: {
                        backgroundColor: 'white'
                    }
                }
            }

            try{
                const card = await payments.card(cardOptions)
                await card.attach('#card')
                const payBtn = document.querySelector("#process")
                payBtn.addEventListener('click', async () => {
                    const result = await card.tokenize()
                    if (result.status == "OK") {
                        const nonce = result.token
                        
                        const payment = await backendFunction({
                            "token" : nonce,
                            "amount": document.querySelector("#totalPrice").textContent - document.querySelector("#pickupTotal").textContent,
                            "email" : document.querySelector("#email").textContent
                        },"processPayments")
                        console.log(payment)
                        
                        console.log(result.token)
                        document.querySelector("#payout").style.display = "none"
                        document.querySelector("#card").style.display = "none"
                        document.querySelector("#process").style.display = "none"
                        document.querySelector("#paymentInfo").style.display = "none"
                        document.querySelector("#heading").innerHTML = `<span style="color: green">Payment Completed</span>`
                    } else {
                        alert("Invalid details")
                    }
                })
            } catch(err) {
                alert(err)
            }
        })()
    </script>
</body>
</html>