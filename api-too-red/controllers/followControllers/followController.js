import  save  from "./follow.js";
import unfollow from "./unfollow.js";
import followingList  from "./followingList.js";
import {followUserIds, followThisUser} from "../../services/followService.js";
import followers from "./followers.js";
import counter from "./counters.js";



export const followControllers = {
    save,
    unfollow,
    followingList,
    followUserIds,
    followThisUser,
    followers,
    counter
};
