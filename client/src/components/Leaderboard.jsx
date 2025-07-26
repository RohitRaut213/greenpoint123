import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

// For demo: Simulate users list in localStorage, per Clerk user
function getAllUsers(userId) {
  const allUsersKey = userId ? `allUsers_${userId}` : 'allUsers';
  let users = JSON.parse(localStorage.getItem(allUsersKey)) || [];
  const userKey = userId ? `user_${userId}` : 'user';
  const current = JSON.parse(localStorage.getItem(userKey)) || { name: 'User', points: 0 };
  if (!users.some(u => u.name === current.name)) {
    users.push(current);
  } else {
    users = users.map(u => u.name === current.name ? current : u);
  }
  localStorage.setItem(allUsersKey, JSON.stringify(users));
  return users;
}

function Leaderboard() {
  const { user: clerkUser } = useUser();
  const userId = clerkUser?.id;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(
      getAllUsers(userId)
        .slice() // copy
        .sort((a, b) => b.points - a.points)
    );
  }, [userId]);

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <div className="card shadow border-0 p-4 w-100 text-center" style={{maxWidth: 600}}>
        <h2 className="h4 fw-bold mb-4 text-success">Leaderboard</h2>
        <table className="table table-striped text-start">
          <thead>
            <tr>
              <th className="px-3 py-2">Rank</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.name}>
                <td className="px-3 py-2 fw-semibold">{i + 1}</td>
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2 text-success fw-bold">{u.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-secondary">Compete with others by logging more eco-friendly actions!</p>
      </div>
    </div>
  );
}

export default Leaderboard;
