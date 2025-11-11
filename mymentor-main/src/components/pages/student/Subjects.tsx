import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import MainLayout from '../../layout/MainLayout';
import { supabase } from '../../../supabaseClient';

type Classroom = {
  id: string;
  name: string;
  subject: string;
  join_code: string;
};

const Subjects: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [joinCode, setJoinCode] = useState('');

  // fetch all of the students classrooms
  const fetchClassrooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('get-student-classrooms');
      if (error) throw error;
      setClassrooms(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // fetch function when the page loads
  useEffect(() => {
    fetchClassrooms();
  }, []);

  // joining a new class
  const handleJoinClass = async (e: FormEvent) => {
    e.preventDefault();
    if (!joinCode) return;

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.functions.invoke('join-classroom', {
        body: JSON.stringify({ join_code: joinCode }),
      });

      if (error) throw error;

      setJoinCode('');
      await fetchClassrooms();

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">My Subjects</h1>

      {/* Join Classroom Form */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Join a New Classroom</h2>
        <form onSubmit={handleJoinClass}>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Join Code (e.g., A4F-G8K)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-1 p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-500"
              disabled={loading || !joinCode}
            >
              {loading ? 'Joining...' : 'Join Class'}
            </button>
          </div>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </form>
      </div>

      {/* Existing Classrooms */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Enrolled Classes</h2>
        {loading && classrooms.length === 0 && <p>Loading classes...</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((room) => (
            <div key={room.id} className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-white mb-2">{room.name}</h3>
              <p className="text-gray-400">{room.subject}</p>
            </div>
          ))}
        </div>

        {classrooms.length === 0 && !loading && (
          <p className="text-gray-400">You haven't joined any classes yet.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default Subjects;