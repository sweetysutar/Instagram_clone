import { Button, Input } from "@material-ui/core";
import React, { useState } from "react";
import { storage, db, serverTimestamp } from "./firebase";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import "./ImageUpload.css";

function ImageUpload({ username, setOpenUpload }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image) return;

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => {
        console.error("Upload error:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          addDoc(collection(db, "posts"), {
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: username,
          });

          // Reset the UI
          setProgress(0);
          setCaption("");
          setImage(null);
          setOpenUpload(false);
        });
      }
    );
  };

  return (
    <div className="imageupload">
      <progress
        className="imageupload__progress"
        value={progress}
        max="100"
      ></progress>

      <Input
        className="imageupload__caption"
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />

      <input type="file" onChange={handleChange} />
      
      <Button
        variant="outlined"
        className="imageupload__button"
        color="primary"
        onClick={handleUpload}
        disabled={!image || !caption}
      >
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
