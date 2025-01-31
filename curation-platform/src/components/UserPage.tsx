import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useError } from "../contexts/ErrorContext";
import { signOutUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ExhibitionList from "../components/lowerComponents/ExhibitionList";
import bunny from "../assets/avatar/bunny.jpg";
import kitten from "../assets/avatar/kitten.jpg";
import piggy from "../assets/avatar/piggy.jpg";
import puppy from "../assets/avatar/puppy.jpeg";
import guieaPig from "../assets/avatar/guineaPig.jpg";
import { db } from "../firebase/firebaseConfig";
import "../css/UserPage.css"

const UserPage: React.FC = () => {
  const { user, setUser } = useUser();
  const { error } = useError();
  const navigate = useNavigate();

  const [editingProfile, setEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || bunny);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    alert("You have successfully logged out.");
    navigate("/"); 
  };

  const handleSaveProfile = async () => {
    if (user) {
      let avatarURL = selectedAvatar;

      if (avatarFile) {
        const storage = getStorage();
        const avatarRef = ref(storage, `avatars/${user.id}/${avatarFile.name}`);
        await uploadBytes(avatarRef, avatarFile);
        avatarURL = await getDownloadURL(avatarRef);
      }

      await setDoc(doc(db, "users", user.id), {
        username: newUsername || "",
        avatar: avatarURL,
      });

      setUser({
        ...user,
        username: newUsername || "",
        avatar: avatarURL,
      });
      setEditingProfile(false);
    }
  };

  console.log(user);
  
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="user-page">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <img
        src={selectedAvatar}
        alt="User Avatar"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          cursor: "pointer",
        }}
        onClick={() => setEditingProfile(true)}
      />
      <br />

      {editingProfile ? (
        <>
          <div>
            <h3>Change Avatar:</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <img
                src={bunny}
                alt="Bunny"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedAvatar(bunny)}
              />
              <img
                src={kitten}
                alt="Kitten"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedAvatar(kitten)}
              />
              <img
                src={piggy}
                alt="Piggy"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedAvatar(piggy)}
              />
              <img
                src={puppy}
                alt="Puppy"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedAvatar(puppy)}
              />
              <img
                src={guieaPig}
                alt="Guinea Pig"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedAvatar(guieaPig)}
              />
            </div>
          </div>
          <div>
            <h3>Username:</h3>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>

          <div>
            <button onClick={handleSaveProfile}>Save</button>
            <button onClick={() => {
              setEditingProfile(false);
              setNewUsername(user?.username || "");
              setSelectedAvatar(user?.avatar || bunny);
            }}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div>
            <h2>Hello {user.username}!</h2>
            <button onClick={handleSignOut}>Sign Out</button>
            <p>User ID: {user.id}</p>
          </div>
          <div>
            <button onClick={() => setEditingProfile(true)}>
              Edit Profile
            </button>
          </div>
        </>
      )}

      <ExhibitionList />
    </div>
  );
};

export default UserPage;
