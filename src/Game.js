import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function Game(props) {
  const [direction, setDirection] = useState("DOWN");
  const [snake, setSnake] = useState([
    { x: 2, y: 4 },
    { x: 2, y: 3 },
    { x: 2, y: 2 },
  ]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef();
  const [gamePaused, setGamePaused] = useState(false);

  const isGameOver = (head) => {
    if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 20) {
      return true;
    } else {
      return snake.some((s) =>
        s.x === head.x && s.y === head.y ? true : false
      );
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!gamePaused) {
        switch (event.keyCode) {
          case 37:
            setDirection((prevDirection) => {
              return prevDirection === "RIGHT" ? "RIGHT" : "LEFT";
            });
            break;
          case 38:
            setDirection((prevDirection) => {
              return prevDirection === "DOWN" ? "DOWN" : "UP";
            });
            break;
          case 39:
            setDirection((prevDirection) => {
              return prevDirection === "LEFT" ? "LEFT" : "RIGHT";
            });
            break;
          case 40:
            setDirection((prevDirection) => {
              return prevDirection === "UP" ? "UP" : "DOWN";
            });
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [gamePaused]);

  useEffect(() => {
    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        default:
          break;
      }
      newSnake.unshift(head);

      // Check for food captured by snake
      if (snake[0].x === food.x && snake[0].y === food.y) {
        const newFood = {
          x: Math.floor(Math.random() * 30),
          y: Math.floor(Math.random() * 20),
        };
        setFood(newFood);
        props.addScore(5);
      } else {
        newSnake.pop();
      }

      if (isGameOver(head)) {
        console.log("Game over");
        clearInterval(intervalRef.current);
        setGameOver(true);
      } else {
        setSnake(newSnake);
      }
    };
    if (!gamePaused) {
      intervalRef.current = setInterval(() => {
        moveSnake();
      }, props.speed);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [snake, direction, gamePaused]);

  const handleClick = () => {
    if (gameOver) {
      setGameOver(!gameOver);
      const newSnake = [
        { x: 2, y: 4 },
        { x: 2, y: 3 },
        { x: 2, y: 2 },
      ];
      setSnake(newSnake);
      props.resetScore();
      setGamePaused(false);
      setDirection("DOWN");
    } else {
      setGamePaused(!gamePaused);
    }
  };

  return (
    <>
      <div className="game" onClick={handleClick}>
        {!gameOver &&
          Array.from({ length: 30 }).map((_, col) => (
            <div key={col} className="row">
              {Array.from({ length: 20 }).map((_, row) => (
                <div
                  key={row}
                  className={`cell ${
                    snake.some((s) => s.x === col && s.y === row) ? "snake" : ""
                  } ${gamePaused ? "paused" : ""}`}
                >
                  {food.x === col && food.y === row ? (
                    <div className="cell food"> </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        {gameOver && (
          <div className="gameover">
            <p>GAME OVER</p>
            <p>YOUR SCORE : {props.score}</p>
          </div>
        )}
      </div>
    </>
  );
}
