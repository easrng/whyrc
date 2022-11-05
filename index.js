const express=require("express")
const util=require("util")
const IRC = require('irc-framework');
const sockly = require('sockly');
const expressWs = require('express-ws')
const fs=require("fs").promises;
(async()=>{
    const app=express()
    expressWs(app)
    app.use(express.static("public"))
    app.ws("/connect", (ws, req) => {
        let nick=process.env.USER
        let ircClient = new IRC.Client();
        ircClient.connect({
            host: 'localhost',
            port: 6667,
            nick
        });
        let actions={
            async send(channel, message){
                ircClient.say(channel, message)
            },
            async join(channel){
                ircClient.join(channel)
            },
            async handler(fn){
                console.log(fn)
            },
            nick:()=>{
                console.log(nick)
                return nick
            }
        }
        ircClient.on('message', e=>{
            if(e.nick=="discord")
            remote.message(e.target, e.nick, e.message, e.tags, e.hostname, e.ident, e.from_server)
        });
        ws.on('close', ()=>{
            console.log("Connection closed, stopping IRC client.")
            ircClient.quit()
        })
        sockly.expose(actions, ws)
        let remote=sockly.link(ws)
    })

    try{
        await fs.unlink(process.env.HOME+"/.whyrcsocket")
    }catch(e){
        // ignore
    }
    const listener=app.listen(`${process.env.HOME}/.whyrcsocket`, async ()=>{
        await fs.chmod(listener._pipeName, "700")
        console.log(`To connect, run ssh -N -L localhost:8119:${listener._pipeName} ${process.env.USER}@unix.lgbt then open http://localhost:8119/ in your browser.`)
    })
})()