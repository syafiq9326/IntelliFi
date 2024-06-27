import { useState, useRef } from 'react';
// import EditIcon from "edit.svg";
import { storage, storageRef } from "../../firebase/firebase"; // Import Firebase Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ImageUpload = ({ setPicture }) => {
    const [avatarURL, setAvatarURL] = useState("https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg");
    const fileUploadRef = useRef(null);

    const handleImageUpload = (event) => {
        event.preventDefault();
        fileUploadRef.current.click();
      }

      const uploadImageDisplay = async () => {
        const uploadedFile = fileUploadRef.current.files[0];
        if (uploadedFile) {
            const imageRef = ref(storageRef, uploadedFile.name);
            await uploadBytes(imageRef, uploadedFile).then((snapshot) => {
                console.log('Uploaded a blob or file!');
              });
            const downloadURL = await getDownloadURL(imageRef);
            {/*const cachedURL = URL.createObjectURL(uploadedFile);
            setAvatarURL(cachedURL);
            setPicture(cachedURL);*/}
            setAvatarURL(downloadURL);
            console.log("Download URL: ", downloadURL);
            setPicture(downloadURL);
        }
    }

    return (
        <div className="relative">
        
            <form id="form" encType='multipart/form-data'>
                <button
                    type='submit'
                    onClick={handleImageUpload}
                    className='absolute bottom-0 right-0 bg-gray-200 text-gray-700 rounded-full p-1 h-8 w-8'
                >
                    <img
                        src="edit.svg"
                        alt="Edit"
                        className='h-6 w-6'
                    />
                </button>
                <input type="file" id="file" ref={fileUploadRef} onChange={uploadImageDisplay} hidden />
            </form>
        </div>
    );
}

export default ImageUpload;