const MAX_LENGTH=5

function generateRandomString(){
    let ans=""
    const subset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    for(let i=0;i<MAX_LENGTH;i++){
        ans+=subset[Math.floor(Math.random()*subset.length)]
    }
    return ans
}

export {generateRandomString}