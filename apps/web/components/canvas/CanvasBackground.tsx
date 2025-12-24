import { RefObject } from 'react';

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

const CanvasBackground = ({ canvasRef }: Props) => {
  return (
    <canvas
      ref={canvasRef}
      className='pointer-events-none absolute top-0 left-0'
    />
  );
};

export default CanvasBackground;
