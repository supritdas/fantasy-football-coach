// Update mockData.js to include these fields
export const mockPlayerData = [
    {
      id: 1,
      name: "Patrick Mahomes",
      position: "QB",
      team: "KC",
      projectedPoints: 22.7,
      opponent: "LV",
      injury: null,
      isRostered: true  // Player is already on someone's team
    },
    {
      id: 2,
      name: "Travis Kelce",
      position: "TE",
      team: "KC",
      projectedPoints: 14.5,
      opponent: "LV",
      injury: "Questionable - Knee",
      isRostered: true
    },
    {
      id: 3,
      name: "Jayden Reed", 
      position: "WR",
      team: "GB", 
      projectedPoints: 12.3,
      opponent: "MIN",
      injury: null,
      isRostered: false  // Available on waiver wire
    },
    {
      id: 4,
      name: "Tank Bigsby",
      position: "RB",
      team: "JAX",
      projectedPoints: 9.8,
      opponent: "HOU",
      injury: null,
      isRostered: false
    },
    {
      id: 5,
      name: "Isaiah Likely",
      position: "TE",
      team: "BAL",
      projectedPoints: 8.5,
      opponent: "CIN",
      injury: null,
      isRostered: false
    },
      {
        id: 6, name: "Justin Jefferson", position: "WR", team: "MIN", projectedPoints: 18.4, opponent: "GB", injury: null, isRostered: true
      },
      {
        id: 7, name: "Josh Allen", position: "QB", team: "BUF", projectedPoints: 23.1, opponent: "NE", injury: null, isRostered: true
      },
      {
        id: 8, name: "Saquon Barkley", position: "RB", team: "NYG", projectedPoints: 16.7, opponent: "PHI", injury: "Probable - Ankle", isRostered: true
      },
      {
        id: 9, name: "Tyreek Hill", position: "WR", team: "MIA", projectedPoints: 21.2, opponent: "NYJ", injury: null, isRostered: true
      },
      {
        id: 10, name: "Tony Pollard", position: "RB", team: "DAL", projectedPoints: 15.3, opponent: "WAS", injury: null, isRostered: true
      },
      {
        id: 11, name: "George Kittle", position: "TE", team: "SF", projectedPoints: 10.4, opponent: "SEA", injury: null, isRostered: true
      },
      {
        id: 12, name: "Amari Cooper", position: "WR", team: "CLE", projectedPoints: 13.1, opponent: "PIT", injury: "Questionable - Groin", isRostered: false
      },
      {
        id: 13, name: "Dalton Kincaid", position: "TE", team: "BUF", projectedPoints: 9.6, opponent: "NE", injury: null, isRostered: false
      },
      {
        id: 14, name: "Derek Carr", position: "QB", team: "NO", projectedPoints: 15.8, opponent: "TB", injury: null, isRostered: false
      },
      {
        id: 15, name: "Aaron Jones", position: "RB", team: "GB", projectedPoints: 12.9, opponent: "MIN", injury: null, isRostered: true
      },
      {
        id: 16, name: "Calvin Ridley", position: "WR", team: "JAX", projectedPoints: 12.6, opponent: "HOU", injury: null, isRostered: true
      },
      {
        id: 17, name: "Jared Goff", position: "QB", team: "DET", projectedPoints: 17.0, opponent: "CHI", injury: null, isRostered: true
      },
      {
        id: 18, name: "David Montgomery", position: "RB", team: "DET", projectedPoints: 11.4, opponent: "CHI", injury: null, isRostered: true
      },
      {
        id: 19, name: "Zach Charbonnet", position: "RB", team: "SEA", projectedPoints: 7.2, opponent: "SF", injury: null, isRostered: false
      },
      {
        id: 20, name: "Taysom Hill", position: "TE", team: "NO", projectedPoints: 7.8, opponent: "TB", injury: null, isRostered: false
      },
      {
        id: 21, name: "Courtland Sutton", position: "WR", team: "DEN", projectedPoints: 11.9, opponent: "LAC", injury: null, isRostered: false
      },
      {
        id: 22, name: "Kirk Cousins", position: "QB", team: "MIN", projectedPoints: 18.7, opponent: "GB", injury: null, isRostered: false
      },
      {
        id: 23, name: "Gus Edwards", position: "RB", team: "BAL", projectedPoints: 10.6, opponent: "CIN", injury: null, isRostered: false
      },
      {
        id: 24, name: "Elijah Moore", position: "WR", team: "CLE", projectedPoints: 9.1, opponent: "PIT", injury: null, isRostered: false
      },
      {
        id: 25, name: "Darnell Mooney", position: "WR", team: "CHI", projectedPoints: 7.3, opponent: "DET", injury: null, isRostered: false
      },
      {
        id: 26, name: "Chuba Hubbard", position: "RB", team: "CAR", projectedPoints: 8.2, opponent: "ATL", injury: null, isRostered: false
      },
      {
        id: 27, name: "Jake Ferguson", position: "TE", team: "DAL", projectedPoints: 7.6, opponent: "WAS", injury: null, isRostered: true
      },
      {
        id: 28, name: "Baker Mayfield", position: "QB", team: "TB", projectedPoints: 14.4, opponent: "NO", injury: null, isRostered: false
      },
      {
        id: 29, name: "Tyler Lockett", position: "WR", team: "SEA", projectedPoints: 10.5, opponent: "SF", injury: null, isRostered: true
      },
      {
        id: 30, name: "Romeo Doubs", position: "WR", team: "GB", projectedPoints: 8.9, opponent: "MIN", injury: null, isRostered: false
      },
      {
        id: 31, name: "Kenneth Gainwell", position: "RB", team: "PHI", projectedPoints: 6.3, opponent: "NYG", injury: null, isRostered: false
      },
      {
        id: 32, name: "Michael Gallup", position: "WR", team: "DAL", projectedPoints: 6.8, opponent: "WAS", injury: null, isRostered: false
      },
      {
        id: 33, name: "Zamir White", position: "RB", team: "LV", projectedPoints: 7.4, opponent: "KC", injury: null, isRostered: false
      },
      {
        id: 34, name: "Hayden Hurst", position: "TE", team: "CAR", projectedPoints: 5.9, opponent: "ATL", injury: null, isRostered: false
      },
      {
        id: 35, name: "C.J. Stroud", position: "QB", team: "HOU", projectedPoints: 16.5, opponent: "JAX", injury: null, isRostered: true
      },
      {
        id: 36, name: "Javonte Williams", position: "RB", team: "DEN", projectedPoints: 9.7, opponent: "LAC", injury: null, isRostered: true
      },
      {
        id: 37, name: "Mike Gesicki", position: "TE", team: "NE", projectedPoints: 6.1, opponent: "BUF", injury: null, isRostered: false
      },
      {
        id: 38, name: "Tyler Boyd", position: "WR", team: "CIN", projectedPoints: 7.6, opponent: "BAL", injury: null, isRostered: false
      },
      {
        id: 39, name: "Bryce Young", position: "QB", team: "CAR", projectedPoints: 13.2, opponent: "ATL", injury: null, isRostered: false
      },
      {
        id: 40, name: "Rashaad Penny", position: "RB", team: "PHI", projectedPoints: 5.2, opponent: "NYG", injury: null, isRostered: false
      },
      {
        id: 41, name: "Hunter Henry", position: "TE", team: "NE", projectedPoints: 7.4, opponent: "BUF", injury: null, isRostered: false
      },
      {
        id: 42, name: "Van Jefferson", position: "WR", team: "ATL", projectedPoints: 6.7, opponent: "CAR", injury: null, isRostered: false
      },
      {
        id: 43, name: "Sam Howell", position: "QB", team: "WAS", projectedPoints: 15.3, opponent: "DAL", injury: null, isRostered: false
      },
      {
        id: 44, name: "Tank Dell", position: "WR", team: "HOU", projectedPoints: 11.5, opponent: "JAX", injury: null, isRostered: true
      },
      {
        id: 45, name: "Tyjae Spears", position: "RB", team: "TEN", projectedPoints: 8.1, opponent: "IND", injury: null, isRostered: false
      },
      {
        id: 46, name: "Pat Freiermuth", position: "TE", team: "PIT", projectedPoints: 6.5, opponent: "CLE", injury: null, isRostered: false
      },
      {
        id: 47, name: "Rondale Moore", position: "WR", team: "ARI", projectedPoints: 7.2, opponent: "LAR", injury: null, isRostered: false
      },
      {
        id: 48, name: "Desmond Ridder", position: "QB", team: "ATL", projectedPoints: 13.7, opponent: "CAR", injury: null, isRostered: false
      },
      {
        id: 49, name: "Jalin Hyatt", position: "WR", team: "NYG", projectedPoints: 5.4, opponent: "PHI", injury: null, isRostered: false
      },
      {
        id: 50, name: "Zack Moss", position: "RB", team: "IND", projectedPoints: 9.2, opponent: "TEN", injury: null, isRostered: false
      },
      {
        id: 51, name: "Noah Fant", position: "TE", team: "SEA", projectedPoints: 5.7, opponent: "SF", injury: null, isRostered: false
      },
      {
        id: 52, name: "Treylon Burks", position: "WR", team: "TEN", projectedPoints: 6.0, opponent: "IND", injury: "Out - Knee", isRostered: false
      },
      {
        id: 53, name: "Trey Lance", position: "QB", team: "DAL", projectedPoints: 4.9, opponent: "WAS", injury: null, isRostered: false
      },
      {
        id: 54, name: "Jaylen Warren", position: "RB", team: "PIT", projectedPoints: 10.1, opponent: "CLE", injury: null, isRostered: true
      },
      {
        id: 55, name: "Logan Thomas", position: "TE", team: "WAS", projectedPoints: 6.9, opponent: "DAL", injury: null, isRostered: false
      }
    ];
    
