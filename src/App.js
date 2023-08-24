import { useState } from "react";
import Game from "./Game";

function App() {
  const [startgame, setStartGame] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("SLUG");
  const difficultyLevel = [
    { label: "SLUG", speed: 200 },
    { label: "WORM", speed: 100 },
    { label: "PYTHON", speed: 50 },
  ];
  const handleLevel = (level) => {
    setSpeed(level.speed);
    setLevel(level.label);
    setStartGame(true);
  };

  const addScore = (newScore) => {
    setScore((prevScore) => {
      if (speed === 50) return prevScore + newScore * 3;
      else if (speed === 100) return prevScore + newScore * 2;
      else return prevScore + newScore * 1;
    });
  };

  return (
    <div style={{ justifyContent: "center" }}>
      {!startgame && (
        <div className="game">
          <div className="level">
            <div className="name"> SNAKE</div>
            <div> CHOOSE LEVEL</div>
            <div className="levelButton">
              {difficultyLevel.map((level) => (
                <button
                  className="button"
                  key={level.speed}
                  onClick={() => handleLevel(level)}
                >
                  {" "}
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {startgame && <Game speed={speed} addScore={addScore} score={score} />}
      <div className="score">
        <div>{level}</div>
        <div>SCORE : {score}</div>
      </div>
    </div>
  );
}

export default App;
