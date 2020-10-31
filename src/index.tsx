import React, { useState, useRef } from "react";
import Measure from "react-measure";
import { useUserMedia } from "./hooks/use-user-media";
import { useCardRatio } from "./hooks/use-card-ratio";
import { useOffsets } from "./hooks/use-offsets";
import { useFaceMeshFmPredictions } from "./hooks/use-facemesh-predictions";
import {
  Video,
  Canvas,
  Wrapper,
  Container,
  Button
} from "./style";

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: "environment" }
};

export const Skinmesh = ({ facePrediction }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);


  const [container, setContainer] = useState({ width: 0, height: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);

  const mediaStream = useUserMedia(CAPTURE_OPTIONS);
  const [aspectRatio, calculateRatio] = useCardRatio(1.586);

  // https://github.com/typescript-cheatsheets/react/issues/187
  const vc = videoRef.current as any
  const cc = canvasRef.current as any

  const offsets = useOffsets(
    videoRef.current && vc.videoWidth,
    videoRef.current && vc.videoHeight,
    container.width,
    container.height
  );


  const {
    loading,
    error,
    getFmPrediction,
    resetFmPrediction,
    fmPrediction
  } = useFaceMeshFmPredictions(canvasRef);

  React.useEffect(() => {
    if (!isCanvasEmpty) {
      facePrediction(fmPrediction)
      getFmPrediction();
      setIsCanvasEmpty(true);
    }
  }, [isCanvasEmpty, getFmPrediction, fmPrediction, loading, error]);

  if (mediaStream && videoRef.current && !vc.srcObject) {
    vc.srcObject = mediaStream;
  }

  function handleResize(contentRect) {
    setContainer({
      width: contentRect.bounds.width,
      height: Math.round(contentRect.bounds.width / aspectRatio)
    });
  }

  function handleCanPlay() {
    calculateRatio(vc.videoHeight, vc.videoWidth);
    setIsVideoPlaying(true);
    vc.play();
  }

  function handleCapture() {
    const context = cc.getContext("2d");

    context.drawImage(
      videoRef.current,
      offsets.x,
      offsets.y,
      container.width,
      container.height,
      0,
      0,
      container.width,
      container.height
    );

    setIsCanvasEmpty(false);
  }

  function handleClear() {
    const context = cc.getContext("2d");
    context.clearRect(0, 0, cc.width, cc.height);
    setIsCanvasEmpty(true);
    resetFmPrediction();
  }

  if (!mediaStream) {
    return null;
  }

  return (
    <Measure bounds onResize={handleResize} >
      {({ measureRef }) => (
        <Wrapper>
          <Container
            ref={measureRef}
            maxHeight={videoRef.current && vc.videoHeight}
            maxWidth={videoRef.current && vc.videoWidth}
            style={{
              height: `${container.height}px`
            }}
          >
            <Video
              ref={videoRef}
              hidden={!isVideoPlaying}
              onCanPlay={handleCanPlay}
              autoPlay
              playsInline
              muted
              style={{
                top: `-${offsets.y}px`,
                left: `-${offsets.x}px`
              }}
            />


            <Canvas
              ref={canvasRef}
              width={container.width}
              height={container.height}
            />

          </Container>

          {isVideoPlaying && (
            <Button onClick={isCanvasEmpty ? handleCapture : handleClear}>
              {isCanvasEmpty ? "Take a picture" : "Take another picture"}
            </Button>
          )}
        </Wrapper>
      )}
    </Measure>
  );
}