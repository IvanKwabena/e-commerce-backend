// const removeDuplicates = (arr) => {
//   let temp = arr[0];
//   let count = 1;

//   for (let i = 1; i < arr.length; i++) {
//     if (arr[i] > temp) {
//       temp = arr[i];
//       arr[count] = temp;
//       count++;
//     }
//   }
//   return console.log(count);
// };

// var removeDuplicates = function (nums) {
//   let lastIndex = 1;

//   for (let i = 0; i < nums.length - 1; i++) {
//     if (nums[i] != nums[i + 1]) {
//       nums[lastIndex] = nums[i + 1];
//       lastIndex += 1;
//     }
//   }

//   return console.log(lastIndex);
// };
// removeDuplicates([1, 1, 1, 2, 3, 3, 4, 5, 6]);

let names = ['Ivan', 'Bro', 'Sam'];

function addNames(a, b, arr, find, callback) {
  let findme = find;
  let sum = a + b;

  for (let i = 0; i < arr.length; i++) {
    if (findme === names[i]) {
      callback(`Hello there ${findme} your sum is ${sum}`);
    }
  }
}

addNames(16, 4, names, 'Ivan', (data) => {
  console.log(data);
});
