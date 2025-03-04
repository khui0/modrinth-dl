export function error(message: string) {
  console.error(
    `%cError%c: ${message}`,
    "color: red; font-weight: bold",
    "color: unset; font-weight: normal"
  );
}

export function warn(message: string) {
  console.error(
    `%cWarning%c: ${message}`,
    "color: yellow; font-weight: bold",
    "color: unset; font-weight: normal"
  );
}

export function success(message: string) {
  console.error(
    `%cSuccess%c: ${message}`,
    "color: green; font-weight: bold",
    "color: unset; font-weight: normal"
  );
}
