import Follow from "../models/followModel.js";

export const followUserIds = async (identityUserId) => {
  try {
    //Sacar Información de seguimiento
    let following = await Follow.find({ "user": identityUserId })
      .select({ "followed": 1, "_id":0 })
      .exec();

    let followers = await Follow.find({ followed: identityUserId })
      .select({ "user": 1, "_id": 0 })
      .exec();

    //Procesar array de identificadores
    let following_clean = [];
    following.forEach((follow) => {
      following_clean.push(follow.followed);
    });

    let followers_clean = [];
    followers.forEach((follow) => {
      followers_clean.push(follow.user);
    });

    return {
      following: following_clean,
      followers: followers_clean,
    };
    
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const followThisUser = async (identityUserId, profileUserId) => {
  //Verificar que los parámetros estén definidos
  if (!identityUserId || !profileUserId) {
    throw new Error("Parámetros inválidos");
  }

  //Sacar info de seguyuiendo
  let following = await Follow.findOne({
    user: identityUserId,
    followed: profileUserId,
  })


  let follower = await Follow.findOne({
    user: profileUserId,
    followed: identityUserId,
  })


  return {
    following,
    follower
  };
};

