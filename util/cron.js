import cron from 'node-cron'
import { getTeamUsers } from '../handlers/api/slack'
import * as botHandler from '../handlers/bot'

// const WEEKLY_STATUS_UPDATE_CRON_INTERVAL = '0 8 * * 1' // every Monday at 8 AM
const WEEKLY_STATUS_UPDATE_CRON_INTERVAL = '*/2 * * * *'
const startWeeklyStatusUpdateJob = () => {
  cron.schedule(WEEKLY_STATUS_UPDATE_CRON_INTERVAL, async function() {
    let users = await getTeamUsers()
    users.forEach((user) => {
      // remove this if statement when going live
      if (user.name === 'karolsojko') {
        botHandler.weeklyStatusUpdate(user)
      }
    })
  })
}

export {
  startWeeklyStatusUpdateJob,
}
