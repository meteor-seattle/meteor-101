if (Meteor.isClient) {
  var cat1, cat2;

  Template.main.helpers({
    'cats': function () {
      
      if (!cat1) {
        cat1 = chooseRandomNumber(0, 13);
      }
      
      if (!cat2) {
        cat2 = chooseRandomNumber(0, 13, cat1);
      }

      return {cat1: cat1, cat2: cat2};
    }
  });
}

function chooseRandomNumber(min, max, notEqualTo) {
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  if (!notEqualTo) {
    return randomNumber;
  }

  if (randomNumber != notEqualTo) {
    return randomNumber;
  } else {
    return chooseRandomNumber(min, max, notEqualTo);
  }
}
