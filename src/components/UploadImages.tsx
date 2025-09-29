import axios from "axios";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
const Url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export default function UploadImages() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (event) => {
    const fileNames = Array.from(event.target.files);

    setFiles(fileNames);

    const filesPreview = fileNames.map((file) => URL.createObjectURL(file));

    setPreviews(filesPreview);
  };

  const handleUpload = async () => {
    const urls = [];

    try {
      setIsLoading(true);

      for (const file of files) {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("cloud_name", CLOUD_NAME);

        const res = await axios.post(Url, formData);

        urls.push(res.data.url);
      }

      setImageUrls(urls);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-200 rounded">
      <div className="border w-[50%] text-center py-3 bg-white">
        <p className="text-2xl font-bold">Upload Images</p>
      </div>
      <div className="border w-[50%] p-5 bg-white">
        {isLoading && (
          <div className="flex justify-center items-center">
            <ClipLoader />
          </div>
        )}

        {previews.length > 0 && (
          <div className="flex flex-col justify-center items-center gap-3">
            <h3>Danh sách hình ảnh xem trước:</h3>
            <div className="flex gap-3">
              {previews.map((prev, index) => (
                <img height={200} width={250} src={prev} key={index} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-[50%] flex justify-center items-center border bg-white p-3 gap-3">
        <input
          multiple
          className="border px-3 py-1 rounded"
          onChange={handleChange}
          type="file"
        />
        <button
          className="bg-blue-600 text-white rounded px-3 py-1"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
      <div className="border w-[50%] flex flex-col justify-center items-center bg-white p-5">
        {imageUrls.length > 0 && (
          <div>
            <h3>Danh sách hình ảnh sau khi upload:</h3>
            <div className="flex gap-3">
              {imageUrls.map((prev, index) => (
                <img height={200} width={250} src={prev} key={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
