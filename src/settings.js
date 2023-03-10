import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

// agora app id
const appId = process.env.REACT_APP_APPID;
// channel token
const token = process.env.REACT_APP_CHANNEL_TOKEN;

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "Main";