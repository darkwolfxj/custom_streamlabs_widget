import './App.css';
import { useEffect, useState } from 'react';
import axios from "axios";
import twitch from "./twitch.png"
import dlive from "./dlive.png"

function App() {
    const [activity, setActivity] = useState([])
    let currLen = 0;
    let newLen = 0;
    useEffect(() => {
        const activityGetter = () => 
        axios.get("https://custom-streamlabs-widget-api.herokuapp.com/")
            .then(res => {
                console.log("this is res.data", res.data)
                const formAct = []
                // eslint-disable-next-line
                newLen = res.data.length/2
                if (newLen !== currLen){
                // eslint-disable-next-line
                    currLen = newLen;
                    for(let i=0; i<res.data.length;i+=2){
                        formAct.push((res.data[i].includes(" Twitch") ? res.data[i].replace(" Twitch", "") : res.data[i].replace(" DLive", "")) + " " + res.data[i + 1]);
                    }
                    console.log(formAct)
                    setActivity(formAct)
                    console.log("this is activity: ", activity)
                }
                
            })
        setInterval(activityGetter, 3000)
    },[activity])
    
  return (
    <div className="App">
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <div>
                <iframe title="ReStream Chat" src="https://chat.restream.io/embed?token=7853956a-96dd-4ae3-9634-9e4dcdc2317b"/>
            </div>
            <div>
                <button onClick={() => axios.post("https://custom-streamlabs-widget-api.herokuapp.com/reset").then(() => console.log("reset successfully"))}>Reset</button>
            </div>
        </div>    
                <>
            {
                activity.map(x => {
                    console.log("rendered ", x)
                            return (
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <img alt={`${x} type`} height="30px" src={x.includes("Twitch") ? twitch : dlive}/>
                                <p>{x.includes("Twitch") ? x.replace(" Twitch", "") : x.replace(" DLive", "")}</p>
                            </div>)
                            }
                )
            }
        </>
    </div>
  );
}

export default App;