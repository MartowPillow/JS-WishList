function packageJson() {
    return JSON.stringify({
        "name": "dredd-testing",
        "dependencies": {
            "dredd": "14.0.0"
        },
        "scripts": {
            "test": "dredd ../swagger/swagger.yml http://127.0.0.1:10200"
        }
    })
}


module.exports = () => {
    return [
        {
            path: 'package.json',
            content: packageJson()
        }
    ]
}