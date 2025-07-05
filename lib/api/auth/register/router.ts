const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fungsi helper convert file image ke base64
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject("Gagal konversi file ke base64");
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

export async function registerUser(
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  photo: File | string,
  role: string,
  password: string
) {
  try {
    let photoBase64: string;

    if (!photo) {
      throw new Error("Foto profil wajib diunggah");
    }

    if (photo instanceof File) {
      photoBase64 = await convertFileToBase64(photo);
      if (!photoBase64 || typeof photoBase64 !== "string") {
        throw new Error("Gagal mengonversi foto ke format base64");
      }
    } else if (typeof photo === "string" && photo.startsWith("data:image")) {
      photoBase64 = photo;
    } else {
      throw new Error("Foto profil harus berupa gambar dalam format base64");
    }

    const payload = {
      email,
      first_name: firstName,
      last_name: lastName,
      role,
      password,
      file_base64: photoBase64,
    };

    console.log("User ID untuk pendaftaran:", userId);

    const response = await fetch(
      `${API_BASE_URL}auth/register?id_role=${encodeURIComponent(userId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message;
      throw new Error(errorMessage || "Gagal mendaftar");
    }

    return {
      message: data.message || "Pendaftaran berhasil",
      user_id: data.user?.user_id || data.user_metadata?.sub || null,
      access_token: data.access_token,
      role: data.user?.role || role || "user",
    };
  } catch (error) {
    throw new Error(
      (error as Error).message || "Terjadi kesalahan saat mendaftar"
    );
  }
}
