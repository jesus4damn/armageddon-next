import { combineReducers } from "redux"
import destroyReducer from "./destroyReducer"

export const rootReducer = combineReducers({
    destroy: destroyReducer
})

export type RootState = ReturnType<typeof rootReducer>