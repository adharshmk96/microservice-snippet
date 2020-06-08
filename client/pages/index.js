const LandingPage = ({ color }) => {
    console.log("I'm in Component", color)
    return <h1>Landing Pages</h1>
}

LandingPage.getInitialProps = () => {
    console.log("i'm in the server")
    return { color: "red" }
}

export default LandingPage;