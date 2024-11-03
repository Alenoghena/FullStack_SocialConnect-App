import React from "react";

const ProfilePicture = ({
  file,
  status,
  handleFileChange,
  handleUpload,
  showFile,
}) => {
  return (
    <div className="file-main">
      {/* {userPhoto && (
        <img
          src={`${API_PHOTO_URL}${userPhoto.profilePhoto}`}
          alt="UserPix"
          style={{ width: 120, height: 120, borderRadius: 50 }}
          className="img-user"
          onClick={() => setShowFile(!showFile)}
        />
      )} */}

      {showFile && (
        <div className="input-group">
          <div>
            <input
              id="file"
              type="file"
              name="file"
              onChange={(e) => handleFileChange(e)}
            />
          </div>

          {file && (
            <button onClick={() => handleUpload(file)} className="submit">
              Upload a file
            </button>
          )}

          <Result status={status} />
        </div>
      )}
    </div>
  );
};

const Result = ({ status }) => {
  if (status.message === "Photo updated successfully") {
    return <p>✅ File uploaded successfully!</p>;
  } else if (status === "fail") {
    return <p>❌ File upload failed!</p>;
  } else if (status === "uploading") {
    return <p>⏳ Uploading selected file...</p>;
  } else {
    return null;
  }
};

export default ProfilePicture;

//   const [status, setStatus] = useState<
//     'initial' | 'uploading' | 'success' | 'fail'
//   >('initial');

/////many uploads
//   const formData = new FormData();
//   [...files].forEach((file) => {
//     formData.append('files', file);
//   });

// const handleGetPhoto = useCallback(
//   async (id) => {
//     try {
//       console.log(id);
//       const resp = await getData(`getPhoto/${+id}`);
//       console.log(resp, id);
//       localStorage.setItem("photo", resp);
//       setUserPhoto(resp);
//     } catch (err) {
//       const message = `Post profile picture-Unauthorized! ${err.message}`;
//       console.log(message);
//     }
//   },
//   [setUserPhoto]
// );
// console.log(`${API_PHOTO_URL}${userPhoto.profilePhoto}`);
// useEffect(() => {
//   handleGetPhoto(user.id);
// }, [user]);

//{ {file && (
// <section>
//   File details:
//  <ul>
//    <li>Name: {file.name}</li>
//    <li>Type: {file.type}</li>
//   <li>Size: {file.size} bytes</li>
// </ul>
// </section>
// )} }
//{{files && [...files].map((file, index) => (
// <section key={file.name}>
//  File number {index + 1} details:
//  <ul>
//   <li>Name: {file.name}</li>
//  <li>Type: {file.type}</li>
// <li>Size: {file.size} bytes</li>
//</ul>
//  </section>
// ))} }
