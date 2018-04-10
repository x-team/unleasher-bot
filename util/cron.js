import cron from 'node-cron'
import { weeklyStatusUpdate } from '../handlers/bot'

const WEEKLY_STATUS_UPDATE_CRON_INTERVAL = '0 12 * * 1'

const startWeeklyStatusUpdateJob = () => {
    cron.schedule(WEEKLY_STATUS_UPDATE_CRON_INTERVAL, async function() {
        weeklyStatusUpdate()
    })
}

export {
    startWeeklyStatusUpdateJob,
}
