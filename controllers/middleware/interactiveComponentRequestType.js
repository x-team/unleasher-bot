import {
    handleGoalCreated,
    handleCreateUnleashGoalChoice,
    handleSelectOrCreateGoalChoice,
    handlePostGoalCreatedChoice,
    handleUnleashStatusUpdateChoice,
} from '../../handlers/main'
import { IM_CREATE_UNLEASH_GOAL } from '../../handlers/bot/conversations/createUnleashGoal'
import { DIALOG_CREATE_UNLEASH_GOAL } from '../../handlers/api/slack/dialog'
import { IM_START_UNLEASH, IM_UNLEASH_STATUS_UPDATE } from '../../handlers/bot/conversations/weeklyUnleash'
import { IM_POST_GOAL_CREATED } from '../../util/formatter'

const IC_TYPE_DIALOG = 'dialog_submission'
const IC_TYPE_MESSAGE = 'interactive_message'
const IC_ACTION_BUTTON = 'button'
const IC_ACTION_SELECT = 'select'

export default async (req, res, next) => {
    if (req.body.payload) {
        const payload = JSON.parse(req.body.payload)
        switch (payload.type) {
        case IC_TYPE_DIALOG:
            switch (payload.callback_id) {
            case DIALOG_CREATE_UNLEASH_GOAL.callbackId:
                res.locals = { respond: false }
                handleGoalCreated(payload)
                break

            default:
                console.log(`Unsupported callback id: ${payload.callback_id}`)
                break
            }

            break

        case IC_TYPE_MESSAGE:
            switch (payload.actions[0].type) {
            case IC_ACTION_BUTTON:
                res.locals = { respond: true }
                switch (payload.callback_id) {
                case IM_CREATE_UNLEASH_GOAL.callbackId:
                    res.locals.message = await handleCreateUnleashGoalChoice(payload)
                    console.log('locals:', res.locals)
                    break

                case IM_START_UNLEASH.callbackId:
                    res.locals.message = await handleSelectOrCreateGoalChoice(payload)
                    break

                case IM_POST_GOAL_CREATED.callbackId:
                    res.locals.message = await handlePostGoalCreatedChoice(payload)
                    break

                case IM_UNLEASH_STATUS_UPDATE.callbackId:
                    res.locals.message = await handleUnleashStatusUpdateChoice(payload)
                    break
                
                default:
                    res.locals.message = `Unsupported button callbackId: ${payload.callback_id} - please contact admin.`
                    break
                }
                
                break

            case IC_ACTION_SELECT:
                res.locals = { respond: true }
                switch (payload.callback_id) {
                case IM_START_UNLEASH.callbackId:
                    res.locals.message = await handleSelectOrCreateGoalChoice(payload)
                    break
                
                case IM_UNLEASH_STATUS_UPDATE.callbackId:
                    res.locals.message = await handleUnleashStatusUpdateChoice(payload)
                    break

                default:
                    res.locals.message = `Unsupported menu callbackId: ${payload.callback_id} - please contact admin.`
                    break
                }

                break

            default:
                res.locals.message = `Unsupported message actions type: ${payload.actions[0].type} - please contact admin.`
                break
            }

            break
            
        default:
            res.locals.message = `Unsupported payload type: ${payload} - please contact admin.`
            break
        }
    }
    next()
}
