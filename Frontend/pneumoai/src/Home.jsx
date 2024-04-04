import React, { useState } from "react";
import "./App.css";
import { MdCloudUpload, MdDelete } from "react-icons/md";

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prediction, setPrediction] = useState(null); // State to store prediction

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileClear = () => {
    setSelectedFile(null);
    setImageUrl(null);
    setPrediction(null); // Clear prediction when clearing file
  };

  const handleUpload = () => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch("https://pnemo.onrender.com/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response data:", data);
        if (data.prediction) {
          setPrediction(data.prediction); // Set prediction in state
        } else {
          throw new Error("Prediction data not found in response");
        }
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
        setPrediction("Error occurred");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <>
      <header>
        <h1>Pneumoai</h1>
      </header>
      <div className="upload-container">
        <main>
          <form>
            <label htmlFor="imageUpload" className="upload-label">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="upload-input"
                onChange={handleFileChange}
              />
              <MdCloudUpload className="upload-icon" />
              <span>Select Image</span>
            </label>
          </form>

          {selectedFile && (
            <div className="selected-file">
              <span style={{ fontSize: "20px" }}>{selectedFile.name}</span>
              <MdDelete className="delete-icon" onClick={handleFileClear} />
            </div>
          )}

          {imageUrl && (
            <div className="image-preview">
              <img src={imageUrl} alt="Selected" />
            </div>
          )}

          {selectedFile && !uploading && (
            <button className="upload-button" onClick={handleUpload}>
              Upload image
            </button>
          )}

          {uploading && <div className="uploading-indicator">Uploading...</div>}

          {prediction && (
            <div className="prediction-result">
              <h2>Prediction:</h2>
              <p>{prediction}</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default HomePage;
