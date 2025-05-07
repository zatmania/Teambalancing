import React, { useState } from 'react';
import { UserPlus, Users, RefreshCw, Trash2 } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  grade: number;
}

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState({ name: '', grade: 0 });
  const [team1, setTeam1] = useState<Player[]>([]);
  const [team2, setTeam2] = useState<Player[]>([]);

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (players.length >= 10) {
      alert('Maximum 10 players allowed');
      return;
    }
    if (newPlayer.name && newPlayer.grade >= 1 && newPlayer.grade <= 30000) {
      setPlayers([...players, { ...newPlayer, id: Date.now().toString() }]);
      setNewPlayer({ name: '', grade: 0 });
    }
  };

  const balanceTeams = () => {
    if (players.length !== 10) {
      alert('Please add exactly 10 players');
      return;
    }

    // Sort players by grade in descending order
    const sortedPlayers = [...players].sort((a, b) => b.grade - a.grade);
    const team1Temp: Player[] = [];
    const team2Temp: Player[] = [];
    let team1Sum = 0;
    let team2Sum = 0;

    // Distribute players using alternating method while considering total grade
    sortedPlayers.forEach((player) => {
      if (team1Sum <= team2Sum && team1Temp.length < 5) {
        team1Temp.push(player);
        team1Sum += player.grade;
      } else {
        team2Temp.push(player);
        team2Sum += player.grade;
      }
    });

    setTeam1(team1Temp);
    setTeam2(team2Temp);
  };

  const resetTeams = () => {
    setTeam1([]);
    setTeam2([]);
    setPlayers([]);
  };

  const getTeamAverage = (team: Player[]) => {
    if (team.length === 0) return 0;
    return (team.reduce((sum, player) => sum + player.grade, 0) / team.length).toFixed(1);
  };

  const formatGrade = (grade: number) => {
    return new Intl.NumberFormat().format(grade);
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Team Balancer
          </h1>

          <form onSubmit={addPlayer} className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                placeholder="Player name"
                className="flex-1 p-2 border rounded"
                required
              />
              <input
                type="number"
                value={newPlayer.grade || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, grade: Number(e.target.value) })}
                placeholder="Grade (1-30000)"
                min="1"
                max="30000"
                className="w-40 p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <UserPlus className="h-5 w-5" />
                Add Player
              </button>
            </div>
          </form>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Player Pool ({players.length}/10)</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-gray-50 p-3 rounded border relative"
                >
                  <button 
                    onClick={() => removePlayer(player.id)}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                    title="Remove player"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="font-medium">{player.name}</div>
                  <div className="text-sm text-gray-600">Grade: {formatGrade(player.grade)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={balanceTeams}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              disabled={players.length !== 10}
            >
              <RefreshCw className="h-5 w-5" />
              Balance Teams
            </button>
            <button
              onClick={resetTeams}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Reset
            </button>
          </div>

          {(team1.length > 0 || team2.length > 0) && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 text-blue-800">
                  Team 1 (Avg: {formatGrade(Number(getTeamAverage(team1)))})
                </h2>
                <div className="space-y-2">
                  {team1.map((player) => (
                    <div
                      key={player.id}
                      className="bg-white p-3 rounded shadow-sm flex justify-between"
                    >
                      <span>{player.name}</span>
                      <span className="text-gray-600">Grade: {formatGrade(player.grade)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 text-green-800">
                  Team 2 (Avg: {formatGrade(Number(getTeamAverage(team2)))})
                </h2>
                <div className="space-y-2">
                  {team2.map((player) => (
                    <div
                      key={player.id}
                      className="bg-white p-3 rounded shadow-sm flex justify-between"
                    >
                      <span>{player.name}</span>
                      <span className="text-gray-600">Grade: {formatGrade(player.grade)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;