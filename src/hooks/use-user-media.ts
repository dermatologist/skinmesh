import { useState, useEffect } from "react";

export interface IMediaStream {
    getTracks: any;
}
export function useUserMedia(requestedMedia) {
    const [mediaStream, setMediaStream] = useState<IMediaStream | undefined>(undefined);

    useEffect(() => {
        async function enableVideoStream() {
            try {
                const stream:any = await navigator.mediaDevices.getUserMedia(
                    requestedMedia
                );
                setMediaStream(stream);
            } catch (err) {
                // Handle the error
            }
        }

        if (!mediaStream) {
            enableVideoStream();
            return mediaStream
        } else {
            return function cleanup() {
                mediaStream.getTracks().forEach(track => {
                    track.stop();
                });
            };
        }
    }, [mediaStream, requestedMedia]);

    return mediaStream;
}