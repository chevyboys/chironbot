export * from "./Classes/ChironClient"
export * from "./Classes/ChironConfig"
export * from "./Classes/Module"

import * as schedule from "node-schedule"
process.on('SIGINT', function () {
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
})