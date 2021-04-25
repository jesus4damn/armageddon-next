import { ADD_TO_DESTROY, REMOVE_FROM_DESTROY } from "../types/actionTypes"
import { IMeteor } from "../../interafces/commonInterfaces"

export const addMeteorToDestroy = (meteor: IMeteor) => {
    return {
        type: ADD_TO_DESTROY,
        meteor
    }
}

export const removeMeteorFromDestroy = (id: string) => {
    return {
        type: REMOVE_FROM_DESTROY,
        id
    }
}