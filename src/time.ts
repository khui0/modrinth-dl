export function timeSince(date: Date) {
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  const elapsed = Date.now() - date.getTime();

  if (elapsed < minute) {
    return Math.round(elapsed / 1000) + " second(s) ago";
  } else if (elapsed < hour) {
    return Math.round(elapsed / minute) + " minute(s) ago";
  } else if (elapsed < day) {
    return Math.round(elapsed / hour) + " hour(s) ago";
  } else if (elapsed < month) {
    return Math.round(elapsed / day) + " day(s) ago";
  } else if (elapsed < year) {
    return Math.round(elapsed / month) + " month(s) ago";
  } else {
    return Math.round(elapsed / year) + " year(s) ago";
  }
}
