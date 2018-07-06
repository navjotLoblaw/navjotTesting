exports.getUsers = function getUsers () {
  // Return the Promise right away, unless you really need to
  // do something before you create a new Promise, but usually
  // this can go into the function below
  return new Promise((resolve, reject) => {

      return resolve("result")
    })
  };

  getUsers2 = function getUsers () {
    // Return the Promise right away, unless you really need to
    // do something before you create a new Promise, but usually
    // this can go into the function below
    return new Promise((resolve, reject) => {

        return resolve("result2")
      })
    };
var a;
// Usage:
exports.getUsers()  // Returns a Promise!
  .then(users => {
    console.log(users);
    return new Promise((resolve, reject) => {
a='result 2';
        return resolve(a)
      })
  }).then(users2 => {
    console.log(users2);
  })
  .catch(err => {
    // handle errors
  })
