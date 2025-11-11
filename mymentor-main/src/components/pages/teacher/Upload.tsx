import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import MainLayout from '../../layout/MainLayout';
import { supabase } from '../../../supabaseClient';
import { RiUploadCloud2Fill } from "react-icons/ri";

type Classroom = {
  id: string;
  name: string;
  subject: string;
};

const Upload: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      const { data, error } = await supabase.functions.invoke('get-teacher-classrooms');
      if (error) {
        setError(error.message);
      } else {
        setClassrooms(data || []);
      }
    };
    fetchClassrooms();
  }, []);

  // handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // handle the form submission
  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedClass) {
      setError('Please select a class and a file.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('classroomId', selectedClass);

    try {
      const { error } = await supabase.functions.invoke('upload-pdf', {
        body: formData,
      });

      if (error) throw error;

      setMessage(`Successfully uploaded "${selectedFile.name}"!`);
      setSelectedFile(null);
      (e.target as HTMLFormElement).reset(); // Clear file input

    } catch (error: any) {
      setError(`Failed to upload file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Upload Resources</h1>

      <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Upload a New File</h2>
        <p className="text-gray-400 mb-6">
          Upload PDF, TXT, or MD files here. This will train the AI agent for the
          classroom you select.
        </p>

        <form onSubmit={handleUpload}>
          {/* Classroom Selection */}
          <div className="mb-4">
            <label htmlFor="classroom" className="block text-sm font-medium text-gray-300 mb-2">
              1. Select Classroom
            </label>
            <select
              id="classroom"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select a class...</option>
              {classrooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.subject})
                </option>
              ))}
            </select>
          </div>

          {/* file upload input */}
          <div className="mb-6">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
              2. Choose File
            </label>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <RiUploadCloud2Fill className="w-10 h-10 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-400">
                {selectedFile ? (
                  <span className="font-semibold text-white">{selectedFile.name}</span>
                ) : (
                  <>
                    <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500">PDF, TXT, or MD (MAX. 50MB)</p>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept=".pdf,.txt,.md"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-500"
            disabled={loading || !selectedFile || !selectedClass}
          >
            {loading ? 'Uploading & Processing...' : 'Upload and Train'}
          </button>
          
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          {message && <p className="text-green-400 mt-4 text-center">{message}</p>}
        </form>
      </div>
    </MainLayout>
  );
};

export default Upload;