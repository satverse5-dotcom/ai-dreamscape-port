import { useState } from "react";
import { askAI } from "@/services/api";

export default function Chat(){
  const [msg,setMsg]=useState("");
  const [reply,setReply]=useState("");

  const send = async ()=>{
    const data = await askAI(msg);
    setReply(data.reply);
  };

  return(
    <div>
      <input onChange={e=>setMsg(e.target.value)} />
      <button onClick={send}>Ask</button>
      <p>{reply}</p>
    </div>
  )
}