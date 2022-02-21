import { useCallback, useRef, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import './video-crop.css';

export interface Dimensions {
  width: number;
  height: number;
}

export type CoordinateAndDimensions = {
  x: number;
  y: number;
} & Dimensions;

export interface Props {
  children: any;
  onCrop: (displayedVideoSize: Dimensions, selector: CoordinateAndDimensions) => void;
}

export const VideoCrop = (props: Props) => {

  const [isCropping, setIsCropping] = useState(false);
  const [{ x, y, width, height }, api] = useSpring(() => ({ x: 0, y: 0, width: 100, height: 100 }));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragEl = useRef<HTMLDivElement | null>(null);

  const bind = useDrag((state) => {
    const isResizing = (state?.event.target === dragEl.current);
    if (isResizing) {
      api.set({
        width: state.offset[0],
        height: state.offset[1],
      });
    } else {
      api.set({
        x: state.offset[0],
        y: state.offset[1],
      });
    }
  }, {
    from: (event) => {
      const isResizing = (event.target === dragEl.current);
      if (isResizing) {
        return [width.get(), height.get()];
      } else {
        return [x.get(), y.get()];
      }
    },
    bounds: (state) => {
      const isResizing = (state?.event.target === dragEl.current);
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const containerHeight = containerRef.current?.clientHeight ?? 0;
      if (isResizing) {
        return {
          top: 50,
          left: 50,
          right: containerWidth - x.get(),
          bottom: containerHeight - y.get(),
        };
      } else {
        return {
          top: 0,
          left: 0,
          right: containerWidth - width.get(),
          bottom: containerHeight - height.get(),
        };
      }
    },
  });

  const onCancel = useCallback(() => {
    setIsCropping(false);
  }, []);

  const onDone = useCallback(() => {
    setIsCropping(false);
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const containerHeight = containerRef.current?.clientHeight ?? 0;
    const displayedVideoSize: Dimensions = {
      width: containerWidth,
      height: containerHeight,
    };
    const selector: CoordinateAndDimensions = {
      x: x.get(),
      y: y.get(),
      width: width.get(),
      height: height.get(),
    };
    props.onCrop(displayedVideoSize, selector);
  }, [props.onCrop]);

  const onEnterCropMode = useCallback(() => {
    setIsCropping(true);
    api.set({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  }, []);

  return (
    <div className='container' ref={containerRef}>
      <div>
        {Boolean(isCropping) &&
          <animated.div className='cropped-area' style={{ x, y, width, height }} {...bind()}>
            <div className='resizer' ref={dragEl}></div>
          </animated.div>
        }
        {props.children}
      </div>
      <div className='overlay-controls'>
        {Boolean(isCropping) &&
          <>
            <span onClick={onCancel}>🚫</span>
            <span onClick={onDone}>✅</span>
          </>
        }
        {Boolean(!isCropping) &&
          <span onClick={onEnterCropMode}>✂️</span>
        }
      </div>
    </div >
  );

};