let domain = "https://project-2018-backend.herokuapp.com/";
// if ()
// domain = "http://localhost:8000/";

export function getAllNotesUrl() {
  return domain + "posts/all";
}

export function getCreateNoteUrl() {
  return domain + "post/create";
}

export function getUpdateNoteUrl() {
  return domain + "post/update";
}

export function getDeleteNoteUrl() {
  return domain + "post/delete";
}
