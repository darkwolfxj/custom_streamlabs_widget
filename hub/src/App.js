import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import twitch from "./twitch.png";
import dlive from "./dlive.png";
import audio from "./notif.mp3";

function App() {
    const [activity, setActivity] = useState([]);
    const [mostRecent, setMostRecent] = useState();
    const [isClicked, setIsClicked] = useState(false);
    const [play, setPlay] = useState(false);
    let currLen = 0;
    let newLen = 0;
    const aud = document.getElementById("audio");
    const pl = play ? setPlay(false) : null;
    const go = play ? aud.play() : null;
    const activityGetter = () => 
        axios.get("https://custom-streamlabs-widget-api.herokuapp.com/")
            .then(res => {
                const formAct = []
                //eslint-disable-next-line
                newLen = res.data.length/2
                if (newLen !== currLen){
                    //eslint-disable-next-line
                    currLen = newLen;
                    for(let i=0; i<res.data.length;i+=2){
                        formAct.push((res.data[i].includes(" Twitch") ? res.data[i].replace(" Twitch", "") : res.data[i].replace(" DLive", "")) + " " + res.data[i + 1]);
                    }
                    if(!!document.getElementById("a"))document.getElementById("a").classList.add("anim")
                    setActivity(formAct);
                    setMostRecent(formAct.shift())
                    setTimeout(() => Array.from(document.getElementsByClassName("anim")).map(x => x.classList.remove("anim")), 1000)
                    setPlay(true)
                }
                })
    useEffect(() => {
        if(isClicked){
            setInterval(activityGetter, 0);
        }
        // eslint-disable-next-line
        }, [isClicked])
  return (
    <div className="App">
        {
            isClicked
                ? 
                    (
                        <>
                            <div style={{display: "flex", flexDirection: "column-reverse", justifyContent: "space-between", width: "99%"}}>
                                <div style={{display: "flex", justifyItems: "center"}}>
                                    <iframe height="200px" style={{borderRadius: "25px"}} width="200%" id="restream-chat" title="ReStream Chat" src="https://chat.restream.io/embed?token=7853956a-96dd-4ae3-9634-9e4dcdc2317b"/>
                                </div>
                                <div style={{display: "flex", justifyContent: "space-around", margin: "2px"}}>
                                    <button style={{color: "white", backgroundColor: "green", border: "none", borderRadius: "25px"}} onClick={() => axios.get("https://custom-streamlabs-widget-api.herokuapp.com/")}>Refresh</button>
                                    <button style={{color: "white", backgroundColor: "red", border: "none", borderRadius: "25px"}} onClick={() => axios.post("https://custom-streamlabs-widget-api.herokuapp.com/reset").then(() => console.log("reset successfully"))}>Reset</button>
                                </div>
                            </div>    
                            <div id="activity" className="activity" style={{display: "flex", flexDirection: "column", width: "96.5%", height: "210px", overflowY: "scroll", borderRadius: "25px", padding: "10px", border: "1px solid rgba(0,0,0,0)", boxSizing: "content-box"}}>

                                {
                                    mostRecent ? 
                                        <div id="a" style={{display: "flex", flexDirection: "row"}}>
                                            <img alt={`${mostRecent} type`} height="30px" src={mostRecent.includes("Twitch") ? twitch : dlive}/>
                                            <p>{mostRecent.includes("Twitch") ? mostRecent.replace(" Twitch", "") : mostRecent.replace(" DLive", "")}</p>
                                            
                                        </div>
                                    : <></>
                                }
                                {
                                    activity.map(x => {
                                        return (
                                        <div key={Math.random()} className="act" style={{display: "flex", flexDirection: "row"}}>
                                            <img alt={`${x} type`} height="30px" src={x.includes("Twitch") ? twitch : dlive}/>
                                            <p>{x.includes("Twitch") ? x.replace(" Twitch", "") : x.replace(" DLive", "")}</p>
                                        </div>
                                        )
                                    }
                                    )
                                }
                            </div> 
                            <audio function={setInterval(pl && go, 0)} id="audio" src={audio} />
                        </>
                    )
                : 
                    (
                        <div onClick={() => setIsClicked(true)} style={{position: "absolute", left: 0, top: 0, height: "1000vw", width: "1000vw", display: isClicked ? "none" : "flex", backgroundColor: "black", textAlign: "center", color: "white", fontSize: "200px"}}>Click me</div>
                    )
        } 
    </div>
  );
}

export default App;
