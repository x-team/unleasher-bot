import express from 'express'
import { openDialog } from '../handlers/api/slack/dialog'

const router = new express.Router()
const ADD_GOAL_CMD = '/add-goal'

router.post('/commands', async function (req, res) {

    if (req.body.command === ADD_GOAL_CMD) {
        openDialog(req.body.team_id, req.body.trigger_id)
    }

    res.status(200).send()
})

export default router
