// Fantasy Football AI Coach - Core Components

// 1. Import necessary libraries
import React, { useState, useEffect } from 'react';
// Replace the axios call with this for testing

import { mockPlayerData } from './mockData';


// 2. Main application component
function FantasyFootballCoach() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userTeam, setUserTeam] = useState([]);
  
  // Fetch initial player data when component mounts
  useEffect(() => {
    fetchPlayerData();
  }, []);
  
  // Function to fetch player data from API
  const fetchPlayerData = async () => {
    setIsLoading(true);
    try {
      // You would replace this URL with your actual fantasy football API endpoint
      // const response = await axios.get('https://api.fantasyfootball.com/players');
      // setPlayerData(response.data);
      setPlayerData(mockPlayerData);
    } catch (error) {
      console.error('Error fetching player data:', error);
      // Add a message to inform the user
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Sorry, I had trouble connecting to the fantasy football database. Please try again later.'
      }]);
    }
    setIsLoading(false);
  };
  
  // Handle user input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    
    // Process the user's query
    processUserQuery(input);
    
    // Clear input field
    setInput('');
  };
  
  // Process and respond to user queries
  const processUserQuery = (query) => {
    setIsLoading(true);
    
    // Convert query to lowercase for easier matching
    const lowerQuery = query.toLowerCase();
    
    // Generate response based on query type
    let response = '';
    
    if (lowerQuery.includes('start') || lowerQuery.includes('sit')) {
      response = generateStartSitAdvice(lowerQuery);
    } else if (lowerQuery.includes('waiver') || lowerQuery.includes('pickup')) {
      response = generateWaiverPickups(lowerQuery);
    } else if (lowerQuery.includes('trade')) {
      response = generateTradeAdvice(lowerQuery);
    } else if (lowerQuery.includes('injury') || lowerQuery.includes('injured')) {
      response = checkInjuryUpdates(lowerQuery);
    } else if (lowerQuery.includes('matchup') || lowerQuery.includes('vs')) {
      response = analyzeMatchups(lowerQuery);
    } else if (lowerQuery.includes('add team') || lowerQuery.includes('my roster')) {
      response = "Please enter your roster by listing your players, separated by commas.";
    } else {
      response = "I'm your Fantasy Football AI Coach! Ask me about start/sit decisions, waiver pickups, trade advice, injury updates, or matchup analysis.";
    }
    
    // Add bot response to chat
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: response }]);
      setIsLoading(false);
    }, 1000); // Simulate processing time
  };
  
  // Generate start/sit advice
  const generateStartSitAdvice = (query) => {
    // Check if the query mentions specific players
    if (query.includes('mahomes')) {
      return "Patrick Mahomes has a favorable matchup this week against the Raiders' secondary. He's a strong start.";
    } else if (query.includes('kelce')) {
      return "Travis Kelce is questionable with a knee injury. Monitor his practice status, but if he plays, he's still a must-start against the Raiders.";
    } else if (query.includes('quarterback') || query.includes('qb')) {
      return "Top QB starts this week: Josh Allen vs MIA, Patrick Mahomes vs LV, Lamar Jackson vs CIN. Consider sitting: Daniel Jones vs DAL, Russell Wilson vs SF.";
    } else if (query.includes('running back') || query.includes('rb')) {
      return "Top RB starts: Christian McCaffrey vs SEA, Saquon Barkley vs WAS, Austin Ekeler vs DEN. Consider sitting: Ezekiel Elliott vs PHI, Cam Akers vs TB.";
    }
    
    // Default response
    return "Based on this week's matchups and recent performance metrics, I recommend starting Patrick Mahomes (facing a weak secondary) and sitting Ezekiel Elliott (tough run defense and limited snaps). Any specific players you're deciding between?";
  };
  
  // Generate waiver wire pickup recommendations
  const generateWaiverPickups = (query = '') => {
    // Optional: Extract position from query if specified
    const lowerQuery = query.toLowerCase();
    const positionMap = {
      'quarterback': 'QB', 'qb': 'QB',
      'running back': 'RB', 'rb': 'RB',
      'wide receiver': 'WR', 'wr': 'WR',
      'tight end': 'TE', 'te': 'TE',
      'defense': 'DEF', 'def': 'DEF',
      'kicker': 'K', 'k': 'K'
    };
    
    // Determine if user is asking about a specific position
    let targetPosition = null;
    for (const [key, value] of Object.entries(positionMap)) {
      if (lowerQuery.includes(key)) {
        targetPosition = value;
        break;
      }
    }
    
    // Check if asking about specific scoring format
    const isPPR = lowerQuery.includes('ppr');
    const isHalfPPR = lowerQuery.includes('half') && lowerQuery.includes('ppr');
    const isStandard = lowerQuery.includes('standard');
    
    // Check if we have mock data to work with
    if (playerData && playerData.length > 0) {
      // Filter available players
      let availablePlayers = playerData.filter(player => !player.isRostered);
      
      // Apply position filter if specified
      if (targetPosition) {
        availablePlayers = availablePlayers.filter(player => player.position === targetPosition);
      }
      
      // Sort by appropriate metric based on scoring format
      if (isPPR) {
        availablePlayers.sort((a, b) => (b.projectedPointsPPR || b.projectedPoints) - 
                                        (a.projectedPointsPPR || a.projectedPoints));
      } else if (isHalfPPR) {
        availablePlayers.sort((a, b) => (b.projectedPointsHalfPPR || b.projectedPoints) - 
                                        (a.projectedPointsHalfPPR || a.projectedPoints));
      } else {
        availablePlayers.sort((a, b) => b.projectedPoints - a.projectedPoints);
      }
      
      // Get top players (limit to 5 or fewer)
      const topPlayers = availablePlayers.slice(0, 5);
      
      if (topPlayers.length > 0) {
        // Create the recommendation text
        const formatStr = isPPR ? 'PPR' : isHalfPPR ? 'Half PPR' : 'standard';
        const positionStr = targetPosition ? ` ${targetPosition}` : '';
        const header = `Top${positionStr} waiver wire pickups${formatStr !== 'standard' ? ` (${formatStr})` : ''}:`;
        
        const recommendations = topPlayers.map((player, index) => {
          // Calculate roster percentage string if available
          const rosterPct = player.rosterPercentage ? ` (${player.rosterPercentage}% rostered)` : '';
          
          // Create reason for recommendation based on available data
          let reason = '';
          if (player.recentPerformance) {
            reason = ` - ${player.recentPerformance}`;
          } else if (player.projectedPoints > 10) {
            reason = ` - high upside this week vs ${player.opponent}`;
          } else if (player.injury === null && player.teamInjuries) {
            reason = ` - opportunity due to team injuries`;
          } else {
            reason = ` - favorable matchup vs ${player.opponent}`;
          }
          
          return `${index + 1}) ${player.name} (${player.team}, ${player.position})${rosterPct}${reason}`;
        }).join('\n');
        
        return `${header}\n${recommendations}`;
      }
    }
    
    // Fallback recommendations based on position
    const generalRecommendations = [
      "Top waiver pickups this week: 1) Jayden Reed (GB, WR) - emerging as a favorite target with 22% target share, 2) Tank Bigsby (JAX, RB) - taking on more carries with starter injured, 3) Isaiah Likely (BAL, TE) - red zone threat with Andrews out.",
      "Consider these under-the-radar pickups: 1) Roschon Johnson (CHI, RB) - increasing red zone opportunities, 2) Wan'Dale Robinson (NYG, WR) - returning with high target volume, 3) Tyler Conklin (NYJ, TE) - consistent floor in PPR formats."
    ];
    
    const qbRecommendations = [
      "QB waiver targets: 1) Sam Howell (WAS) - averaging 275 passing yards over last 3 games, 2) Gardner Minshew (IND) - starting role secured with rushing upside, 3) Baker Mayfield (TB) - favorable upcoming schedule."
    ];
    
    const rbRecommendations = [
      "RB waiver options: 1) Zach Charbonnet (SEA) - Walker injury creating opportunity, 2) Roschon Johnson (CHI) - increasing snap share in committee, 3) Tyjae Spears (TEN) - explosive plays in limited touches."
    ];
    
    const wrRecommendations = [
      "WR waiver targets: 1) Jayden Reed (GB) - consistent targets in emerging offense, 2) Josh Palmer (LAC) - stepping up with Williams injured, 3) Rashid Shaheed (NO) - big play potential every week."
    ];
    
    const teRecommendations = [
      "TE streaming options: 1) Isaiah Likely (BAL) - increased snaps with Andrews limited, 2) Cole Kmet (CHI) - red zone favorite for Fields, 3) Luke Musgrave (GB) - rookie seeing increased targets."
    ];
    
    // Return position-specific recommendation if requested
    if (targetPosition === 'QB') return qbRecommendations[0];
    if (targetPosition === 'RB') return rbRecommendations[0];
    if (targetPosition === 'WR') return wrRecommendations[0];
    if (targetPosition === 'TE') return teRecommendations[0];
    
    // Return random general recommendation
    return generalRecommendations[Math.floor(Math.random() * generalRecommendations.length)];
  };
  
  // Generate trade advice
  const generateTradeAdvice = (query = '') => {
    const lowerQuery = query.toLowerCase();
    
    // Check if specific players are mentioned in a trade scenario
    const playerRegex = /should i trade\s+(.+?)\s+for\s+(.+?)(?:\?|$)/i;
    const matchTrade = lowerQuery.match(playerRegex);
    
    if (matchTrade) {
      const player1 = matchTrade[1].trim(); // Player to trade away
      const player2 = matchTrade[2].trim(); // Player to receive
      
      // Try to find these players in our data
      const playerToTradeAway = playerData.find(p => 
        p.name.toLowerCase().includes(player1.toLowerCase()));
      const playerToReceive = playerData.find(p => 
        p.name.toLowerCase().includes(player2.toLowerCase()));
      
      // If we found both players, give specific advice
      if (playerToTradeAway && playerToReceive) {
        if (playerToReceive.projectedPoints > playerToTradeAway.projectedPoints + 3) {
          return `Yes, I would trade ${playerToTradeAway.name} for ${playerToReceive.name}. ${playerToReceive.name} has better projected output (${playerToReceive.projectedPoints} vs ${playerToTradeAway.projectedPoints} points) and has a more favorable upcoming schedule.`;
        } else if (Math.abs(playerToReceive.projectedPoints - playerToTradeAway.projectedPoints) <= 3) {
          return `Trading ${playerToTradeAway.name} for ${playerToReceive.name} is fairly even. Consider your team needs - if you're stronger at ${playerToTradeAway.position} and weaker at ${playerToReceive.position}, it could make sense.`;
        } else {
          return `I would not trade ${playerToTradeAway.name} for ${playerToReceive.name}. You'd be giving up too much value based on projected performance and upcoming matchups.`;
        }
      }
      
      // Generic advice for specific players if not in our database
      return `When evaluating trading ${player1} for ${player2}, consider: 1) Rest-of-season value, not just next week, 2) Your team's positional strengths and weaknesses, 3) Upcoming schedule difficulty, and 4) Injury risk factors.`;
    }
    
    // Position-specific trade advice
    const positionMap = {
      'quarterback': 'QB', 'qb': 'QB',
      'running back': 'RB', 'rb': 'RB',
      'wide receiver': 'WR', 'wr': 'WR', 
      'tight end': 'TE', 'te': 'TE'
    };
    
    let targetPosition = null;
    for (const [key, value] of Object.entries(positionMap)) {
      if (lowerQuery.includes(key)) {
        targetPosition = value;
        break;
      }
    }
    
    // Position-specific advice
    if (targetPosition) {
      switch(targetPosition) {
        case 'QB':
          return "QB Trade Advice: Unless you have a top-3 QB (Mahomes, Allen, or Jackson), consider streaming based on matchups rather than trading significant assets. QBs like Tua Tagovailoa and Jared Goff are undervalued trade targets with favorable upcoming schedules.";
        case 'RB':
          return "RB Trade Advice: Running backs with high volume are the most valuable fantasy assets. Target RBs like Rhamondre Stevenson and Kenneth Walker whose value may be temporarily suppressed. Consider trading away RBs like D'Andre Swift and Najee Harris who may be overvalued based on name recognition.";
        case 'WR':
          return "WR Trade Advice: Target wide receivers with high target shares in good offenses. Drake London and Christian Watson are buy-low candidates with increasing target shares. Consider selling high on receivers like Diontae Johnson and Adam Thielen who may be overperforming their expected volume.";
        case 'TE':
          return "TE Trade Advice: Unless you have an elite TE (Kelce, Andrews, Kittle), don't overpay in trades for the position. Target high-upside TEs like Dallas Goedert and Dalton Kincaid who could see increased usage as the season progresses.";
        default:
          break;
      }
    }
    
    // Check for buy/sell type queries
    if (lowerQuery.includes('buy low') || lowerQuery.includes('trade for')) {
      return "Current buy-low candidates: 1) Najee Harris (PIT, RB) - schedule eases up, 2) Drake London (ATL, WR) - target share increasing, 3) Kyle Pitts (ATL, TE) - role expanding, 4) Trevor Lawrence (JAX, QB) - offensive improvements coming.";
    }
    
    if (lowerQuery.includes('sell high') || lowerQuery.includes('trade away')) {
      return "Current sell-high candidates: 1) Ezekiel Elliott (NE, RB) - unsustainable workload, 2) Adam Thielen (CAR, WR) - regression in target share likely, 3) Geno Smith (SEA, QB) - schedule gets tougher, 4) Hunter Henry (NE, TE) - touchdown rate unsustainable.";
    }
    
    // General trade advice (default response)
    const tradeAdviceOptions = [
      "When considering trades, focus on rest-of-season value rather than just next week. Currently undervalued players to target: Rhamondre Stevenson (NE, RB), Drake London (ATL, WR), and Kyle Pitts (ATL, TE). Players potentially overvalued: D'Andre Swift (PHI, RB), Adam Thielen (CAR, WR).",
      
      "Effective fantasy trading requires buying low and selling high. Look to acquire Christian Watson (GB, WR) and Kenneth Walker (SEA, RB) before they break out. Consider trading away D'Andre Swift (PHI, RB) and Diontae Johnson (PIT, WR) if you can get good value.",
      
      "Trade strategy depends on your record. If you're 5-1 or better, target injured stars like Jonathan Taylor or Cooper Kupp for playoff upside. If you're 1-5 or worse, trade depth for immediate production to make a playoff push."
    ];
    
    return tradeAdviceOptions[Math.floor(Math.random() * tradeAdviceOptions.length)];
  };
  
  // Check for injury updates
  const checkInjuryUpdates = (query = '') => {
    const lowerQuery = query.toLowerCase();
    
    // Check if specific player is mentioned
    const findPlayerByName = (name) => {
      if (!playerData || playerData.length === 0) return null;
      
      return playerData.find(player => 
        player.name.toLowerCase().includes(name.toLowerCase())
      );
    };
    
    // Extract player name if mentioned
    const extractPlayerName = (query) => {
      const commonPatterns = [
        /is\s+([a-z\s]+)\s+injured/i,
        /([a-z\s]+)\s+injury/i,
        /([a-z\s]+)\s+status/i,
        /what.*about\s+([a-z\s]+)/i
      ];
      
      for (const pattern of commonPatterns) {
        const match = query.match(pattern);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
      
      return null;
    };
    
    // Check for specific player injury
    const playerName = extractPlayerName(lowerQuery);
    if (playerName) {
      const player = findPlayerByName(playerName);
      
      if (player) {
        if (player.injury) {
          return `${player.name} (${player.team}, ${player.position}) is currently ${player.injury}. ${player.injuryDetails || 'Monitor practice reports for updates.'}`;
        } else {
          return `Good news! ${player.name} (${player.team}, ${player.position}) is currently not on the injury report and should be good to go this week.`;
        }
      }
      
      // If player not found in data, provide a generic response
      return `I don't have specific injury information for ${playerName}. Check the latest team practice reports or injury designations for the most current status.`;
    }
    
    // Check for team-specific injuries
    const teamAbbreviations = {
      'arizona': 'ARI', 'cardinals': 'ARI',
      'atlanta': 'ATL', 'falcons': 'ATL',
      'baltimore': 'BAL', 'ravens': 'BAL',
      'buffalo': 'BUF', 'bills': 'BUF',
      'carolina': 'CAR', 'panthers': 'CAR',
      'chicago': 'CHI', 'bears': 'CHI',
      'cincinnati': 'CIN', 'bengals': 'CIN',
      'cleveland': 'CLE', 'browns': 'CLE',
      'dallas': 'DAL', 'cowboys': 'DAL',
      'denver': 'DEN', 'broncos': 'DEN',
      'detroit': 'DET', 'lions': 'DET',
      'green bay': 'GB', 'packers': 'GB',
      'houston': 'HOU', 'texans': 'HOU',
      'indianapolis': 'IND', 'colts': 'IND',
      'jacksonville': 'JAX', 'jaguars': 'JAX',
      'kansas city': 'KC', 'chiefs': 'KC',
      'las vegas': 'LV', 'raiders': 'LV',
      'los angeles chargers': 'LAC', 'chargers': 'LAC',
      'los angeles rams': 'LAR', 'rams': 'LAR',
      'miami': 'MIA', 'dolphins': 'MIA',
      'minnesota': 'MIN', 'vikings': 'MIN',
      'new england': 'NE', 'patriots': 'NE',
      'new orleans': 'NO', 'saints': 'NO',
      'new york giants': 'NYG', 'giants': 'NYG',
      'new york jets': 'NYJ', 'jets': 'NYJ',
      'philadelphia': 'PHI', 'eagles': 'PHI',
      'pittsburgh': 'PIT', 'steelers': 'PIT',
      'san francisco': 'SF', '49ers': 'SF',
      'seattle': 'SEA', 'seahawks': 'SEA',
      'tampa bay': 'TB', 'buccaneers': 'TB',
      'tennessee': 'TEN', 'titans': 'TEN',
      'washington': 'WAS', 'commanders': 'WAS'
    };
    
    // Look for team mentions
    let teamAbbr = null;
    for (const [teamName, abbr] of Object.entries(teamAbbreviations)) {
      if (lowerQuery.includes(teamName)) {
        teamAbbr = abbr;
        break;
      }
    }
    
    if (teamAbbr && playerData && playerData.length > 0) {
      // Filter for injured players on specified team
      const teamInjuries = playerData.filter(player => 
        player.team === teamAbbr && player.injury
      );
      
      if (teamInjuries.length > 0) {
        const injuryList = teamInjuries.map(player => 
          `${player.name} (${player.position}) - ${player.injury}`
        ).join('\n');
        
        return `Current injuries for ${teamAbbr}:\n${injuryList}`;
      } else {
        return `No significant injuries reported for ${teamAbbr} at this time.`;
      }
    }
    
    // Check for position-specific injuries
    const positionMap = {
      'quarterback': 'QB', 'qb': 'QB',
      'running back': 'RB', 'rb': 'RB',
      'wide receiver': 'WR', 'wr': 'WR',
      'tight end': 'TE', 'te': 'TE'
    };
    
    let targetPosition = null;
    for (const [key, value] of Object.entries(positionMap)) {
      if (lowerQuery.includes(key)) {
        targetPosition = value;
        break;
      }
    }
    
    if (targetPosition && playerData && playerData.length > 0) {
      // Filter for injured players of specified position
      const positionInjuries = playerData.filter(player => 
        player.position === targetPosition && player.injury
      ).sort((a, b) => (b.projectedPoints || 0) - (a.projectedPoints || 0));
      
      if (positionInjuries.length > 0) {
        const topInjuries = positionInjuries.slice(0, 5);
        const injuryList = topInjuries.map(player => 
          `${player.name} (${player.team}) - ${player.injury}`
        ).join('\n');
        
        return `Notable ${targetPosition} injuries this week:\n${injuryList}`;
      } else {
        return `No significant ${targetPosition} injuries reported at this time.`;
      }
    }
    
    // Default response with general injury updates
    const injuryOptions = [
      "Latest injury concerns: Amon-Ra St. Brown (DET, WR - ankle) questionable but trending toward playing, Travis Kelce (KC, TE - knee) limited in practice but expected to play, Kenneth Walker III (SEA, RB - hamstring) game-time decision.",
      
      "Key injury updates: Justin Jefferson (MIN, WR - hamstring) out at least one more week, Christian McCaffrey (SF, RB - calf) limited in practice but expected to play, Garrett Wilson (NYJ, WR - ankle) upgraded to full practice participation.",
      
      "Injury report highlights: Joe Burrow (CIN, QB - wrist) full practice participant and cleared to play, Davante Adams (LV, WR - shoulder) missed practice Wednesday/Thursday but returned Friday, Dallas Goedert (PHI, TE - ankle) moved to IR and out 4-6 weeks."
    ];
    
    // Return random injury update
    return injuryOptions[Math.floor(Math.random() * injuryOptions.length)];
  };
  
  // Analyze matchups
  const analyzeMatchups = (query = '') => {
    const lowerQuery = query.toLowerCase();
    
    // Check if specific player matchup is mentioned
    const findPlayerByName = (name) => {
      if (!playerData || playerData.length === 0) return null;
      
      return playerData.find(player => 
        player.name.toLowerCase().includes(name.toLowerCase())
      );
    };
    
    // Extract player name if mentioned
    const extractPlayerName = (query) => {
      const commonPatterns = [
        /how\s+(?:will|does)\s+([a-z\s]+)\s+(?:do|perform|match up)/i,
        /should\s+i\s+(?:start|play)\s+([a-z\s]+)/i,
        /([a-z\s]+)\s+(?:vs|against|matchup)/i,
        /what\s+about\s+([a-z\s]+)/i
      ];
      
      for (const pattern of commonPatterns) {
        const match = query.match(pattern);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
      
      return null;
    };
    
    // Check for specific player matchup
    const playerName = extractPlayerName(lowerQuery);
    if (playerName) {
      const player = findPlayerByName(playerName);
      
      if (player) {
        // Get opponent defensive ranking against player's position
        const oppDefenseRank = getDefenseRankAgainstPosition(player.opponent, player.position);
        
        if (oppDefenseRank <= 10) {
          return `${player.name} has a favorable matchup against ${player.opponent} this week. They're ranked #${oppDefenseRank} against ${player.position}s, allowing ${getPositionStats(player.opponent, player.position)}. Consider ${player.name} a strong play this week.`;
        } else if (oppDefenseRank >= 23) {
          return `${player.name} faces a tough matchup against ${player.opponent}. They're ranked #${oppDefenseRank} against ${player.position}s, allowing only ${getPositionStats(player.opponent, player.position)}. Consider other options if you have them.`;
        } else {
          return `${player.name} has a neutral matchup against ${player.opponent} (ranked #${oppDefenseRank} against ${player.position}s). Expect typical production around ${player.projectedPoints} points.`;
        }
      }
      
      // If player not found in data, provide a generic response
      return `I don't have specific matchup data for ${playerName}. Check recent defensive performance against that position to evaluate the matchup quality.`;
    }
    
    // Check for team defense queries
    if ((lowerQuery.includes('defense') || lowerQuery.includes('dst') || lowerQuery.includes('def')) && !lowerQuery.includes('against')) {
      return analyzeDefenseMatchups();
    }
    
    // Check for position matchup queries
    const positionMap = {
      'quarterback': 'QB', 'qb': 'QB',
      'running back': 'RB', 'rb': 'RB',
      'wide receiver': 'WR', 'wr': 'WR',
      'tight end': 'TE', 'te': 'TE'
    };
    
    let targetPosition = null;
    for (const [key, value] of Object.entries(positionMap)) {
      if (lowerQuery.includes(key)) {
        targetPosition = value;
        break;
      }
    }
    
    if (targetPosition) {
      return analyzePositionMatchups(targetPosition);
    }
    
    // Check for team vs. position queries
    const teamAbbreviations = {
      'arizona': 'ARI', 'cardinals': 'ARI',
      'atlanta': 'ATL', 'falcons': 'ATL',
      'baltimore': 'BAL', 'ravens': 'BAL',
      'buffalo': 'BUF', 'bills': 'BUF',
      // Add all other teams...
      'washington': 'WAS', 'commanders': 'WAS'
    };
    
    let teamAbbr = null;
    for (const [teamName, abbr] of Object.entries(teamAbbreviations)) {
      if (lowerQuery.includes(teamName)) {
        teamAbbr = abbr;
        break;
      }
    }
    
    if (teamAbbr) {
      // Check if it's about a team's defense
      if (lowerQuery.includes('against') || lowerQuery.includes('vs')) {
        // Determine which position we're asking about
        for (const [key, value] of Object.entries(positionMap)) {
          if (lowerQuery.includes(key)) {
            return analyzeTeamDefenseAgainstPosition(teamAbbr, value);
          }
        }
      }
    }
    
    // Default response with general matchup analysis
    return generateGeneralMatchupAdvice();
  };
  
  // Helper functions
  
  // Get defense rank against position (mock function)
  const getDefenseRankAgainstPosition = (team, position) => {
    // In a real implementation, this would look up actual stats
    // Return a number from 1-32 where 1 is the worst defense against that position
    // and 32 is the best defense against that position
    const mockRankings = {
      'ARI': { 'QB': 28, 'RB': 30, 'WR': 25, 'TE': 15 },
      'ATL': { 'QB': 20, 'RB': 18, 'WR': 22, 'TE': 8 },
      'BAL': { 'QB': 12, 'RB': 5, 'WR': 15, 'TE': 10 },
      'BUF': { 'QB': 5, 'RB': 7, 'WR': 8, 'TE': 12 },
      'CAR': { 'QB': 26, 'RB': 32, 'WR': 18, 'TE': 20 },
      'CHI': { 'QB': 18, 'RB': 22, 'WR': 27, 'TE': 16 },
      'CIN': { 'QB': 15, 'RB': 14, 'WR': 10, 'TE': 22 },
      'CLE': { 'QB': 10, 'RB': 8, 'WR': 12, 'TE': 18 },
      'DAL': { 'QB': 8, 'RB': 16, 'WR': 7, 'TE': 14 },
      'DEN': { 'QB': 22, 'RB': 20, 'WR': 16, 'TE': 5 },
      'DET': { 'QB': 30, 'RB': 10, 'WR': 30, 'TE': 25 },
      'GB': { 'QB': 14, 'RB': 15, 'WR': 20, 'TE': 17 },
      'HOU': { 'QB': 17, 'RB': 25, 'WR': 19, 'TE': 20 },
      'IND': { 'QB': 25, 'RB': 28, 'WR': 24, 'TE': 15 },
      'JAX': { 'QB': 16, 'RB': 12, 'WR': 14, 'TE': 22 },
      'KC': { 'QB': 7, 'RB': 9, 'WR': 5, 'TE': 6 },
      'LV': { 'QB': 29, 'RB': 26, 'WR': 28, 'TE': 30 },
      'LAC': { 'QB': 13, 'RB': 17, 'WR': 15, 'TE': 16 },
      'LAR': { 'QB': 18, 'RB': 19, 'WR': 21, 'TE': 24 },
      'MIA': { 'QB': 27, 'RB': 24, 'WR': 26, 'TE': 19 },
      'MIN': { 'QB': 19, 'RB': 21, 'WR': 17, 'TE': 13 },
      'NE': { 'QB': 9, 'RB': 13, 'WR': 11, 'TE': 7 },
      'NO': { 'QB': 6, 'RB': 11, 'WR': 9, 'TE': 21 },
      'NYG': { 'QB': 23, 'RB': 20, 'WR': 26, 'TE': 27 },
      'NYJ': { 'QB': 4, 'RB': 6, 'WR': 3, 'TE': 9 },
      'PHI': { 'QB': 11, 'RB': 3, 'WR': 13, 'TE': 11 },
      'PIT': { 'QB': 3, 'RB': 4, 'WR': 6, 'TE': 4 },
      'SF': { 'QB': 2, 'RB': 1, 'WR': 2, 'TE': 3 },
      'SEA': { 'QB': 21, 'RB': 27, 'WR': 23, 'TE': 28 },
      'TB': { 'QB': 8, 'RB': 2, 'WR': 16, 'TE': 19 },
      'TEN': { 'QB': 24, 'RB': 23, 'WR': 25, 'TE': 26 },
      'WAS': { 'QB': 31, 'RB': 29, 'WR': 29, 'TE': 31 }
    };
    
    return team && position && mockRankings[team] ? mockRankings[team][position] : 16;
  };
  
  // Get position stats allowed by team (mock function)
  const getPositionStats = (team, position) => {
    const mockStats = {
      'QB': {
        weak: '290 yards and 2.3 TDs per game',
        average: '245 yards and 1.8 TDs per game',
        strong: '210 yards and 1.2 TDs per game'
      },
      'RB': {
        weak: '130 rushing yards and 1.2 TDs per game',
        average: '95 rushing yards and 0.8 TDs per game',
        strong: '75 rushing yards and 0.5 TDs per game'
      },
      'WR': {
        weak: '190 receiving yards and 1.5 TDs per game',
        average: '160 receiving yards and 1.0 TDs per game',
        strong: '120 receiving yards and 0.7 TDs per game'
      },
      'TE': {
        weak: '75 yards and 0.8 TDs per game',
        average: '55 yards and 0.5 TDs per game',
        strong: '35 yards and 0.3 TDs per game'
      }
    };
    
    const rank = getDefenseRankAgainstPosition(team, position);
    
    if (rank <= 10) {
      return mockStats[position].weak;
    } else if (rank >= 23) {
      return mockStats[position].strong;
    } else {
      return mockStats[position].average;
    }
  };
  
  // Analyze defense matchups
  const analyzeDefenseMatchups = () => {
    return "Top defensive plays this week: 1) 49ers vs CAR (turnover-prone offense), 2) Steelers vs CLE (low-scoring division game expected), 3) Jets vs NE (rookie QB struggles). Defenses to avoid: Cardinals vs KC, Commanders vs PHI, Raiders vs LAC.";
  };
  
  // Analyze position matchups
  const analyzePositionMatchups = (position) => {
    const positionAdvice = {
      'QB': "QB Matchups: FAVORABLE - Kirk Cousins vs DET (32nd vs QBs), Sam Darnold vs WAS (31st), Josh Allen vs MIA (27th). AVOID - Justin Fields vs PIT (3rd), Jared Goff vs SF (2nd), Daniel Jones vs NYJ (4th).",
      'RB': "RB Matchups: FAVORABLE - Aaron Jones vs CAR (32nd vs RBs), Kenneth Walker vs IND (28th), Bijan Robinson vs WAS (29th). AVOID - Brian Robinson vs SF (1st), Rachaad White vs PIT (4th), Kenneth Walker vs PHI (3rd).",
      'WR': "WR Matchups: FAVORABLE - Justin Jefferson vs DET (30th vs WRs), Drake London vs WAS (29th), Stefon Diggs vs MIA (26th). AVOID - Christian Watson vs SF (2nd), Garrett Wilson vs NYJ (3rd), DeVonta Smith vs KC (5th).",
      'TE': "TE Matchups: FAVORABLE - Kyle Pitts vs WAS (31st vs TEs), Dallas Goedert vs LV (30th), TJ Hockenson vs SEA (28th). AVOID - Dallas Goedert vs PIT (4th), Pat Freiermuth vs SF (3rd), Cole Kmet vs TB (5th)."
    };
    
    return positionAdvice[position] || "I don't have specific matchup data for that position.";
  };
  
  // Analyze team defense against position
  const analyzeTeamDefenseAgainstPosition = (team, position) => {
    const rank = getDefenseRankAgainstPosition(team, position);
    const stats = getPositionStats(team, position);
    
    if (rank <= 10) {
      return `${team} has struggled against ${position}s this season (ranked #${rank}), allowing ${stats}. This is a favorable matchup for ${position}s facing them.`;
    } else if (rank >= 23) {
      return `${team} has been strong against ${position}s this season (ranked #${rank}), allowing only ${stats}. Consider benching borderline ${position}s against them.`;
    } else {
      return `${team} has been average against ${position}s this season (ranked #${rank}), allowing ${stats}. Neither a particularly favorable nor unfavorable matchup.`;
    }
  };
  
  // Generate general matchup advice
  const generateGeneralMatchupAdvice = () => {
    const generalAdvice = [
      "Favorable matchups this week: WRs vs Arizona (poor CB performance), RBs vs Carolina (allowing 5.2 YPC), QBs vs Detroit (28+ points allowed to QBs last 3 weeks). Avoid players facing San Francisco's defense if possible.",
      
      "Key matchup trends: 1) Arizona allows most fantasy points to opposition WRs (+27% above average), 2) Carolina struggling against the run (170+ yards in last 4 games), 3) Washington secondary allowing highest completion percentage (72%). Tough matchups: Any skill position vs SF, RBs vs Tampa Bay, TEs vs Denver.",
      
      "Weather impact matchups: BUF vs KC facing high winds (downgrade kickers and deep threats), MIN vs CHI expecting heavy rain (potential run-heavy game scripts), CLE vs PIT snow possible (monitor weather updates)."
    ];
    
    return generalAdvice[Math.floor(Math.random() * generalAdvice.length)];
  };
  
  return (
    <div className="fantasy-football-coach">
      <header>
        <div className="header-content">
          <div className="football-icon"></div>
          <div>
            <h1>Fantasy Football AI Coach</h1>
            <p>Your data-driven assistant for fantasy domination</p>
          </div>
        </div>
      </header>
      
      <div className="chat-container" id="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
            <div className="message-time">
              {message.timestamp || "Just now"}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator">
            Analyzing fantasy data<span>.</span><span>.</span><span>.</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about start/sit decisions, waiver pickups, etc."
          aria-label="Chat input"
        />
        <button type="submit">
          Send
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}

export default FantasyFootballCoach;