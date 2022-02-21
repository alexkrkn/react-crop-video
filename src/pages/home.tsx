import { useCallback, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PauseIcon from '@mui/icons-material/Pause';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import { Loading } from '../components/loading';
import { CoordinateAndDimensions, Dimensions, VideoCrop } from '../components/video-crop';
import { useEditVideo } from '../use-edit-video';
import round from 'lodash.round';
import './home.css';

const convertDimensions = (realVideoSize: Dimensions, displayedVideoSize: Dimensions, cropSelection: CoordinateAndDimensions) => {
  const ratioX = (realVideoSize.width / displayedVideoSize.width);
  const ratioY = (realVideoSize.height / displayedVideoSize.height);
  const x = round(cropSelection.x * ratioX, 1);
  const y = round(cropSelection.y * ratioY, 1);
  const width = round(cropSelection.width * ratioX, 1);
  const height = round(cropSelection.height * ratioY, 1);
  return { x, y, width, height };
};

export const HomePage = () => {

  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [assetId, setAssetId] = useState('');
  const [videoSize, setVideoSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

  const [title, setTitle] = useState('Enter a Video Url');
  const [video, setVideo] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const vidRef = useRef<HTMLVideoElement | null>(null);

  const { createAsset, crop } = useEditVideo();

  const onSetVideoUrl = useCallback(async () => {
    setIsLoading(true);
    const asset = await createAsset(videoUrlInput);
    setAssetId(asset.id);
    setVideoSize({ width: asset.width ?? 0, height: asset.height ?? 0 });
    setTitle('Crop Video');
    setVideo(videoUrlInput);
    setIsLoading(false);
  }, [videoUrlInput]);

  const onChangeInputUrl = useCallback(async (e) => {
    setVideoUrlInput(e.target.value);
  }, []);

  const onPause = useCallback(async () => {
    setIsPlaying(false);
    vidRef.current?.pause();
  }, []);

  const onRewind = useCallback(async () => {
    setIsPlaying(false);
    if (vidRef.current) {
      vidRef.current.currentTime = 0;
    }
  }, []);

  const onPlay = useCallback(async () => {
    setIsPlaying(true);
    vidRef.current?.play();
  }, []);

  const onCrop = useCallback(async (displayedVideoSize: Dimensions, selector: CoordinateAndDimensions) => {
    setIsLoading(true);
    const { x, y, width, height } = convertDimensions(videoSize, displayedVideoSize, selector);
    const asset = await crop(assetId, x, y, width, height);
    const resultUrl = `https://assets.videoapikit.com/${asset.id}.${asset.ext}`;
    alert(resultUrl);
    setIsLoading(false);
  }, [videoSize, assetId]);

  return <div className='page'>

    <Stack direction="column" alignItems="center" spacing={6}>

      <h1>{title}</h1>

      {Boolean(!video) &&
        <>
          <input className='input-url' placeholder='https://example.com/video.mp4' value={videoUrlInput} type="url" onChange={onChangeInputUrl} />
          <Button startIcon={<CheckIcon />} variant="contained" onClick={onSetVideoUrl}>
            Edit Video
          </Button>
        </>
      }
      {Boolean(video) &&
        <>
          <div className='video-container'>
            <VideoCrop onCrop={onCrop}>
              <video loop muted autoPlay={isPlaying} width="300" src={video} ref={vidRef} />
            </VideoCrop>
          </div>

          {Boolean(isPlaying) &&
            <Button variant="contained">
              <PauseIcon onClick={onPause} />
            </Button>
          }

          {Boolean(!isPlaying) &&
            <div>
              <Button variant="contained">
                <FastRewindIcon onClick={onRewind} />
              </Button>
              <Button sx={{ marginLeft: 1 }} variant="contained">
                <PlayArrowIcon onClick={onPlay} />
              </Button>
            </div>
          }
        </>
      }
    </Stack>
    <Loading isShow={isLoading} />
  </div>

};