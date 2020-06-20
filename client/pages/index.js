import buildClient from '../api/build-client';
import axios from 'axios';

const LandingPage = ({ tickets }) => {
    const ticketList = tickets.map(ticket => (
        <tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
        </tr>
    ))
    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ticketList
                    }
                </tbody>
            </table>
        </div>
    )

}

LandingPage.getInitialProps = async (context, client, currentUser) => {
    // try {
    //     const client = buildClient(context)
    //     const { data } = await client.get('/api/users/currentuser');
    //     return data
    // }
    // catch (err) {
    //     console.log(err.message)
    // }
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
}

export default LandingPage;