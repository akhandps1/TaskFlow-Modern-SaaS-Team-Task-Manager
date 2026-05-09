export function getApiErrorMessage(error) {
  const payload = error?.response?.data;
  const status = error?.response?.status;

  if (status === 401 || payload?.message === "Unauthorized") {
    return "";
  }

  if (payload?.errors?.length) {
    return payload.errors.map((item) => item.message).join(", ");
  }

  return payload?.message || "Something went wrong. Please try again.";
}