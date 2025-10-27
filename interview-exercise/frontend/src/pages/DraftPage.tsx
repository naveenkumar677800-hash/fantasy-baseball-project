import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Player, Team, Draft } from '../types';
import { getAvailablePlayers, getTeams, startDraft as apiStartDraft, getDraftStatus, resetDraft as apiResetDraft } from '../services/api';
import DraftTimer from '../components/DraftTimer';
import PlayerList from '../components/PlayerList';
import TeamRoster from '../components/TeamRoster';
import Leaderboard from '../components/Leaderboard';
import { Play, RotateCcw, Users, List } from 'lucide-react';

const DraftPage: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [activeTab, setActiveTab] = useState<'draft' | 'my-team' | 'leaderboard'>('draft');
  const [recommendations, setRecommendations] = useState<Player[]>([]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('draft:join');
    });

    newSocket.on('draft:state', (data) => {
      setDraft(data.draft);
      setTeams(data.teams);
      setCurrentTeam(data.currentTeam);
      if (data.availablePlayers) {
        setPlayers(data.availablePlayers);
      }
    });

    newSocket.on('draft:pick', (data) => {
      setDraft(data.draft);
      setTeams(data.teams);
      setCurrentTeam(data.currentTeam);
      loadPlayers();
    });

    newSocket.on('draft:timerUpdate', (data) => {
      setTimeRemaining(data.remaining);
    });

    newSocket.on('draft:timeExpired', () => {
      console.log('Time expired - autodrafting...');
    });

    newSocket.on('draft:completed', (data) => {
      setDraft(data.draft);
      setTeams(data.teams);
      alert('Draft completed!');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Load initial data
  useEffect(() => {
    loadPlayers();
    loadTeams();
    checkDraftStatus();
  }, []);

  // Set my team (first team for demo)
  useEffect(() => {
    if (teams.length > 0) {
      setMyTeam(teams[0]);
    }
  }, [teams]);

  const loadPlayers = async () => {
    const data = await getAvailablePlayers();
    setPlayers(data);
  };

  const loadTeams = async () => {
    const data = await getTeams();
    setTeams(data);
  };

  const checkDraftStatus = async () => {
    try {
      const data = await getDraftStatus();
      setDraft(data.draft);
      setCurrentTeam(data.currentTeam);
    } catch (error) {
      console.log('No active draft');
    }
  };

  const handleStartDraft = async () => {
    // Reset local state
    setTimeRemaining(60);
    setActiveTab('draft');
    
    // Start new draft (this will reset backend state)
    const data = await apiStartDraft(60);
    setDraft(data.draft);
    setCurrentTeam(data.currentTeam);
    
    // Reload fresh data
    await loadPlayers();
    await loadTeams();
  };

  const handleResetDraft = async () => {
    if (confirm('Are you sure you want to reset the draft? All progress will be lost.')) {
      await apiResetDraft();
      setDraft(null);
      setCurrentTeam(null);
      setTimeRemaining(60);
      loadPlayers();
      loadTeams();
    }
  };

  const handleDraftPlayer = (player: Player) => {
    if (!myTeam || !socket || !draft) return;

    // Check if team is full (11 players max: 1C + 4IF + 3OF + 3P)
    const maxPlayers = 11;
    if (myTeam.roster.length >= maxPlayers) {
      alert('Your team is full! You have drafted all players.');
      return;
    }

    // Check position limits
    const positionCount = myTeam.positionCounts[player.position];
    const maxPosition = myTeam.maxPositions[player.position];
    
    if (positionCount >= maxPosition) {
      alert(`You already have the maximum number of ${player.position} players (${maxPosition})`);
      return;
    }

    socket.emit('draft:selectPlayer', {
      teamId: myTeam.id,
      playerId: player.id,
    });
  };

  // Check if team is complete
  useEffect(() => {
    if (myTeam && draft?.status === 'active') {
      const maxPlayers = 11;
      if (myTeam.roster.length >= maxPlayers) {
        // Team is complete - show success dialog
        setTimeout(() => {
          const totalPoints = myTeam.roster.reduce((sum, p) => {
            const stats = p.stats;
            if (p.position !== 'P') {
              return sum + (stats.battingAverage || 0) * 100 + (stats.homeRuns || 0) * 4 + (stats.rbi || 0) * 1 + (stats.stolenBases || 0) * 2;
            }
            return sum + (stats.wins || 0) * 5 + (stats.strikeouts || 0) * 1 - (stats.era || 0) * 2;
          }, 0);
          
          alert(`🎉 Congratulations! Your team is complete!\n\nYou've drafted ${myTeam.roster.length} players.\n\nTotal Points: ${totalPoints.toFixed(1)}\n\nClick "Start Draft" to build a new team!`);
          
          // Switch to My Team tab
          setActiveTab('my-team');
          
          // Mark draft as completed locally
          if (draft) {
            setDraft({ ...draft, status: 'completed' });
          }
        }, 500);
      }
    }
  }, [myTeam?.roster.length, draft?.status]);

  const draftActive = draft?.status === 'active' && myTeam && myTeam.roster.length < 11;

  const leaderboardData = teams.map((team, index) => {
    const totalPoints = team.roster.reduce((sum, p) => {
      const stats = p.stats;
      if (p.position !== 'P') {
        return sum + (stats.battingAverage || 0) * 100 + (stats.homeRuns || 0) * 4 + (stats.rbi || 0) * 1 + (stats.stolenBases || 0) * 2;
      }
      return sum + (stats.wins || 0) * 5 + (stats.strikeouts || 0) * 1 - (stats.era || 0) * 2;
    }, 0);
    
    return {
      rank: index + 1,
      teamId: team.id,
      teamName: team.name,
      owner: team.owner,
      totalPoints,
      playerCount: team.roster.length,
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints).map((entry, index) => ({ ...entry, rank: index + 1 }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">⚾ Fantasy Baseball Draft</h1>
              <p className="text-gray-600 text-sm">Build your championship team!</p>
            </div>
            <div className="flex gap-3">
              {!draftActive ? (
                <button
                  onClick={handleStartDraft}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
                >
                  <Play className="w-5 h-5" />
                  {draft?.status === 'completed' ? 'Start New Draft' : 'Start Draft'}
                </button>
              ) : (
                <button
                  onClick={handleResetDraft}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset Draft
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('draft')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'draft'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <List className="w-5 h-5" />
            Available Players
          </button>
          <button
            onClick={() => setActiveTab('my-team')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'my-team'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            My Team
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            Leaderboard
          </button>
        </div>

        {/* Draft Timer */}
        {draftActive && myTeam && (
          <div className="mb-6">
            <DraftTimer
              timeRemaining={timeRemaining}
              isMyTurn={true}
              currentTeamName={myTeam.name}
            />
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'draft' && (
          <PlayerList
            players={players}
            onDraft={handleDraftPlayer}
            canDraft={draftActive}
            recommendations={recommendations}
          />
        )}

        {activeTab === 'my-team' && myTeam && (
          <TeamRoster team={myTeam} />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard entries={leaderboardData} />
        )}

        {!draftActive && activeTab === 'draft' && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Play className="w-16 h-16 mx-auto mb-4 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {draft?.status === 'completed' ? 'Draft Another Team?' : 'Ready to Draft?'}
            </h2>
            <p className="text-gray-600 mb-6">
              {draft?.status === 'completed' 
                ? 'Your previous team is complete. Start a new draft to build another team!' 
                : 'Click "Start Draft" to begin building your team!'}
            </p>
            <button
              onClick={handleStartDraft}
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg text-lg"
            >
              <Play className="w-6 h-6" />
              {draft?.status === 'completed' ? 'Start New Draft' : 'Start Draft'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftPage;

