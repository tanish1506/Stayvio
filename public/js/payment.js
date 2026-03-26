const payNowBtn = document.getElementById("payNowBtn");

if(payNowBtn){
    payNowBtn.addEventListener('click',async function(){
        const bookingId = this.dataset.bookingId;
        const amount = this.dataset.amount;
        const listingName = this.dataset.name;
        const userName = this.dataset.user;
        const userEmail = this.dataset.email;
        const originalText = this.textContent;
        const btn = this;

        btn.disabled = true;
        btn.textContent = 'Processing...';

        try{
            const response = await fetch(`/bookings/${bookingId}/payment/create`,{
                method : 'POST',
                headers : {'Content-Type' : 'application/json'}
            });
            const order = await response.json();

            if(order.error){
                alert(order.error);
                btn.disabled = false;
                btn.textContent = originalText;
                return;
            }

            const options = {
                key: order.key_id,
                amount: order.amount,
                currency : order.currency,
                name : 'Stayvio',
                description : `Booking for ${listingName}`,
                order_id : order.order_id,
                handler : async function (paymentResponse) {
                    const verifyResponse = await fetch('/payment/verify',{
                        method:'POST',
                        headers : {'Content-Type' : 'application/json'},
                        body : JSON.stringify({
                            razorpay_order_id : paymentResponse.razorpay_order_id,
                            razorpay_payment_id : paymentResponse.razorpay_payment_id,
                            razorpay_signature : paymentResponse.razorpay_signature,
                            booking_id : order.booking_id,
                        })
                    });
                    const result = await verifyResponse.json();

                    if(result.redirect){
                        window.location.href = result.redirect;
                    }
                },
                prefill : {
                    name : userName,
                    email : userEmail,
                },
                theme : {color : '#fe424d'},
                modal : {
                    ondismiss : function(){
                        btn.disabled = false;
                        btn.textContent = originalText;
                    }
                }
            };
            
            const rzp = new Razorpay(options);
            rzp.open();
        }
        catch(err){
            alert('Something went wrong. Please try again.');
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
}