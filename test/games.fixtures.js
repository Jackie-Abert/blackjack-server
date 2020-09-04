function makeUsersArray() {
    [
        {id:1, user_name:"bob", password:"password123"},
        {id:2, user_name:"bob", password:"password123"},
        {id:3, user_name:"bob", password:"password123"},
    ]
}


function makeGamesArray() {
  return [
    {
      id: 2,
      bank: 360055,
      wins: 9,
      losses: 22,
      moneywon: 37000,
      user_id:1
    },
    {
      id: 3,
      bank: 10200,
      wins: 3,
      losses: 5,
      moneywon: 440,
      user_id:2
    },
    {
      id: 4,
      bank: 56000,
      wins: 66,
      losses: 4,
      moneywon: 25000,
      user_id:3
    },
  ];
}

module.exports = {
  makeGamesArray,
  makeUsersArray
};
