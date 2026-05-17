/**
 * Turn a failed fetch Response into a short user-facing message.
 */
export async function parseApiErrorMessage(
  response: Response,
  fallback = 'Something went wrong. Please try again.'
): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    if (typeof data?.error === 'string' && data.error.trim()) {
      return data.error.trim();
    }
    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message.trim();
    }
  } catch {
    // non-JSON body
  }

  if (response.status === 404) {
    return 'We could not find what you were looking for.';
  }
  if (response.status === 401 || response.status === 403) {
    return 'You do not have permission to do that. Try signing in again.';
  }
  if (response.status >= 500) {
    return fallback;
  }
  return fallback;
}
