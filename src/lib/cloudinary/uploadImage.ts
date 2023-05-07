export default async function uploadImage(image: File) {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "socialMedia");

  const cloudinaryRes = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  return await cloudinaryRes.json();
}
