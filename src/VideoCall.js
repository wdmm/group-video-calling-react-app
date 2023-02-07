import { useEffect, useState } from "react";
import { config, useClient, useMicrophoneAndCameraTracks, channelName } from "./settings";
import { Grid } from "@material-ui/core";
import Controls from "./Controls";
import Video from "./Video";

export default function VideoCall(props) {
    const { setInCall } = props;
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();

    useEffect(() => {
        let init = async (name) => {
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                if (mediaType === "video") {
                    setUsers((prevUsers) => {
                        return [...prevUsers, user];
                    });
                };
                if (mediaType === "audio") {
                    user.audioTrack.play();
                };
            });

            client.on("user-unpublished", (user, mediaType) => {
                if (mediaType === "video") {
                    setUsers((prevUsers) => {
                        return prevUsers.filter((User) => User.uid !== user.uid);
                    });
                };
                if (mediaType === "audio") {
                    if (user.audioTrack) {
                        user.audioTrack.stop();
                    };
                };
            });

            client.on("user-left", (user, mediaType) => {
                setUsers((prevUsers) => {
                    return prevUsers.filter((User) => User.uid !== user.uid);
                });
            });

            try {
                await client.join(config.appId, name, config.token, null);
            } catch (error) {
                console.log("Error: \n", error);
            };

            if (tracks) {
                await client.publish([tracks[0], tracks[1]]);
            };

            setStart(true);
        };

        if (ready && tracks) {
            console.log("APP ID: ", config.appId, "\nTOKEN: ", config.token)
            try {
                init(channelName);
            } catch (error) {
                console.log("Error: \n", error);
            };
        };

     }, [channelName, client, ready, tracks]);


     return (
        <Grid container direction="column" style={{height: "100%"}}>
            <Grid item style={{height: "5%"}}>
                { ready && tracks && (<Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />) }
            </Grid>
            <Grid item style={{height: "95%"}}>
                { start && tracks && (<Video tracks={tracks} users={users} />) }
            </Grid>
        </Grid>
     );
};