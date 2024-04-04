import React, { useState } from "react";
import "./App.css";
import { MdCloudUpload, MdDelete } from "react-icons/md";

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prediction, setPrediction] = useState(null); // State to store prediction
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

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
        console.log("Prediction:", data.prediction);
        setPrediction(data.prediction); // Set prediction in state
        setShowModal(true); // Show modal with prediction
      })
      .catch((error) => {
        console.error("There was a problem with the upload:", error.message);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const closeModal = () => {
    setShowModal(false);
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
        </main>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Prediction Result</h2>
            <p>{prediction}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
