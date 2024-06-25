"use client"
import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { MdCancel } from 'react-icons/md';
import { FaCamera } from "react-icons/fa6";
import { getSession } from 'next-auth/react';
import './styles/UploadModal.css';


const UploadModal = ({ isOpen, onClose }) => {
  const session = getSession();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const[ImageUrl, setImageUrl] = useState(null);
const ImageRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) {
      // 5MB size limit
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));

    } else {
      alert('File size should be 5MB or less.');
    }
  };
 const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append("imageUrl", ImageUrl);
    const response = await axios.post('/api/upload', formData);

    if (response.data.success) {  
      setFile(null);
      setCaption('');
      setImageUrl(null);
      
    }
    location.reload();
    onClose();

  };

  
  
  return (
    <Modal ariaHideApp={false} className="popup" isOpen={isOpen} onRequestClose={onClose}>
      <MdCancel className="cancel" size={20} onClick={onClose} />
      <form className="form" method='post' action='/api/upload'>
      {file ? <>
      <img className='img' src={ImageUrl} alt="Preview" />
      <button className='remove' onClick={() => setFile(null)}>Remove</button>
      </>
      :
      <>
      <h3>Upload Photo or Video</h3>
       <FaCamera onClick={() => ImageRef.current.click()} className="camera" size={40}></FaCamera>
      </>}
      
          <input hidden
          ref={ImageRef} id='file' name='file' className="img-input" type="file" accept="image/*,video/*" onChange={handleFileChange} />
      
        <input
          className="caption"
          id='caption'
          name='caption'
          type="text"
          placeholder="Enter caption"
          autoComplete='off'
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button disabled={!file  || !session} className={` submit  ${!file ? 'lightblue' : ''}`} type='submit' onClick={handleSubmit}>Upload</button>
        </form>
  
    </Modal>
  );

}
export default UploadModal;
