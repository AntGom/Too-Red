import save from "./newPublication.js";
import detail from "./one.js";
import remove from "./delete.js";
import user from "./user.js";
import upload from "./upload.js";
import feed from "./feed.js";
import editPublication from "./editPublication.js";
import addComment from "../comments/addComment.js";
import getComments from "../comments/getComments.js";
import deleteComment from "../comments/eraseComment.js";
import reportPublication from "../reports/reportPublication.js";
import getReportedPublications from "../reports/reportedPublications.js";
import revertReport from "../reports/revertReport.js";
import getUsersWithReports from "../reports/getUsersWithReports.js";
import addTag from "./tags/addTags.js";
import removeTag from "./tags/removeTags.js";
import taggedPublications from "./tags/taggedPublications.js";
import searchUsers from "./tags/searchUsers.js";

export const publicationController = {
  save,
  detail,
  remove,
  user,
  upload,
  feed,
  editPublication,
  addComment,
  getComments,
  deleteComment,
  reportPublication,
  getReportedPublications,
  revertReport,
  getUsersWithReports,
  addTag,
  removeTag,
  taggedPublications,
  searchUsers
};