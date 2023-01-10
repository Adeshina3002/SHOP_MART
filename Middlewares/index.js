const now = new Date()

let age
const getAge = (birthYear) => {
    age = now.getFullYear() - birthYear
    // console.log(age);
    return age
}





module.exports = {getAge}
