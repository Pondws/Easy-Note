const config = {
    headers: () => {
        return {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    }
}

export default config