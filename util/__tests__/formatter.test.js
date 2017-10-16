const formatter = require('../formatter')

test('it should format unachieved goals for option dropdown', () => {
  const goals = [
    {achieved:false, id:1 , name:"unchieved_1"},
    {achieved:true, id:2 , name:"achieved_1"},
    {achieved:false, id:3 , name:"unachieved_2"}
  ]
  const result = [
    {text:"unchieved_1", value:1},
    {text:"unachieved_2", value:3}
  ]

  expect(formatter.goalsToOptions(goals)).toEqual(result)
})
