import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageIndexes, setSelectedImageIndexes] = useState([]);

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const selectedFilesArray = Array.from(selectedFiles);

      const imagesArray = selectedFilesArray.map((file) => {
        return URL.createObjectURL(file);
      });

      setSelectedImages((previousImages) => previousImages.concat(imagesArray));

      event.target.value = "";
    }
  };

  function deleteHandler(image) {
    setSelectedImages((previousImages) => previousImages.filter((e) => e !== image));
    URL.revokeObjectURL(image);
  }

  const toggleImageSelection = (index) => {
    const updatedSelectedImageIndexes = [...selectedImageIndexes];
    if (updatedSelectedImageIndexes.includes(index)) {
      updatedSelectedImageIndexes.splice(updatedSelectedImageIndexes.indexOf(index), 1);
    } else {
      updatedSelectedImageIndexes.push(index);
    }
    setSelectedImageIndexes(updatedSelectedImageIndexes);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const dragIndex = e.dataTransfer.getData("index");
    const updatedImages = [...selectedImages];
    const movedImage = updatedImages[dragIndex];
    updatedImages.splice(dragIndex, 1);
    updatedImages.splice(index, 0, movedImage);
    setSelectedImages(updatedImages);
  };

  const deleteSelectedImages = () => {
    const imagesToDelete = selectedImageIndexes.map((index) => selectedImages[index]);

    setSelectedImages((previousImages) =>
      previousImages.filter((image) => !imagesToDelete.includes(image))
    );

    imagesToDelete.forEach((image) => {
      URL.revokeObjectURL(image);
    });

    setSelectedImageIndexes([]);
  };

  return (
    <section>
      <div className="images">
        {selectedImages &&
          selectedImages.map((image, index) => (
            <div
              key={image}
              className="image"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <input
                type="checkbox"
                onChange={() => toggleImageSelection(index)}
                checked={selectedImageIndexes.includes(index)}
              />
              <img src={image} height="200" alt="upload" />
              <button onClick={() => deleteHandler(image)}>X</button>
              <p>{index + 1}</p>
            </div>
          ))}
      </div>
  
      <label>
        + Add Images
        <br />
        <span></span>
        <input
          type="file"
          name="images"
          onChange={onSelectFile}
          multiple
          accept="image/png, image/jpeg, image/webp"
        />
      </label>
      <br />
  
      {selectedImages.length > 0 && (
        <div>
          {selectedImages.length > 100 ? (
            <p className="error">
              You can't upload more than 100 images! <br />
              <span>
                please delete <b> {selectedImages.length - 100} </b> of them{" "}
              </span>
            </p>
          ) : (
            <button
              className="upload-btn"
              onClick={() => {
                console.log(selectedImages);
              }}
            >
              UPLOAD {selectedImages.length} IMAGE
              {selectedImages.length === 1 ? "" : "S"}
            </button>
          )}
          <button
            className="delete-btn"
            onClick={deleteSelectedImages}
            disabled={selectedImageIndexes.length === 0}
          >
            Delete Selected Images
          </button>
        </div>
      )}
    </section>
  
  );
};

export default App;
