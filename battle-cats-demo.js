CatStats = new Mongo.Collection('catstats');
CatWins = new Mongo.Collection('catwins');

if (Meteor.isClient) {
  var cat1, cat2, selectedCat;

  Template.main.helpers({
    'cats': function () {
      console.log('retrieving cats');
      
      // Session variable causes helper to be reactive and forces helper to reload when variable changes
      var currentBattle = Session.get('battleNumber');

      if (!cat1) {
        cat1 = chooseRandomNumber(0, 13);
        console.log('Loading cat1: ', cat1);
      }
      
      if (!cat2) {
        cat2 = chooseRandomNumber(0, 13, cat1);
        console.log('Loading cat2: ', cat2);
      }

      return { cat1: cat1, cat2: cat2 };
    },
    'battleNumber': function () {
      return Session.get('battleNumber');
    },
    'battleResults': function () {
      return CatWins.find({}, { sort: { numberWins: -1 }});
    }
  });

  Template.main.events({
    'click .catChoice': function (e, t) {
      var elem = e.currentTarget;
      //data-cat was not updating the winningCat, had to revert to attribute
      var winningCat = $(elem).attr('cat');

      console.log('clicked cat: ', winningCat);

      if (selectedCat) {
        return
      } else {
        selectedCat = true;
      }

      CatStats.insert({
        catName: winningCat,
        battleNumber: Session.get('battleNumber')
      });

      var catWinsDoc = CatWins.findOne({ catName: winningCat });

      if (!catWinsDoc) {
        CatWins.insert({ catName: winningCat, numberWins: 1 });
      } else if (catWinsDoc) {
        CatWins.update({ _id: catWinsDoc._id }, { $inc: { numberWins: 1 }});
      }

      var id = $(elem).attr('id');
      var winningCatNum;
      if (id === 'cat1') {
        winningCatNum = 1
      } else if (id === 'cat2') {
        winningCatNum = 2
      }

      $('#results').text('Cat ' + winningCatNum + ' Wins! Loading Next Battle ...');

      setTimeout(function () {
        $('#results').text('');

        console.log('Resetting cats');
        selectedCat = false;
        cat1 = null;
        cat2 = null;

        Session.set('battleNumber', Session.get('battleNumber') + 1);
      }, 1000)
    }
  });

  Meteor.startup(function () {
    Session.set('battleNumber', 1);
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
