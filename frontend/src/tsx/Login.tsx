import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react';
import '../css/Login.css'
import { GameContext, PlayerRole } from './GameContext';
import socket from '../socket';

function Login() {
  let navigate = useNavigate();
  let [pseudo, setPseudo] = useState("");
  const {setPlayer, setGame} = useContext(GameContext);

  useEffect(() => {
    const joinSuccess = (data: {role: PlayerRole; gameState: any}) => {
      setPlayer({pseudo, role: data.role});
      setGame(data.gameState);
      navigate("/game");
    };

    const handleError = (msg: string) => alert(msg);

    socket.on("join-success", joinSuccess);
    socket.on("error", handleError);

    return () => {
      socket.off("join-success", joinSuccess);
      socket.off("error", handleError);
    };
  }, [pseudo, setPlayer, setGame, navigate]);

  const hostGame = () => {
    if(!pseudo.trim()) return alert("Veuillez entrer un pseudo");
    socket.connect();
    socket.emit("host-game", pseudo);
  };

  const joinGame = () => {
    if(!pseudo.trim()) return alert("Veuillez entrer un pseudo");
    socket.connect();
    socket.emit("join-game", pseudo);
  };

  return (
    <>
      <h1>Le quiz des copains</h1>
      <div id="login">
        <div>
          <label htmlFor='pseudo'>Pseudo : </label>
          <input type="text" name='pseudo' maxLength={12} onChange={(e) => setPseudo(e.target.value)}/>
        </div>
        <div id='game'>
          <button id='play' onClick={joinGame} disabled={!pseudo}>Jouer</button>
          <button id='host' onClick={hostGame} disabled={!pseudo}>Host</button>
        </div>
        <button id='make' onClick={() => navigate('/make')}>Créer une grille</button>
      </div>
    </>
  )
}

export default Login;
