import React, { useState } from "react";
import { API_URL } from "../api/authApi";
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { updateUser } from "../api/userApi";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const storedUser =
    JSON.parse(localStorage.getItem("user")) || {
      id: 1,
      name: "Muhammad Hamzah",
      email: "hamzah@example.com",
      phone: "+62 812 3456 7890",
      profile: "https://i.pravatar.cc/200?img=12",
      jobTitle: "Salesforce Developer",
      location: "Jakarta, Indonesia",
    };


    
  const [user, setUser] = useState(storedUser);
  console.log('user : ', user.profile);

  const defaultAvatar = "https://i.pravatar.cc/150?img=12"; // bisa diganti default kamu
  const profileImage =
  user.profile && user.profile.startsWith("http")
    ? user.profile
    : user.profile
    ? `${API_URL}${user.profile}`
    : defaultAvatar;


  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ ...storedUser });
  const [previewImage, setPreviewImage] = useState(user.profile);
  const [loading, setLoading] = useState(false);
  const [isUpload, setIsUpload] = useState(false);

  // handle input text/email/phone
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileFile: file });
      setPreviewImage(URL.createObjectURL(file)); // ✅ preview foto
      setIsUpload(true);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      const formDataToSend = new FormData();
      formDataToSend.append("id", user.id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);

      // Kalau user upload foto baru
      if (formData.profileFile) {
        const croppedBlob = await getCroppedImg(previewImage, croppedAreaPixels);
        formDataToSend.append("profile", croppedBlob, formData.profileFile.name);
      }

      const res = await updateUser(token, formDataToSend);

      if (res.ok) {
        setUser(res.data);
        toast.success("✅ Profil berhasil diperbarui!");
        setShowModal(false);
        setIsUpload(false);
      } else {
        toast.error("❌ Gagal update profil: " + (res.data?.message || "unknown error"));
      }
    } catch (err) {
      console.error("Error update:", err);
      toast.error("Terjadi kesalahan saat update profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <div className="dashboard-body">
          <div className="profile-container">
            {/* Foto profil */}
            <div className="profile-header">
              <img
                src={profileImage}
                alt={user.name}
                onError={(e) => (e.target.src = defaultAvatar)}
                className="profile-photo"
              />
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-title">{user.jobTitle}</p>
            </div>

            {/* Detail informasi */}
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">Telepon:</span>
                <span className="value">{user.phone}</span>
              </div>
              <div className="detail-item">
                <span className="label">Lokasi:</span>
                <span className="value">{user.location}</span>
              </div>
            </div>

            {/* Tombol Edit Profile */}
            <div className="edit-profile-btn-wrapper">
              <button className="btn-edit-profile" onClick={() => setShowModal(true)}>
                <FaEdit /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Profile */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>

            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {isUpload && previewImage && (
              <div className="crop-size">
                <div className="crop-container">
                  <Cropper
                    image={previewImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"       // buat circle
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                  <div className="crop-overlay"></div>
                </div>
                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="crop-zoom-slider"
                  />
              </div>
              
            )}

            <div className="modal-buttons">
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Profile;

