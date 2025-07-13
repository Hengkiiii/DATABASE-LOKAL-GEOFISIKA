const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Biarkan error dilempar ke handleSubmit
    throw new Error(data.message || "Login gagal");
  }

  return {
    message: "Login berhasil",
    user_id: data.user_metadata?.sub || data.user_id || null,
    access_token: data.access_token,
    role: data.role || "user",
  };
}
