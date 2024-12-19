import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [secureLink, setSecureLink] = useState('');
    const [fileToShare, setFileToShare] = useState(null);
    const [fileId, setFileId] = useState(''); // Assume you have a way to select a file ID
    const [shareableLink, setShareableLink] = useState('');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('access_token');
    const role = storedUser ? storedUser.role : null;

    useEffect(() => {
        if (!storedUser || !token) {
            navigate('/login');
        } else {
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user: storedUser, token } });
        }
        setLoading(false);
    }, [storedUser, token, dispatch, navigate]);

    useEffect(() => {
        if (role) {
            fetchUserFiles(role);
        }
    }, [role]);

    const fetchUserFiles = async (role) => {
        try {
            const response = role === 'admin'
                ? await axios.get('http://127.0.0.1:8000/api/files/admin/files/', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                : role === 'user'
                    ? await axios.get('http://127.0.0.1:8000/api/files/user/files/', {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    : null;

            if (response && response.data && response.data.files) {
                // Save the fetched files data to localStorage
                localStorage.setItem('userFiles', JSON.stringify(response.data.files));

                // Optionally, you can also set the files in state
                setFiles(response.data.files);
            } else {
                setError('No files found.');
            }
        } catch (error) {
            console.error('Error fetching files:', error);
            setError('Error fetching files.');
        }
    };




    const handleFileUpload = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            console.error('No file selected.');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage
        const token = localStorage.getItem('access_token'); // Get token for authorization

        // Validate file type and size
        const validMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!validMimeTypes.includes(selectedFile.type)) {
            console.error('Invalid file type.');
            alert('Please upload a valid PDF, JPEG, or PNG file.');
            return;
        }

        const maxFileSize = 10 * 1024 * 1024; // 10MB limit
        if (selectedFile.size > maxFileSize) {
            console.error('File size exceeds limit.');
            alert('File size exceeds the 10MB limit.');
            return;
        }

        // Prepare FormData
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/files/user/files/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include auth token
                },
                body: formData, // Send file as FormData
            });

            if (!response.ok) {
                const errorData = await response.text(); // Get error as plain text (in case of HTML response)
                console.error('Error during file upload:', errorData);
                alert('Error uploading file. Please check the backend logs for details.');
                return;
            }

            const responseData = await response.json();
            console.log('File uploaded successfully:', responseData);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error during file upload:', error);
            alert('An error occurred while uploading the file.');
        }
    };


    const handleFileDownload = async (fileId) => {
        try {
            // Retrieve file details from localStorage
            const storedFiles = JSON.parse(localStorage.getItem('userFiles')) || [];
            const file = storedFiles.find(f => f.id === fileId);

            if (!file) {
                alert('File not found.');
                return;
            }

            // API call to download the file
            const response = await axios.get(`http://127.0.0.1:8000/api/files/user/files/download/${fileId}/`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` },
            });

            // Create a download link and trigger the download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Error downloading file. Please try again.');
        }
    };




    const handleFileShare = async (fileId) => {
        try {
            // Prepare the data to send to the backend
            const requestData = {
                file_id: fileId,   // Send the file ID to the backend
                expires_in: 24,    // Expiration time (24 hours by default)
            };

            // Send the request to the backend
            const response = await axios.post(
                "http://127.0.0.1:8000/api/files/user/files/share/", // Backend API URL
                requestData,  // Send request data as the payload
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token for authentication
                        'Content-Type': 'application/json', // Ensure the request body is in JSON format
                    },
                }
            );

            // Extract the shareable link and expiration time from the response
            const shareableLink = response.data.shareable_link;
            const expirationTime = response.data.expires_at;
            console.log("Generated Shareable Link: ", shareableLink);
            console.log("Link expires at: ", expirationTime);

            // You can also set this shareable link in the state or display it to the user
        } catch (error) {
            console.error(error.response?.data); // Log the error from the backend
            setError('Error sharing file.'); // Set an error message to show to the user
        }
    };

    useEffect(() => {
        // If user is an admin, navigate to the admin panel automatically
        if (role === 'admin') {
            navigate('/admin');
        }
    }, [role, navigate]);

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Welcome to your Dashboard, {storedUser?.username}</h1>

            {role === 'user' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-blue-500">Upload Files (PDF, PNG, JPG)</h2>

                    <form onSubmit={handleFileUpload} className="flex items-center mb-6 space-x-4">
                        <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            className="border p-2 rounded-md w-full"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                            Upload
                        </button>
                    </form>

                    <h2 className="text-xl font-semibold mb-4 text-blue-500">Your Files</h2>

                    {loading ? (
                        <div className="text-center text-blue-500">Loading files...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {files.map((file) => (
                                <div key={file.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                                    <h3 className="text-lg font-medium text-blue-600">{file.name}</h3>
                                    <div className="flex mt-4 space-x-4">
                                        <button
                                            onClick={() => handleFileDownload(file.id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                                        >
                                            Download
                                        </button>
                                        <button
                                            onClick={() => handleFileShare(file.id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                        >
                                            Share
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {shareableLink && (
                        <div className="mt-4 p-4 bg-gray-200 rounded-lg">
                            <p className="text-lg font-semibold">Your secure link:</p>
                            <a
                                href={shareableLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                {shareableLink}
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;