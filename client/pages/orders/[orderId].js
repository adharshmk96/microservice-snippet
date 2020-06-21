import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import userRequest from '../../hooks/use-request'
import Router from 'next/router'

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0)
    const { doRequest, errors } = userRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => Router.push('/orders')
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000))
        }
        findTimeLeft()
        const timerId = setInterval(findTimeLeft, 1000)

        return () => {
            clearInterval(timerId)
        }
    }, [])

    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }


    return <div>
        {timeLeft} Seconds until order Expires
        <StripeCheckout
            token={(token) => doRequest({ token: token.id })}
            stripeKey="pk_test_51GwBxeHYfyEeMAu5ZmGSCIUrwTFmbeNsndpZ8Vtqb8FNy6L1rdTWuZ5DNzX63nHg1S030XEpIxlbivlBkHU90vCX00VivuD8Ve"
            amount={order.ticket.price}
            email={currentUser.email}
        />
    </div>
}

OrderShow.getInitialProps = async (ctx, client) => {
    const { orderId } = ctx.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data }
}

export default OrderShow