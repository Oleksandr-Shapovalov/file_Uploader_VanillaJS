import { upload } from "./upload.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { initializeApp } from "firebase/app";
import "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBAgrhIGE5LFiv45JyDDNEDd9xL0M0AOOc",
  authDomain: "file-uploading-28325.firebaseapp.com",
  projectId: "file-uploading-28325",
  storageBucket: "file-uploading-28325.appspot.com",
  messagingSenderId: "161853308459",
  appId: "1:161853308459:web:42f5a4663cc4dcc109b46e",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const storage = getStorage();

upload("#file", {
  multiply: true,
  accept: [".png", ".jpg", ".jpeg", ".gif"],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const storageRef = ref(storage, `images/${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0);

          const block = blocks[index].querySelector(".preview__info_progress");
          block.textContent = progress + "%";
          block.style.width = progress + "%";
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(`File  number ${index + 1} available at`, downloadURL);
          });
        }
      );
    });
  },
});
