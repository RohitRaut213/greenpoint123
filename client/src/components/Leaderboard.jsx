import React, { useEffect, useState } from 'react';

// For demo: Simulate users list in localStorage
function getAllUsers() {
  // Try to get users from localStorage
  let users = JSON.parse(localStorage.getItem('allUsers')) || [];
  // Ensure current user is always present
  const current = JSON.parse(localStorage.getItem('user')) || { name: 'User', points: 0 };
  // If not present, add current user
  if (!users.some(u => u.name === current.name)) {
    users.push(current);
  } else {
    users = users.map(u => u.name === current.name ? current : u);
  }
  // Save back
  localStorage.setItem('allUsers', JSON.stringify(users));
  return users;
}

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(
      getAllUsers()
        .slice() // copy
        .sort((a, b) => b.points - a.points)
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Leaderboard</h2>
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.name} className="border-t">
                <td className="px-4 py-2 font-semibold">{i + 1}</td>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2 text-green-700 font-bold">{u.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-gray-500">Compete with others by logging more eco-friendly actions!</p>
      </div>
    </div>
  );
}

export default Leaderboard;
