const MyOrders = ({ orders }) => {

    const listOrders = orders.map(order => {
        return <li key={order.id}>{order.ticket.title} - {order.status}</li>
    })

    return <ul>{listOrders}</ul>
}

MyOrders.getInitialProps = async (ctx, client) => {
    const { data } = await client.get('/api/orders');

    return { orders: data }
}

export default MyOrders