import { ADD_TO_DESTROY, REMOVE_FROM_DESTROY } from "./actionTypes";
import { IMeteor } from "../../interafces/commonInterfaces";

export type DestroyActions =
    {type: typeof ADD_TO_DESTROY, meteor: IMeteor} |
    {type: typeof REMOVE_FROM_DESTROY, id: string}