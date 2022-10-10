import './App.css';

import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
    const { unityProvider, sendMessage } = useUnityContext({
        loaderUrl    : "game/game.loader.js",
        dataUrl      : "game/game.data",
        frameworkUrl : "game/game.framework.js",
        codeUrl      : "game/game.wasm",
    });

    function handleClickMessage() {
        sendMessage("GameController", "printMessage", "asdf");
    }

    return (
        <div className="App">
            <Unity style={{width:'100%',height:"80vh"}} unityProvider={unityProvider} />
            <button onClick={handleClickMessage}>Send message</button>
        </div>
    );
}

export default App;
