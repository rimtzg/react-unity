import { Unity, useUnityContext } from "react-unity-webgl";

function UnityPage() {
    const { unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
        loaderUrl    : "game/game.loader.js",
        dataUrl      : "game/game.data",
        frameworkUrl : "game/game.framework.js",
        codeUrl      : "game/game.wasm",
    })

    function handleClickMessage(){
        sendMessage("GameController", "PrintMessage", "ASDF")
    }

    // useEffect(() => {
    //     addEventListener("ClickPhantom", handleClickPhantom)
    //     addEventListener("CheckIfPhantom", checkIfPhantom)
    //     return () => {
    //         removeEventListener("ClickPhantom", handleClickPhantom)
    //         removeEventListener("CheckIfPhantom", checkIfPhantom)
    //     }
    // }, [addEventListener, removeEventListener, handleClickPhantom, checkIfPhantom])

    return (
        <div>
            <Unity style={{width:'100%',height:"80vh"}} unityProvider={unityProvider} />
            <button onClick={handleClickMessage}>Send message</button>
        </div>
    )
}

export default UnityPage;