import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import MainLayout from '../../layout/MainLayout';
import { supabase } from '../../../supabaseClient';
import { Link } from 'react-router-dom';

type Classroom = {
  id: string;
  name: string;
  subject: string;
  join_code: string;
};

const Classrooms: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');

  const fetchClassrooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('get-teacher-classrooms');
      
      if (error) throw error;
      
      setClassrooms(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //page load refresh classrooms
  useEffect(() => {
    fetchClassrooms();
  }, []);

  // creating a new class
  const handleCreateClass = async (e: FormEvent) => {
    e.preventDefault();
    if (!className) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('create-classroom', {
        body: JSON.stringify({ name: className, subject }),
      });

      if (error) throw error;

      setClassrooms([...classrooms, data]);
      setClassName('');
      setSubject('');

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Display page
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Manage Classrooms</h1>

      {/* New Classroom Form */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create a New Classroom</h2>
        <form onSubmit={handleCreateClass}>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Classroom Name (e.g., History 101)"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="flex-1 p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Subject (e.g., History)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-500"
              disabled={loading || !className}
            >
              {loading ? 'Creating...' : 'Create Classroom'}
            </button>
          </div>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </form>
      </div>

      {/* list of Existing Classrooms */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Classrooms</h2>
        {loading && classrooms.length === 0 && <p>Loading classrooms...</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((room) => (
            <div key={room.id} className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-white mb-2">{room.name}</h3>
              <p className="text-gray-400 mb-4">{room.subject}</p>
              <div className="text-sm">
                <span className="font-semibold text-gray-300">Join Code:</span>
                <span className="ml-2 px-3 py-1 bg-gray-700 text-blue-300 rounded-full font-mono">
                  {room.join_code}
                </span>
              </div>
            </div>
          ))}
        </div>

        {classrooms.length === 0 && !loading && (
          <p className="text-gray-400">You haven't created any classrooms yet.</p>
        )}
      </div>

      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard
      </Link>
    </MainLayout>
  );
};

export default Classrooms;